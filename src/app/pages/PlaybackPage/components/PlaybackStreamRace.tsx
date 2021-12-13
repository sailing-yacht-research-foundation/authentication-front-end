import "leaflet/dist/leaflet.css";

import React, { useEffect, useRef, useState } from "react";
import { message } from "antd";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { MapContainer } from "react-leaflet";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { EventEmitter } from "events";
import { useLocation } from "react-router";
import queryString from "querystring";
import { generateLastHeading, normalizeSequencedGeometries } from "utils/race/race-helper";
import { Playback } from "./Playback";
import {
  selectCompetitionUnitDetail,
  selectCompetitionUnitId,
  selectElapsedTime,
  selectIsPlaying,
  selectRaceCourseDetail,
  selectVesselParticipants,
} from "./slice/selectors";
import { usePlaybackSlice } from "./slice";
import { MAP_DEFAULT_VALUE, RaceEmitterEvent, RaceStatus, WebsocketConnectionStatus, WSMessageDataType } from "utils/constants";
import { stringToColour } from "utils/helpers";
import { selectSessionToken, selectUserCoordinate } from "../../LoginPage/slice/selectors";
import { Leaderboard } from "./Leaderboard";
import { ModalCountdownTimer } from "./ModalCountdownTimer";
import { RaceMap } from "./RaceMap";
import { ExpeditionServerActionButtons } from "app/pages/CompetitionUnitCreateUpdatePage/components/ExpeditionServerActionButtons";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";

