import "leaflet/dist/leaflet.css";

import React, { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { MapContainer } from "react-leaflet";
import styled from "styled-components";
import { useLocation } from "react-router";
import queryString from "querystring";
import {
  normalizeSimplifiedTracksPingTime,
  selectLatestPositionOfSimplifiedTracks,
  generateRetrievedTimestamp,
  generateStartTimeFetchAndTimeToLoad,
  generateVesselParticipantsLastPosition,
  normalizeSequencedGeometries,
  generateRaceLegsData,
  limitRaceLegsDataByElapsedTime,
  findNearestRetrievedTimestamp,
} from "utils/race/race-helper";
import { useDispatch, useSelector } from "react-redux";
import { EventEmitter } from "events";
import {
  selectCompetitionUnitDetail,
  selectCompetitionUnitId,
  selectElapsedTime,
  selectIsPlaying,
  selectRaceCourseDetail,
  selectRaceLegs,
  selectRaceLength,
  selectRaceSimplifiedTracks,
  selectRaceTime,
  selectVesselParticipants,
} from "./slice/selectors";
import { usePlaybackSlice } from "./slice";
import { MAP_DEFAULT_VALUE } from "utils/constants";
import { stringToColour } from "utils/helpers";
import { selectSessionToken } from "../../LoginPage/slice/selectors";
import { Leaderboard } from "./Leaderboard";
import { Playback } from "./Playback";
import { RaceMap } from "./RaceMap";
import { ConnectionLoader } from './ConnectionLoader';

export const PlaybackOldRace = (props) => {
  const streamUrl = `${process.env.REACT_APP_SYRF_STREAMING_SERVER_SOCKETURL}`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socketUrl, setSocketUrl] = useState(streamUrl);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eventEmitter, setEventEmitter] = useState(new EventEmitter());

  const [participantsData, setParticipantsData] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const parsedQueryString: any = queryString.parse(
    location.search.includes("?") ? location.search.substring(1) : location.search
  );

  const simplifiedTracksRef = useRef<any[]>([]);
  const vesselParticipantsRef = useRef<any>([]);
  const raceTimeRef = useRef<any>({});
  const retrievedTimestampsRef = useRef<number[]>([]);
  const raceLengthRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean | undefined>();
  const raceLegsRef = useRef<any>();
  const isStillFetchingFromBoatRenderRef = useRef<boolean>(false);

  const competitionUnitId = useSelector(selectCompetitionUnitId);
  const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);
  const vesselParticipants = useSelector(selectVesselParticipants);
  const isPlaying = useSelector(selectIsPlaying);
  const elapsedTime = useSelector(selectElapsedTime);
  const sessionToken = useSelector(selectSessionToken);
  const raceCourseDetail = useSelector(selectRaceCourseDetail);
  const raceLegs = useSelector(selectRaceLegs);
  const raceTime = useSelector(selectRaceTime);
  const raceSimplifiedTracks = useSelector(selectRaceSimplifiedTracks);
  const raceLength = useSelector(selectRaceLength);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `${streamUrl}/authenticate?session_token=${sessionToken}`
  );

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
        eventEmitter.off("ping", () => { });
        eventEmitter.off("track-update", () => { });
        eventEmitter.off("sequenced-courses-update", () => { });
        eventEmitter.off("zoom-to-location", () => { });
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

  useEffect(() => {
    // Get vessel participants
    if (competitionUnitDetail?.vesselParticipantGroupId)
      dispatch(
        actions.getVesselParticipants({ vesselParticipantGroupId: competitionUnitDetail.vesselParticipantGroupId })
      );

    // Get old race additional data
    if (competitionUnitDetail?.id) {
      dispatch(actions.getOldRaceData({ raceId: competitionUnitDetail.id }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [competitionUnitDetail]);

  // Manage subscription of websocket
  useEffect(() => {
    if (connectionStatus === "open" && isReady) {
      dispatch(actions.setIsPlaying(true));
      sendJsonMessage({
        action: "playback",
        data: {
          competitionUnitId: competitionUnitId,
          timeToLoad: 30,
        },
      });
    }

    if (connectionStatus === "connecting") {
      dispatch(actions.setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus, competitionUnitId, isReady]);

  // Manage message of websocket status
  useEffect(() => {
    if (connectionStatus === "open") handleSetIsConnecting(false);
    if (connectionStatus === "connecting") handleSetIsConnecting(true);

    handleDebug("=== Connection Status ===");
    handleDebug(connectionStatus);
    handleDebug("=========================");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus]);

  // Normalized simplified tracks
  useEffect(() => {
    if (raceTime?.start && raceSimplifiedTracks?.length) {
      const normalizedSimplifiedTracks = normalizeSimplifiedTracksPingTime(raceTime.start, raceSimplifiedTracks);
      simplifiedTracksRef.current = normalizedSimplifiedTracks;
    }
  }, [raceSimplifiedTracks, raceTime]);

  // Listen last message from web socket
  useEffect(() => {
    handleMessageFromWebsocket(lastMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  // Set vessel participants, update format to object
  useEffect(() => {
    if (vesselParticipants?.length) {
      const vesselParticipantsObject = {};
      vesselParticipants.forEach((vesselParticipant) => {
        // Set new participant data
        const newParticipantData = {
          ...vesselParticipant,
          deviceType: "boat",
          color: stringToColour(vesselParticipant.id),
          positions: [],
          lastPosition: {},
          participant: {
            competitor_name: vesselParticipant.vessel?.publicName,
            competitior_sail_number: vesselParticipant.vesselParticipantId,
          },
        };

        vesselParticipantsObject[vesselParticipant.id] = newParticipantData;
      });

      vesselParticipantsRef.current = vesselParticipantsObject;
      setIsReady(true);

      handleDebug("=== Vessel Participants ===");
      handleDebug(vesselParticipantsObject);
      handleDebug("===========================");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselParticipants]);

  useEffect(() => {
    raceTimeRef.current = raceTime;
  }, [raceTime]);

  useEffect(() => {
    raceLengthRef.current = raceLength;
  }, [raceLength]);

  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
  }, [elapsedTime]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (raceLegs?.length && raceTime?.start) {
      raceLegsRef.current = generateRaceLegsData(raceLegs, raceTime.start);
    }
  }, [raceLegs, raceTime]);

  useEffect(() => {
    handleRenderCourseDetail(raceCourseDetail);

    handleDebug("=== Course Detail ===");
    handleDebug(raceCourseDetail);
    handleDebug("=====================");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raceCourseDetail]);

  // Map available time
  useEffect(() => {
    const mapInterval = setInterval(() => {
      const vesselParticipants = vesselParticipantsRef.current;
      if (!!Object.keys(vesselParticipants).length) {
        handleMapRetrievedTimestamps(vesselParticipants);
      }
    }, 100);

    return () => {
      clearInterval(mapInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count the elapsed time
  useEffect(() => {
    // Render the boat
    const defaultInterval = 250;
    const interval = setInterval(() => {
      const elapsedTime = elapsedTimeRef.current;
      const isPlaying = isPlayingRef.current;
      handleRenderTheBoat(elapsedTime, isPlaying, defaultInterval);
      handleRenderLegs(elapsedTime, isPlaying);
    }, defaultInterval);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetIsConnecting = (value = false) => {
    dispatch(actions.setIsConnecting(value));
  };

  const handleDebug = (value) => {
    if (parsedQueryString?.dbg !== "true") return;
    console.log(value);
  };

  // Map retrieved timestamps
  const handleMapRetrievedTimestamps = (vesselParticipantsObject) => {
    const vesselParticipants = Object.keys(vesselParticipantsObject).map((key) => vesselParticipantsObject[key]);
    const retrievedTimestamps: number[] = generateRetrievedTimestamp(vesselParticipants);

    if (retrievedTimestamps.length === retrievedTimestampsRef.current.length) return;

    retrievedTimestampsRef.current = retrievedTimestamps;
    dispatch(actions.setRetrievedTimestamps(retrievedTimestamps));

    handleDebug("=== Retrieved Timestamps ===");
    handleDebug(retrievedTimestamps);
    handleDebug("============================");
  };

  // Handle message from websocket
  const handleMessageFromWebsocket = (lastMessage) => {
    if (!lastMessage?.data) return;
    const wsData = JSON.parse(lastMessage.data);

    if (wsData?.type === "data" && wsData?.dataType === "position") handleAddNewPosition(wsData.data);

    handleDebug("=== WS DATA ===");
    handleDebug(wsData);
    handleDebug("===============");
  };

  // Handle add new position to each vessel partiicpant
  const handleAddNewPosition = (source: any) => {
    const data = { ...source };
    const vesselParticipants = vesselParticipantsRef.current;
    const raceTime = raceTimeRef.current;

    if (!Object.keys(vesselParticipants)?.length || !data?.raceData?.vesselParticipantId || !raceTime.start) return;

    const currentVesselParticipantId = data?.raceData?.vesselParticipantId;
    if (!vesselParticipants[currentVesselParticipantId]) return;

    const selectedVesselParticipant = { ...vesselParticipants[currentVesselParticipantId] };

    data.raceData = undefined;
    data.timestamp = data.timestamp - raceTime.start;

    if (selectedVesselParticipant.positions?.length) {
      const similarTimestampPosition = selectedVesselParticipant.positions.filter(
        (position) => position.timestamp === data.timestamp
      );
      if (similarTimestampPosition.length) return;
    }

    selectedVesselParticipant.positions.push(data);
    selectedVesselParticipant.positions.sort((posA, posB) => posA.timestamp - posB.timestamp);

    vesselParticipants[currentVesselParticipantId] = selectedVesselParticipant;
  };

  const handleSetElapsedTime = (elapsedTime) => {
    if (elapsedTime < raceLengthRef.current)
      dispatch(actions.setElapsedTime(elapsedTime));
    else if (elapsedTime >= raceLengthRef.current)
      dispatch(actions.setElapsedTime(raceLengthRef.current));
  };

  // Handle request more data
  const handleRequestMoreRaceData = (nextDataTime) => {
    let timeToLoad = 30;
    let nextDateTimeCpy = nextDataTime;

    const startTime = raceTimeRef.current?.start || 0;
    const retrievedTimestamps = retrievedTimestampsRef.current;
    const raceLength = raceLengthRef.current;

    const roundedTarget = Math.round((nextDateTimeCpy - startTime) / 1000) * 1000;
    const roundedNextDateTime = roundedTarget + startTime;

    // Check if the app retrieved the time
    if (retrievedTimestamps.length && startTime) {
      const generatedSetup = generateStartTimeFetchAndTimeToLoad(
        retrievedTimestamps,
        startTime,
        roundedNextDateTime,
        raceLength || 0
      );

      // Reject if the timestamps is retrieved
      if (!generatedSetup) return;

      // Overide time to load and next data time
      if (generatedSetup.timeToLoad) timeToLoad = generatedSetup.timeToLoad;
      if (generatedSetup.nextDataTime) nextDateTimeCpy = generatedSetup.nextDataTime;
    }

    // Send the data via websocket
    sendJsonMessage({
      action: "playback",
      data: {
        competitionUnitId: competitionUnitId,
        startTimeFetch: nextDateTimeCpy,
        timeToLoad: timeToLoad,
      },
    });
  };

  const handlePlaybackClickedPosition = (targetTime) => {
    if (!simplifiedTracksRef?.current || !eventEmitter) return;
    const raceTime = raceTimeRef.current;

    // Zoom to location things
    const lastPosition = selectLatestPositionOfSimplifiedTracks(targetTime, simplifiedTracksRef.current);
    if (!lastPosition) return;

    eventEmitter.emit("zoom-to-location", lastPosition);

    // Request more race data
    const nextDateTime = targetTime + raceTime.start;
    handleRequestMoreRaceData(nextDateTime);
  };

  const handleRenderTheBoat = (elapsedTime, isPlaying, interval) => {
    // Check if the elapsed time is retrieved
    const retrievedTimestamps = retrievedTimestampsRef.current;
    const raceTimeStart = raceTimeRef.current.start;
    const vesselParticipants = vesselParticipantsRef.current;
    const isStillFetchingFromBoatRender = isStillFetchingFromBoatRenderRef.current;

    // If no retrieved timestamps
    if (!retrievedTimestamps.length) return;

    // If the retrievedTimeStamps doensn't have the elapsed time
    if (!retrievedTimestamps.includes(elapsedTime)) {
      // Find the nearest
      const nearest = findNearestRetrievedTimestamp(retrievedTimestamps, elapsedTime, 1000);
      if (!nearest?.previous?.length && !isStillFetchingFromBoatRender) {
        isStillFetchingFromBoatRenderRef.current = true;
        handleRequestMoreRaceData(elapsedTime + raceTimeStart);
        return;
      }
    }

    if (!isPlaying) return;
    if (!Object.keys(vesselParticipants)?.length) return;

    isStillFetchingFromBoatRenderRef.current = false;
    const mappedVPs = generateVesselParticipantsLastPosition(vesselParticipants, elapsedTime, retrievedTimestamps);

    eventEmitter.emit("ping", mappedVPs);
    eventEmitter.emit("track-update", mappedVPs);

    // Check the next 2 - 10 seconds data
    handleCheckNextRaceData(elapsedTime);

    // Set elapsed time
    handleSetElapsedTime(elapsedTime + interval);

    handleUpdateLeaderPosition(mappedVPs);

    // Debug
    handleDebug("=== Mapped Vessel Participants ===");
    handleDebug(mappedVPs);
    handleDebug("==================================");
  };

  const handleRenderLegs = (elapsedTime, isPlaying) => {
    const vesselParticipants = vesselParticipantsRef.current;
    const raceLegs = raceLegsRef.current;

    if (!isPlaying) return;
    if (!Object.keys(vesselParticipants)?.length) return;
    if (!raceLegs?.length) return;

    const mappedRaceLegs = raceLegs.map((raceLeg) => {
      const currentVesselParticipant = vesselParticipants[raceLeg.vesselParticipantId];
      return {
        ...raceLeg,
        color: currentVesselParticipant?.color || "#00000000",
      };
    });

    const filteredRaceLegs = limitRaceLegsDataByElapsedTime(mappedRaceLegs, elapsedTime);
    eventEmitter.emit("render-legs", filteredRaceLegs);
  };

  const handleCheckNextRaceData = (elapsedTime) => {
    const retrievedTimestamps = retrievedTimestampsRef.current;
    const startRaceTime = raceTimeRef.current.start;

    // Check the next 2 second until the next 10 seconds
    const startTimeToCheck = elapsedTime + 2000;
    const maxTime = elapsedTime + 10000;

    for (let selectedTime = startTimeToCheck; selectedTime <= maxTime; selectedTime += 1000) {
      if (!retrievedTimestamps.includes(selectedTime)) {
        const nearest = findNearestRetrievedTimestamp(retrievedTimestamps, selectedTime, 1000);
        if (!nearest.previous.length) {
          isStillFetchingFromBoatRenderRef.current = true;
          handleRequestMoreRaceData(startRaceTime + selectedTime);
          break;
        }
      }
    }
  };

  const handleRenderCourseDetail = (course) => {
    const sequencedGeometries = course.courseSequencedGeometries;

    if (!sequencedGeometries) return;
    const mappedSequencedGeometries = normalizeSequencedGeometries(sequencedGeometries);

    setTimeout(() => {
      eventEmitter.emit("sequenced-courses-update", mappedSequencedGeometries);
    }, 500);
  };

  const handleUpdateLeaderPosition = (normalizedPosition) => {
    setParticipantsData(normalizedPosition);
  };

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <MapContainer
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
        center={MAP_DEFAULT_VALUE.CENTER}
        zoom={MAP_DEFAULT_VALUE.ZOOM}
        zoomSnap={0.2}
        zoomAnimation={false}
        markerZoomAnimation={false}
        fadeAnimation={false}
        zoomAnimationThreshold={0}
        inertia={false}
        zoomanim={false}
        animate={false}
        duration={0}
        easeLinearity={0}
      >
        <LeaderboardContainer style={{ width: "220px", position: "absolute", zIndex: 500, top: "16px", right: "16px" }}>
          <Leaderboard participantsData={participantsData}></Leaderboard>
        </LeaderboardContainer>
        <RaceMap emitter={eventEmitter} />
      </MapContainer>

      <div style={{ width: "100%", position: "relative" }}>
        <Playback onPlaybackTimeManualUpdate={handlePlaybackClickedPosition} />
      </div>

      <ConnectionLoader />
    </div>
  );
};

const LeaderboardContainer = styled.div`
  transition: all 0.3s;
`;