import "leaflet/dist/leaflet.css";

import React, { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { MapContainer } from "react-leaflet";
import styled from "styled-components";
import { useLocation } from "react-router";
import queryString from "querystring";
import {
  normalizeSimplifiedTracksPingTime,
  generateRetrievedTimestamp,
  generateVesselParticipantsLastPosition,
  normalizeSequencedGeometries,
  generateRaceLegsData,
  limitRaceLegsDataByElapsedTime,
} from "utils/race/race-helper";
import { useDispatch, useSelector } from "react-redux";
import { EventEmitter } from "events";
import {
  selectCompetitionUnitDetail,
  selectCompetitionUnitId,
  selectElapsedTime,
  selectIsPlaying,
  selectPlaybackSpeed,
  selectRaceCourseDetail,
  selectRaceLegs,
  selectRaceLength,
  selectRaceSimplifiedTracks,
  selectRaceTime,
  selectVesselParticipants,
} from "./slice/selectors";
import { usePlaybackSlice } from "./slice";
import { MAP_DEFAULT_VALUE, PlaybackSpeed, RaceEmitterEvent, WebsocketConnectionStatus } from "utils/constants";
import { stringToColour } from "utils/helpers";
import { selectSessionToken, selectUserCoordinate } from "../../LoginPage/slice/selectors";
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
  const [isLoading, setIsLoading] = useState(false);

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
  const playbackSpeedRef = useRef<any>(PlaybackSpeed.speed1X);
  const lastRetrivedTimestampRef = useRef<number>(0);

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
  const userCoordinate = useSelector(selectUserCoordinate);
  const playbackSpeed = useSelector(selectPlaybackSpeed);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `${streamUrl}/authenticate?session_token=${sessionToken}`, {
    shouldReconnect: () => true
  }
  );

  const { actions } = usePlaybackSlice();

  const connectionStatus = {
    [ReadyState.CONNECTING]: WebsocketConnectionStatus.connecting,
    [ReadyState.OPEN]: WebsocketConnectionStatus.open,
    [ReadyState.CLOSING]: WebsocketConnectionStatus.closing,
    [ReadyState.CLOSED]: WebsocketConnectionStatus.closed,
    [ReadyState.UNINSTANTIATED]: WebsocketConnectionStatus.uninstantiated,
  }[readyState];

  useEffect(() => {
    return () => {
      if (eventEmitter) {
        eventEmitter.removeAllListeners();
        eventEmitter.off(RaceEmitterEvent.ping, () => { });
        eventEmitter.off(RaceEmitterEvent.track_update, () => { });
        eventEmitter.off(RaceEmitterEvent.sequenced_courses_update, () => { });
        eventEmitter.off(RaceEmitterEvent.zoom_to_location, () => { });
      }
      dispatch(actions.setElapsedTime(0));
      dispatch(actions.setRaceLength(0));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed; // update the ref everytime the speed updates.
  }, [playbackSpeed]);

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
    if (connectionStatus === WebsocketConnectionStatus.open && isReady) {
      sendJsonMessage({
        action: "playback",
        data: {
          competitionUnitId: competitionUnitId,
          timeToLoad: getDesiredTimeToLoadBasedOnPlaybackSpeed(),
        },
      });
      setTimeout(() => {
        setIsLoading(false);
        dispatch(actions.setIsPlaying(true));
      }, 3000); // wait for render the time line
    }

    if ([WebsocketConnectionStatus.connecting, WebsocketConnectionStatus.closing, WebsocketConnectionStatus.closed].includes(connectionStatus)) {
      dispatch(actions.setIsPlaying(false));
      setIsLoading(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus, competitionUnitId, isReady]);

  // Manage message of websocket status
  useEffect(() => {
    if (connectionStatus === WebsocketConnectionStatus.open) handleSetIsConnecting(false);
    if (connectionStatus === WebsocketConnectionStatus.connecting) handleSetIsConnecting(true);

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
    handleRequestMoreRaceData(0); // start getting race data when the start time is available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    getMoreDataBasedOnLastReceivedTimestamp(retrievedTimestamps);

    handleDebug("=== Retrieved Timestamps ===");
    handleDebug(retrievedTimestamps);
    handleDebug("============================");
  };

  const getMoreDataBasedOnLastReceivedTimestamp = (retrievedTimestamps) => {
    const latestReceivedTimestamp = retrievedTimestamps[retrievedTimestamps.length - 1];
    if (latestReceivedTimestamp > 0 && lastRetrivedTimestampRef.current < latestReceivedTimestamp) {
      lastRetrivedTimestampRef.current = latestReceivedTimestamp;
      handleRequestMoreRaceData(lastRetrivedTimestampRef.current);
    }
  }

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
    const time = (playbackSpeedRef.current !== PlaybackSpeed.speed1X)
      ? elapsedTime + (playbackSpeedRef.current * 1000) : elapsedTime; // we bypass playback 1x, only add time to other speeds
    const isElapsedTimeLessThanRaceLength = elapsedTime < raceLengthRef.current;

    if (isElapsedTimeLessThanRaceLength) {
      dispatch(actions.setElapsedTime(time));
    } else if (!isElapsedTimeLessThanRaceLength) {
      dispatch(actions.setElapsedTime(raceLengthRef.current));
      dispatch(actions.setIsPlaying(false));
    }

    if (lastRetrivedTimestampRef.current < elapsedTimeRef.current
      && lastRetrivedTimestampRef.current !== 0) {
      handleRequestMoreRaceData(elapsedTimeRef.current);
    }
  };

  // Handle request more data
  const handleRequestMoreRaceData = (nextDataTime) => {
    const startTime = raceTimeRef.current?.start || 0;
    let nextDateTimeCpy = nextDataTime + startTime;

    // Send the data via websocket
    sendJsonMessage({
      action: "playback",
      data: {
        competitionUnitId: competitionUnitId,
        startTimeFetch: nextDateTimeCpy,
        timeToLoad: getDesiredTimeToLoadBasedOnPlaybackSpeed(),
      },
    });
  };

  const getDesiredTimeToLoadBasedOnPlaybackSpeed = () => {
    const timeToLoadBasedOnSpeed = { // time is 30x the speed.
      1: 30,
      2: 60,
      5: 150,
      10: 300,
      50: 1500,
      100: 3000,
      200: 6000,
      500: 15000,
      1000: 30000
    }

    return timeToLoadBasedOnSpeed[playbackSpeedRef.current];
  }

  const handlePlaybackClickedPosition = (targetTime) => {
    if (!simplifiedTracksRef?.current || !eventEmitter) return;
    dispatch(actions.setIsPlaying(true));
    // Request more race data
    handleRequestMoreRaceData(targetTime);
  };

  const handleRenderTheBoat = (elapsedTime, isPlaying, interval) => {
    // Check if the elapsed time is retrieved
    const retrievedTimestamps = retrievedTimestampsRef.current;
    const vesselParticipants = vesselParticipantsRef.current;

    // If no retrieved timestamps
    if (!retrievedTimestamps.length) {
      return;
    }
    if (!isPlaying) {
      return;
    }
    if (!Object.keys(vesselParticipants)?.length) {
      return;
    }

    isStillFetchingFromBoatRenderRef.current = false;
    const mappedVPs = generateVesselParticipantsLastPosition(vesselParticipants, elapsedTime, retrievedTimestamps);

    eventEmitter.emit(RaceEmitterEvent.ping, mappedVPs);

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
    eventEmitter.emit(RaceEmitterEvent.render_legs, filteredRaceLegs);
  };

  const handleRenderCourseDetail = (course) => {
    const sequencedGeometries = course.courseSequencedGeometries;

    if (!sequencedGeometries) return;
    const mappedSequencedGeometries = normalizeSequencedGeometries(sequencedGeometries);

    setTimeout(() => {
      eventEmitter.emit(RaceEmitterEvent.sequenced_courses_update, mappedSequencedGeometries);
    }, 500);
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
      <MapContainer
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
        center={mapCenter}
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
        <Playback isLoading={isLoading} emitter={eventEmitter} onPlaybackTimeManualUpdate={handlePlaybackClickedPosition} />
      </div>

      <ConnectionLoader />
    </div>
  );
};

const LeaderboardContainer = styled.div`
  transition: all 0.3s;
`;