export const PlaybackStreamRace = (props) => {
  const streamUrl = `${process.env.REACT_APP_SYRF_STREAMING_SERVER_SOCKETURL}`;

  const [,setSocketUrl] = useState(streamUrl);
  const [eventEmitter,] = useState(new EventEmitter());

  const [participantsData, setParticipantsData] = useState([]);
  const [raceIdentity, setRaceIdentity] = useState({ name: "Race name", description: "Race description" });

  const dispatch = useDispatch();
  const location = useLocation();
  const parsedQueryString: any = queryString.parse(
    location.search.includes("?") ? location.search.substring(1) : location.search
  );

  const messageHistory = useRef<any[]>([]);
  const competitionUnitId = useSelector(selectCompetitionUnitId);
  const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);
  const vesselParticipants = useSelector(selectVesselParticipants);
  const isPlaying = useSelector(selectIsPlaying);
  const elapsedTime = useSelector(selectElapsedTime);
  const sessionToken = useSelector(selectSessionToken);
  const userCoordinate = useSelector(selectUserCoordinate);
  const raceCourseDetail = useSelector(selectRaceCourseDetail);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `${streamUrl}/authenticate?session_token=${sessionToken}`, {
    shouldReconnect: () => true
  }
  );

  const groupedPosition = useRef<any>({});
  const receivedPositionData = useRef<boolean>(false);
  const normalizedPositions = useRef<any[]>([]);

  const currentTimeRef = useRef<number>(0);
  const currentElapsedTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<any>(false);
  const mapElementRef = useRef<any>();

  const { actions } = usePlaybackSlice();

  const { t } = useTranslation();

  const connectionStatus = {
    [ReadyState.CONNECTING]: "connecting",
    [ReadyState.OPEN]: "open",
    [ReadyState.CLOSING]: "closing",
    [ReadyState.CLOSED]: "closed",
    [ReadyState.UNINSTANTIATED]: "uninstantiated",
  }[readyState];

  useEffect(() => {
    return () => {
      if (eventEmitter) {
        eventEmitter.removeAllListeners();
        eventEmitter.off(RaceEmitterEvent.PING, () => { });
        eventEmitter.off(RaceEmitterEvent.SEQUENCED_COURSE_UPDATE, () => { });
        eventEmitter.off(RaceEmitterEvent.ZOOM_TO_LOCATION, () => { });
        eventEmitter.off(RaceEmitterEvent.UPDATE_COURSE_MARK, () => { });
        eventEmitter.off(RaceEmitterEvent.ZOOM_TO_PARTICIPANT, () => { });
        eventEmitter.off(RaceEmitterEvent.RENDER_REGS, () => { });
        eventEmitter.off(RaceEmitterEvent.REMOVE_PARTICIPANT, () => { });
        eventEmitter.off(RaceEmitterEvent.LEG_UPDATE, () => { });
      }
      dispatch(actions.setElapsedTime(0));
      dispatch(actions.setRaceLength(0));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set socket url
  useEffect(() => {
    if (sessionToken) setSocketUrl(`${streamUrl}/authenticate?session_token=${sessionToken}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]);

  // Get vessel participants
  useEffect(() => {
    if (competitionUnitDetail?.vesselParticipantGroupId) {
      dispatch(
        actions.getVesselParticipants({ vesselParticipantGroupId: competitionUnitDetail.vesselParticipantGroupId })
      );
      dispatch(actions.getRaceCourseDetail({ raceId: competitionUnitDetail.id }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [competitionUnitDetail]);

  // Update local grouped result
  useEffect(() => {
    if (!!vesselParticipants?.length) {
      const currentValue = groupedPosition.current;

      const groupedResult = {};
      const participantTracks: any[] = [];
      vesselParticipants.forEach((vessParticipant) => {
        const { id } = vessParticipant;
        groupedResult[id] = { ...vessParticipant, positions: currentValue?.[id]?.positions || [] };

        const data = {
          type: "boat",
          track: [],
          competitor_name: vessParticipant?.vessel?.publicName,
          competitor_sail_number: vessParticipant?.vesselParticipantId,
          first_ping_time: 0,
          id: vessParticipant.id,
        };

        participantTracks.push(data);
      });
      groupedPosition.current = groupedResult;
    }

    handleDebug("=== Vessel Participants ===");
    handleDebug(vesselParticipants);
    handleDebug("===========================");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselParticipants]);

  // Manage last message from websocket
  useEffect(() => {
    if (lastMessage) {
      let parsedData: any = {};
      try {
        parsedData = JSON.parse(lastMessage.data);
        const { type, dataType, data } = parsedData;
        if (type === 'data') {
          if (dataType === WSMessageDataType.POSITION) {
            handleAddPosition(data);
          } else if (dataType === WSMessageDataType.VIEWER_COUNT) {
            handleSetViewsCount(data);
          } else if (dataType === WSMessageDataType.NEW_PARTICIPANT_JOINED) {
            addNewBoatToTheRace(data);
          } else if (dataType === WSMessageDataType.VESSEL_PARTICIPANT_REMOVED) {
            removeBoatFromTheRace(data);
          } else if (dataType === WSMessageDataType.MAKR_TRACK) {
            updateCourseMarksPosition(data);
          }
        }
      } catch (e) {
        console.error(e);
      }

      handleDebug("=== WS DATA ===");
      handleDebug(parsedData);
      handleDebug("===============");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  // Manage subscription of websocket
  useEffect(() => {
    if (connectionStatus === WebsocketConnectionStatus.OPEN) {
      dispatch(actions.setIsPlaying(true));
      sendJsonMessage({
        action: 'subscribe',
        data: {
          competitionUnitId: competitionUnitId,
        },
      });
    }

    if (connectionStatus === WebsocketConnectionStatus.CONNECTING) {
      dispatch(actions.setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus, competitionUnitId]);

  // Manage message of websocket status
  useEffect(() => {
    if (connectionStatus === WebsocketConnectionStatus.OPEN) message.success("Connected!");
    if (connectionStatus === WebsocketConnectionStatus.CONNECTING) message.info("Connecting...");

    handleDebug("=== Connection Status ===");
    handleDebug(connectionStatus);
    handleDebug("=========================");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus]);

  useEffect(() => {
    handleRenderCourseDetail(raceCourseDetail);

    handleDebug("=== Course Detail ===");
    handleDebug(raceCourseDetail);
    handleDebug("=====================");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raceCourseDetail]);

  // Normalize data every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      handleNormalizeTracksData();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send last positions every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      const currentNormalizedPositions = normalizedPositions.current;
      const currentIsPlaying = isPlayingRef.current;
      handleEmitRaceEvent(currentNormalizedPositions, currentIsPlaying, eventEmitter);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentElapsedTimeRef.current = elapsedTime;
  }, [elapsedTime]);

  useEffect(() => {
    if (competitionUnitDetail.id) {
      setRaceIdentity({
        name: competitionUnitDetail?.name,
        description: "",
      });
    }
  }, [competitionUnitDetail]);

  useEffect(() => {
    setTimeout(() => {
      handleResize();
    }, 200);
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      handleResize();
    }, 200);
  }, [raceIdentity]);


  const handleRenderCourseDetail = (course) => {
    const sequencedGeometries = course.courseSequencedGeometries;

    if (!sequencedGeometries) return;
    const mappedSequencedGeometries = normalizeSequencedGeometries(sequencedGeometries);

    eventEmitter.emit(RaceEmitterEvent.SEQUENCED_COURSE_UPDATE, mappedSequencedGeometries);
  };

  const addNewBoatToTheRace = (data) => {
    const { vesselParticipant, vessel, participant } = data;
    const { id } = vesselParticipant;

    if (groupedPosition?.current[id]) return;

    const currentValue = groupedPosition.current;

    groupedPosition.current[id] = {
      id: id,
      vessel,
      vesselParticipantId: id,
      positions: currentValue?.[id]?.positions || [],
      deviceType: 'boat',
      participant: { competitor_name: vessel?.publicName, competitor_sail_number: vessel?.id },
      color: stringToColour(id),
      leaderPosition: Object.keys(groupedPosition.current)?.length + 1,
    };

    message.info(t(translations.playback_page.competitor_joined, { competitor_name: participant?.publicName, boat_name: vessel?.publicName }));
  }

  const removeBoatFromTheRace = (data) => {
    const { vesselParticipant } = data;
    const { id, vessel } = vesselParticipant;

    if (groupedPosition?.current[id]) {
      delete groupedPosition?.current[id];
      eventEmitter.emit(RaceEmitterEvent.REMOVE_PARTICIPANT, id);
      message.info(t(translations.playback_page.boat_left_the_race, { boat_name: vessel?.publicName }));
    }
  }

  const updateCourseMarksPosition = (data) => {
    eventEmitter.emit(RaceEmitterEvent.UPDATE_COURSE_MARK, data);
  }

  const handleDebug = (value) => {
    if (parsedQueryString?.dbg !== "true") return;
    console.log(value);
  };

  const handleSetRaceLengthStreaming = (currentLength) => {
    dispatch(actions.setRaceLength(currentLength));
  };

  const handleSetElapsedTime = (elapsedTime) => {
    dispatch(actions.setElapsedTime(elapsedTime));
  };

  const handleResize = () => {
    if (mapElementRef.current) mapElementRef.current._container.style.height = `100%`;
  };

  const handleSetViewsCount = (data) => {
    if (data)
      dispatch(actions.setViewsCount(data?.count || 0));
  }

  // Noramalize data
  const handleNormalizeTracksData = () => {
    const grouped = groupedPosition.current;
    const groupedVesselCount = Object.keys(grouped)?.length > 0;

    if (!groupedVesselCount) return;
    if (!receivedPositionData.current) return;

    const currentNormalizedPositions = normalizedPositions.current;
    const currentTime = currentTimeRef.current;

    Object.keys(grouped).forEach((key, index) => {
      const { id, lastPosition, vessel, vesselParticipantId } = grouped[key];
      const isExist = currentNormalizedPositions.filter((nP) => nP.id === id);
      if (!isExist.length) {
        currentNormalizedPositions.push({
          id,
          deviceType: "boat",
          positions: [{ ...lastPosition, time: currentTime }],
          lastPosition,
          vesselParticipantId,
          participant: { competitor_name: vessel.publicName, competitor_sail_number: vessel.id },
          color: stringToColour(vesselParticipantId),
          leaderPosition: index + 1,
        });
      } else {
        isExist[0].positions.push({ ...lastPosition, time: currentTime });
        isExist[0].lastPosition = { ...lastPosition, time: currentTime };
        isExist[0].leaderPosition = index;
      }
    });

    // Add the current time ref
    currentTimeRef.current += 1000;

    // Stop when receieve no more data
    if (receivedPositionData.current) {
      receivedPositionData.current = false;
      handleSetRaceLengthStreaming(currentTimeRef.current);
    }
  };

  // Emit race event
  const handleEmitRaceEvent = (normalizedPositions, currentIsPlaying, eventEmitter) => {
    // Reject incomplete data
    if (!normalizedPositions || !normalizedPositions?.length || !eventEmitter || !currentIsPlaying) return;

    const currentTime = currentTimeRef.current;
    const currentElapsedTime = currentElapsedTimeRef.current;
    const currentPositions = normalizedPositions.map((boat) => {
      const positions = boat.positions.filter((pos) => pos.time <= currentElapsedTime);
      const lastPosition = positions[positions.length - 1];
      return { ...boat, positions, lastPosition };
    });

    // Emit latest event
    eventEmitter.emit(RaceEmitterEvent.PING, currentPositions);
    eventEmitter.emit(RaceEmitterEvent.LEG_UPDATE, currentPositions);
    handleUpdateLeaderPosition(currentPositions);

    handleDebug("=== Current Positions ===");
    handleDebug(currentPositions);
    handleDebug("=========================");

    if (currentElapsedTime < currentTime) {
      let nextElapsedTime = currentElapsedTimeRef.current + 1000;
      if (nextElapsedTime > currentTime) nextElapsedTime = currentTime;

      currentElapsedTimeRef.current = nextElapsedTime;
      handleSetElapsedTime(nextElapsedTime);
    }
  };

  const handleAddPosition = (data) => {
    messageHistory.current.push(data);

    const { raceData, lat, lon } = data;
    const { vesselParticipantId } = raceData;

    // Reject vessel participant id
    if (!vesselParticipantId) return;

    // Add position to groupedPosition
    const currentGroupedPosition = groupedPosition.current?.[vesselParticipantId];
    if (!currentGroupedPosition || !currentGroupedPosition?.id) return;

    // Get current available positions of each grouped positions
    const currentPositions = [...(currentGroupedPosition?.positions || [])];

    // Generate heading
    const positionLength = currentPositions.length;
    const previousCoordinate =
      positionLength >= 2
        ? [currentPositions[positionLength - 2].lon, currentPositions[positionLength - 2].lat]
        : [lon, lat];
    const heading = generateLastHeading(previousCoordinate, [lon, lat]);

    // Save data
    currentPositions.push({ lat, lon, heading });
    currentGroupedPosition.positions = currentPositions;
    currentGroupedPosition.lastPosition = { lat, lon, heading };

    groupedPosition.current[vesselParticipantId] = currentGroupedPosition;

    if (!receivedPositionData.current) receivedPositionData.current = true;
  };

  const handleUpdateLeaderPosition = (normalizedPosition) => {
    setParticipantsData(normalizedPosition);
  };

  const mapCenter = {
    lat: userCoordinate?.lat || MAP_DEFAULT_VALUE.CENTER.lat,
    lng: userCoordinate?.lon || MAP_DEFAULT_VALUE.CENTER.lng
  };

  return (
    <div style={{ height: "100%" }}>
      <MapContainer
        style={{
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
        center={mapCenter}
        zoom={MAP_DEFAULT_VALUE.ZOOM}
        whenCreated={(mapInstance: any) => (mapElementRef.current = mapInstance)}
        zoomSnap={0.2}
        zoomAnimation={false}
        markerZoomAnimation={false}
        fadeAnimation={false}
        zoomAnimationThreshold={0.1}
        inertia={false}
        zoomanim={false}
        animate={false}
        duration={0}
        easeLinearity={0}
      >
        <LeaderboardContainer style={{ width: "220px", position: "absolute", zIndex: 500, top: "16px", right: "16px" }}>
          <Leaderboard emitter={eventEmitter} participantsData={participantsData}></Leaderboard>
          <ModalCountdownTimer />
        </LeaderboardContainer>
        <RaceMap emitter={eventEmitter} />

        {competitionUnitDetail?.id
          && competitionUnitDetail?.status === RaceStatus.ON_GOING &&
          <StreamToExpeditionContainer>
            <ExpeditionServerActionButtons competitionUnit={competitionUnitDetail} />
          </StreamToExpeditionContainer>}
      </MapContainer>

      <div style={{ width: "100%", position: "relative" }}>
        <Playback emitter={eventEmitter} />
      </div>
    </div>
  );
};

const LeaderboardContainer = styled.div`
  transition: all 0.3s;
`;

const StreamToExpeditionContainer = styled.div`
  position: absolute;
  bottom: 160px;
  right: 10px;
  z-index: 501;
`;