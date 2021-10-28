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
import { generateLastHeading } from "utils/race/race-helper";
import { Playback } from "./Playback";
import {
  selectCompetitionUnitDetail,
  selectCompetitionUnitId,
  selectElapsedTime,
  selectIsPlaying,
  selectVesselParticipants,
} from "./slice/selectors";
import { usePlaybackSlice } from "./slice";
import { MAP_DEFAULT_VALUE } from "utils/constants";
import { stringToColour } from "utils/helpers";
import { selectSessionToken } from "../../LoginPage/slice/selectors";
import { Leaderboard } from "./Leaderboard";
import { ModalCountdownTimer } from "./ModalCountdownTimer";
import { RaceMap } from "./RaceMap";

export const PlaybackStreamRace = (props) => {
  const streamUrl = `${process.env.REACT_APP_SYRF_STREAMING_SERVER_SOCKETURL}`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socketUrl, setSocketUrl] = useState(streamUrl);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eventEmitter, setEventEmitter] = useState(new EventEmitter());

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
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `${streamUrl}/authenticate?session_token=${sessionToken}`
  );

  const groupedPosition = useRef<any>({});
  const receivedPositionData = useRef<boolean>(false);
  const normalizedPositions = useRef<any[]>([]);

  const currentTimeRef = useRef<number>(0);
  const currentElapsedTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<any>(false);
  const mapElementRef = useRef<any>();

  const { actions } = usePlaybackSlice();

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
        eventEmitter.off("ping", () => {});
        eventEmitter.off("leg-update", () => {});
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
      const parsedData = JSON.parse(lastMessage.data);
      const { type, dataType, data } = parsedData;
      if (type === "data" && dataType === "position") handleAddPosition(data);
    }
  }, [lastMessage]);

  // Manage subscription of websocket
  useEffect(() => {
    if (connectionStatus === "open") {
      dispatch(actions.setIsPlaying(true));
      sendJsonMessage({
        action: "subscribe",
        data: {
          competitionUnitId: competitionUnitId,
        },
      });
    }

    if (connectionStatus === "connecting") {
      dispatch(actions.setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus, competitionUnitId]);

  // Manage message of websocket status
  useEffect(() => {
    if (connectionStatus === "open") message.success("Connected!");
    if (connectionStatus === "connecting") message.info("Connecting...");

    handleDebug("=== Connection Status ===");
    handleDebug(connectionStatus);
    handleDebug("=========================");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus]);

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
    eventEmitter.emit("ping", currentPositions);
    eventEmitter.emit("leg-update", currentPositions);
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

  return (
    <div style={{ height: "100%" }}>
      <MapContainer
        style={{
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
        center={MAP_DEFAULT_VALUE.CENTER}
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
          <Leaderboard participantsData={participantsData}></Leaderboard>
          <ModalCountdownTimer />
        </LeaderboardContainer>
        <RaceMap emitter={eventEmitter} />
      </MapContainer>

      <div style={{ width: "100%", position: "relative" }}>
        <Playback />
      </div>
    </div>
  );
};

const LeaderboardContainer = styled.div`
  transition: all 0.3s;
`;
