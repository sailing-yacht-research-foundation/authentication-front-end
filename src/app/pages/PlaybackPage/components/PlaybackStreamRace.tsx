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
import { MAP_DEFAULT_VALUE, RaceDataUpdate, RaceEmitterEvent, RaceSource, RaceStatus, WebsocketConnectionStatus, WebsocketRaceEvent, WSMessageDataType, WSTrackingStateUpdate } from "utils/constants";
import { canStreamToExpedition, getBoatNameFromVesselParticipantObject, stringToColour } from "utils/helpers";
import { selectSessionToken, selectUserCoordinate } from "../../LoginPage/slice/selectors";
import { ModalCountdownTimer } from "./ModalCountdownTimer";
import { RaceMap } from "./RaceMap";
import { ExpeditionServerActionButtons } from "app/pages/CompetitionUnitCreateUpdatePage/components/ExpeditionServerActionButtons";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { KudosReaction } from "./KudosReaction";
import { ModalRacePostponed } from "./ModalRacePostponed";
import { ModalRaceCompleted } from "./ModalRaceCompleted";
import { ModalRaceCanceled } from "./ModalRaceCanceled";

export const PlaybackStreamRace = () => {
  const streamUrl = `${process.env.REACT_APP_SYRF_STREAMING_SERVER_SOCKETURL}`;

  const [, setSocketUrl] = useState(streamUrl);
  const [eventEmitter,] = useState(new EventEmitter());

  const [, setParticipantsData] = useState([]);
  const [raceIdentity, setRaceIdentity] = useState({ name: "Race name", description: "Race description" });

  const dispatch = useDispatch();
  const location = useLocation();
  const parsedQueryString: any = queryString.parse(
    location.search.includes("?") ? location.search.substring(1) : location.search
  );

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
        eventEmitter.off(RaceEmitterEvent.RENDER_SEQUENCED_COURSE, () => { });
        eventEmitter.off(RaceEmitterEvent.ZOOM_TO_LOCATION, () => { });
        eventEmitter.off(RaceEmitterEvent.UPDATE_COURSE_MARK, () => { });
        eventEmitter.off(RaceEmitterEvent.ZOOM_TO_PARTICIPANT, () => { });
        eventEmitter.off(RaceEmitterEvent.RENDER_REGS, () => { });
        eventEmitter.off(RaceEmitterEvent.REMOVE_PARTICIPANT, () => { });
        eventEmitter.off(RaceEmitterEvent.LEG_UPDATE, () => { });
        eventEmitter.off(RaceEmitterEvent.OCS_DETECTED, () => { });
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
      try {
        const message = JSON.parse(lastMessage.data);
        handleWSData(message);
        handleDebug("=== WS DATA ===");
        handleDebug(message);
        handleDebug("===============");
      } catch (e) {
        console.error(e);
      }
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
          dataTypes: ["-device-ping-meta"] // for excluding the data we don't need. Backend uses different data types to debug.
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

  const handleWSData = (wsMessage) => {
    const { type, dataType, data } = wsMessage;
    if (type === 'data') {
      switch (dataType) {
        case WSMessageDataType.POSITION:
          handleAddPosition(data);
          break;
        case WSMessageDataType.VIEWER_COUNT:
          handleSetViewsCount(data);
          break;
        case WSMessageDataType.NEW_PARTICIPANT_JOINED:
          addNewBoatToTheRace(data);
          break;
        case WSMessageDataType.VESSEL_PARTICIPANT_REMOVED:
          removeBoatFromTheRace(data);
          break;
        case WSMessageDataType.MARK_TRACK:
          updateCourseMarksPosition(data);
          break;
        case WSMessageDataType.COURSE_UPDATED:
          eventEmitter.emit(RaceEmitterEvent.UPDATE_COURSE, normalizeSequencedGeometries(data.courseSequencedGeometries));
          break;
        case WSMessageDataType.EVENT:
          if (data?.eventType === WebsocketRaceEvent.VESSEL_OCS) {
            eventEmitter.emit(RaceEmitterEvent.OCS_DETECTED, data?.vesselParticipantId);
          }
          break;
        case WSMessageDataType.TRACKING_STATE_UPDATE:
          const boatName = getBoatNameFromVesselParticipantObject(groupedPosition.current[data?.vesselParticipantId]);
          switch (data?.type) {
            case WSTrackingStateUpdate.PARTICIPANT_START_TRACKING:
              message.info(t(translations.playback_page.boat_started_tracking, { boat_name: boatName }));
              break;
            case WSTrackingStateUpdate.PARTICIPANT_STOP_TRACKING:
              message.info(t(translations.playback_page.boat_stopped_tracking, { boat_name: boatName }));
              eventEmitter.emit(RaceEmitterEvent.CHANGE_BOAT_COLOR_TO_GRAY, data?.vesselParticipantId);
              break;
            case WSTrackingStateUpdate.DISCONNECTED:
              message.info(t(translations.playback_page.boat_disconnected, { boat_name: boatName }));
              break;
          }
          break;
        case WSMessageDataType.START_TIME_UPDATE:
          if (data.competitionUnitId === competitionUnitId) {
            adjustCompetitionUnitStartTime(data.startTime ? (new Date(data.startTime)).toISOString() : null);
          }
          break;
        case WSMessageDataType.RACE_DATA_UPDATE:
          const raceData = data.detail;
          if (raceData?.id === competitionUnitId) {
            if (data.type === RaceDataUpdate.UPDATED) {
              adjustCompetitionUnitStartTime(raceData?.approximateStart ? raceData.approximateStart : null);
            } else if (data.type === RaceDataUpdate.STATUS_CHANGED
              && raceData?.status === RaceStatus.COMPLETED) {
              dispatch(actions.setCompetitionUnitDetail({
                ...competitionUnitDetail,
                status: RaceStatus.COMPLETED
              }));
            }
          }
          break;
      }
    }
  }

  const adjustCompetitionUnitStartTime = (time) => {
    if (competitionUnitDetail.startTime === time) return;
    dispatch(actions.setCompetitionUnitDetail({
      ...competitionUnitDetail,
      startTime: time
    }));
  }

  const handleRenderCourseDetail = (course) => {
    const sequencedGeometries = course.courseSequencedGeometries;

    if (!sequencedGeometries) return;
    const mappedSequencedGeometries = normalizeSequencedGeometries(sequencedGeometries);

    eventEmitter.emit(RaceEmitterEvent.RENDER_SEQUENCED_COURSE, mappedSequencedGeometries);
  };

  const addNewBoatToTheRace = (data) => {
    const { vesselParticipant, vessel, participant, position } = data;
    const { id } = vesselParticipant;

    if (groupedPosition?.current[id] || !position) return;

    groupedPosition.current[id] = {
      id: id,
      vessel,
      vesselParticipantId: id,
      positions: [],
      lastPosition: {  },
      deviceType: 'boat',
      participant: { competitor_name: vessel?.publicName, competitor_sail_number: vessel?.id },
      color: stringToColour(id),
      leaderPosition: Object.keys(groupedPosition.current)?.length + 1,
    };

    receivedPositionData.current = true;

    message.info(t(translations.playback_page.competitor_joined, { competitor_name: participant?.publicName, boat_name: vessel?.publicName }));
  }

  const removeBoatFromTheRace = (data) => {
    const { vesselParticipant } = data;
    const { id, vessel } = vesselParticipant;

    if (groupedPosition?.current[id]) {
      delete groupedPosition?.current[id];
      normalizedPositions.current = [...normalizedPositions.current].filter(vp => vp.id !== id);
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
    eventEmitter.emit(RaceEmitterEvent.UPDATE_BOAT_COLOR);
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
    const { raceData, lat, lon, calculatedData } = data;
    const { vesselParticipantId } = raceData;

    // Reject vessel participant id
    if (!vesselParticipantId) return;

    // Add position to groupedPosition
    const currentGroupedPosition = groupedPosition.current?.[vesselParticipantId];
    if (!currentGroupedPosition?.id) return;

    // Get current available positions of each grouped positions
    const currentPositions = [...(currentGroupedPosition?.positions || [])];

    // Generate heading
    const positionLength = currentPositions.length;
    const previousCoordinate =
      positionLength >= 2
        ? [currentPositions[positionLength - 2].lon, currentPositions[positionLength - 2].lat]
        : [lon, lat];

    let heading: number;
    if (calculatedData?.derivedCOG) { // maybe undefined?
      heading = calculatedData.derivedCOG;
    } else {
      heading = generateLastHeading(previousCoordinate, [lon, lat]);
      const previousHeading = currentGroupedPosition.previousHeading;
      if (previousHeading !== undefined && previousHeading !== null
        && Math.abs(heading - previousHeading) > 180) {
        heading = heading - 360;
      }
    }

    currentGroupedPosition.previousHeading = heading;

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
    <div style={{ height: "100%", position: "relative" }}>
      <LeaderboardContainer>
        <ModalRacePostponed />
        <ModalCountdownTimer />
        <ModalRaceCompleted />
        <ModalRaceCanceled />
      </LeaderboardContainer>
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
        <RaceMap emitter={eventEmitter} />

        {canStreamToExpedition(competitionUnitDetail.id, RaceSource.SYRF, competitionUnitDetail.status, competitionUnitDetail.calendarEvent?.isPrivate) &&
          <StreamToExpeditionContainer>
            <ExpeditionServerActionButtons competitionUnit={competitionUnitDetail} />
          </StreamToExpeditionContainer>}
        <KudosReaction />
      </MapContainer>

      <div style={{ width: "100%", position: "relative" }}>
        <Playback emitter={eventEmitter} />
      </div>
    </div>
  );
};

const LeaderboardContainer = styled.div`
  transition: all 0.3s;
  width: 220px;
  position: absolute;
  z-index: 500;
  top: 16px;
  right: 16px;
`;

const StreamToExpeditionContainer = styled.div`
  position: absolute;
  bottom: 160px;
  right: 10px;
  z-index: 501;
`;
