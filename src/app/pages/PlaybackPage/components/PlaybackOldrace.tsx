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
  const playbackSpeedRef = useRef<any>();

  const competitionUnitId = useSelector(selectCompetitionUnitId);
  const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);
  const vesselParticipants = useSelector(selectVesselParticipants);
  const isPlaying = useSelector(selectIsPlaying);
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
    shouldReconnect: () => true,
  }
  );

  const mapCenter = {
    lat: userCoordinate?.lat || MAP_DEFAULT_VALUE.CENTER.lat,
    lng: userCoordinate?.lon || MAP_DEFAULT_VALUE.CENTER.lng
  };

  const { actions } = usePlaybackSlice();

  const connectionStatus = {
    [ReadyState.CONNECTING]: WebsocketConnectionStatus.connecting,
    [ReadyState.OPEN]: WebsocketConnectionStatus.open,
    [ReadyState.CLOSING]: WebsocketConnectionStatus.closing,
    [ReadyState.CLOSED]: WebsocketConnectionStatus.closed,
    [ReadyState.UNINSTANTIATED]: WebsocketConnectionStatus.uninstantiated,
  }[readyState];

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
    const isPlaybackReadyAndWebsocketConnectionReadyAfterUserEnters = (connectionStatus === WebsocketConnectionStatus.open && isReady);

    if (isPlaybackReadyAndWebsocketConnectionReadyAfterUserEnters) {
      _sendFirstPingMessageForGettingDataAndSetPlaybackAtPlaying();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus, competitionUnitId, isReady]);

  // Manage message of websocket status
  useEffect(() => {
    _monitorWebsocketConnectionAndUpdateConnectionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus]);

  // Normalized simplified tracks
  useEffect(() => {
    _normalizeSimplifiedTracks();
  }, [raceSimplifiedTracks, raceTime]);

  const _normalizeSimplifiedTracks = () => {
    if (raceTime?.start && raceSimplifiedTracks?.length) {
      const normalizedSimplifiedTracks = normalizeSimplifiedTracksPingTime(raceTime.start, raceSimplifiedTracks);
      simplifiedTracksRef.current = normalizedSimplifiedTracks;
    }
  }
  // Listen last message from web socket
  useEffect(() => {
    _onWebsocketMessageReceieved(lastMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed; // update the ref everytime the speed updates.
  }, [playbackSpeed]);

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

      _handleDebugIfEnabled("=== Vessel Participants ===");
      _handleDebugIfEnabled(vesselParticipantsObject);
      _handleDebugIfEnabled("===========================");
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
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (raceLegs?.length && raceTime?.start) {
      raceLegsRef.current = generateRaceLegsData(raceLegs, raceTime.start);
    }
  }, [raceLegs, raceTime]);

  useEffect(() => {
    _updateCourseToRaceMapWhenHasNewData(raceCourseDetail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raceCourseDetail]);

  // Map available time
  useEffect(() => {
    const mapInterval = setInterval(() => {
      const vesselParticipants = vesselParticipantsRef.current;
      if (!!Object.keys(vesselParticipants).length) {
        _mapRetrivedTimestampBasedOnReceviedVesselParticipantData(vesselParticipants);
      }
    }, 100);

    return () => {
      clearInterval(mapInterval);
      _onBeforeComponentDestroyed();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count the elapsed time
  useEffect(() => {
    // Render the boat
    const defaultInterval = 250;
    const intervalBoatRenderInterval = setInterval(() => {
      const elapsedTime = elapsedTimeRef.current;
      const isPlaying = isPlayingRef.current;
      _renderBoatsBasedOnElapsedTime(elapsedTime, isPlaying, defaultInterval);
      _renderLegsBasedOnElaspedTime(elapsedTime, isPlaying);
      _checkForAvailableRaceDataAndRequestMoreIfNeeded(elapsedTime);
    }, defaultInterval);

    return () => {
      clearInterval(intervalBoatRenderInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _sendFirstPingMessageForGettingDataAndSetPlaybackAtPlaying = () => {
    dispatch(actions.setIsPlaying(true));
    sendJsonMessage({
      action: "playback",
      data: {
        competitionUnitId: competitionUnitId,
        timeToLoad: _getDesiredTimeToLoadBasedOnPlaybackSpeed(),
      },
    });
  }

  const _monitorWebsocketConnectionAndUpdateConnectionStatus = () => {
    if (connectionStatus === WebsocketConnectionStatus.open) dispatch(actions.setIsConnecting(false));
    if (connectionStatus === WebsocketConnectionStatus.connecting) {
      dispatch(actions.setIsConnecting(true));
    }

    _handleDebugIfEnabled("=== Connection Status ===");
    _handleDebugIfEnabled(connectionStatus);
    _handleDebugIfEnabled("=========================");
  }

  const _onBeforeComponentDestroyed = () => {
    if (eventEmitter) {
      eventEmitter.removeAllListeners();
      eventEmitter.off(RaceEmitterEvent.ping, () => { });
      eventEmitter.off(RaceEmitterEvent.track_update, () => { });
      eventEmitter.off(RaceEmitterEvent.sequenced_courses_update, () => { });
      eventEmitter.off(RaceEmitterEvent.zoom_to_location, () => { });
      eventEmitter.off(RaceEmitterEvent.render_legs, () => { });
    }
    dispatch(actions.setElapsedTime(0));
    dispatch(actions.setRaceLength(0));
  }

  const _handleDebugIfEnabled = (value) => {
    if (parsedQueryString?.dbg !== "true") return;
    console.log(value);
  };

  // Map retrieved timestamps
  const _mapRetrivedTimestampBasedOnReceviedVesselParticipantData = (vesselParticipantsObject) => {
    const vesselParticipants = Object.keys(vesselParticipantsObject).map((key) => vesselParticipantsObject[key]);
    const retrievedTimestamps: number[] = generateRetrievedTimestamp(vesselParticipants);

    if (retrievedTimestamps.length === retrievedTimestampsRef.current.length) return;

    retrievedTimestampsRef.current = retrievedTimestamps;
    dispatch(actions.setRetrievedTimestamps(retrievedTimestamps));

    _handleDebugIfEnabled("=== Retrieved Timestamps ===");
    _handleDebugIfEnabled(retrievedTimestamps);
    _handleDebugIfEnabled("============================");
  };

  // Handle message from websocket
  const _onWebsocketMessageReceieved = (lastMessage) => {
    if (!lastMessage?.data) return;
    const wsData = JSON.parse(lastMessage.data);

    _addedNewReceivedParticipantDataToTheTimeLine(wsData);

    _handleDebugIfEnabled("=== WS DATA ===");
    _handleDebugIfEnabled(wsData);
    _handleDebugIfEnabled("===============");
  };

  // Handle add new position to each vessel partiicpant
  const _addedNewReceivedParticipantDataToTheTimeLine = (wsData: any) => {
    if (wsData?.type !== "data"
      && wsData?.dataType !== "position") return; // only render data message with position.

    const data = { ...wsData.data };
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

  const _updateElapsedTime = (elapsedTime) => {
    const time = (playbackSpeedRef.current !== PlaybackSpeed.speed1X)
      ? elapsedTime + (playbackSpeedRef.current * 1000) : elapsedTime; // we bypass playback 1x, only add time to other speeds
    const isElapsedTimeLessThanRaceLength = elapsedTime < raceLengthRef.current;

    if (isElapsedTimeLessThanRaceLength) {
      dispatch(actions.setElapsedTime(time));
    } else if (!isElapsedTimeLessThanRaceLength) {
      dispatch(actions.setElapsedTime(raceLengthRef.current));
    }

    dispatch(actions.setElapsedTime(elapsedTime));
    elapsedTimeRef.current = elapsedTime; // update the elapsed time ref for monitoring in event listeners.
  };

  const _getDesiredTimeToLoadBasedOnPlaybackSpeed = () => {
    const timeToLoadBasedOnSpeed = {
      1: 30,
      2: 60,
      5: 60,
      10: 120,
      50: 200,
      100: 350
    }

    return timeToLoadBasedOnSpeed[playbackSpeedRef.current];
  }

  // Handle request more data
  const _requestMoreRaceDataFromServer = (nextDataTime) => {
    // only request more data when connection is connecting.
    if (connectionStatus !== WebsocketConnectionStatus.connecting) return;

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

      // Overide and next data time
      if (generatedSetup.nextDataTime) nextDateTimeCpy = generatedSetup.nextDataTime;
    }

    // Send the data via websocket
    sendJsonMessage({
      action: "playback",
      data: {
        competitionUnitId: competitionUnitId,
        startTimeFetch: nextDateTimeCpy,
        timeToLoad: _getDesiredTimeToLoadBasedOnPlaybackSpeed(),
      },
    });
  };

  const _playTheRaceAtClickedChoseTime = (targetTime) => {
    if (!simplifiedTracksRef?.current || !eventEmitter) return;
    const raceTime = raceTimeRef.current;

    eventEmitter.emit("zoom-to-location");

    elapsedTimeRef.current = targetTime; // set elapsed time to the clicked time.

    // Request more race data
    const nextDateTime = targetTime + raceTime.start;
    _requestMoreRaceDataFromServer(nextDateTime);
  };

  const _renderBoatsBasedOnElapsedTime = (elapsedTime, isPlaying, interval) => {
    // Check if the elapsed time is retrieved
    const retrievedTimestamps = retrievedTimestampsRef.current;
    const vesselParticipants = vesselParticipantsRef.current;

    // If no retrieved timestamps
    if (!retrievedTimestamps.length) {
      console.log('im not time');
      return;
    }

    if (!isPlaying) {
      console.log('im not playing');
      return;
    }

    if (!Object.keys(vesselParticipants)?.length) {
      console.log('im fucked')
      return;
    }

    const mappedVPs = generateVesselParticipantsLastPosition(vesselParticipants, elapsedTime, retrievedTimestamps);

    eventEmitter.emit(RaceEmitterEvent.ping, mappedVPs);
    eventEmitter.emit(RaceEmitterEvent.track_update, mappedVPs);

    console.log('still pinging');

    elapsedTimeRef.current = elapsedTime + interval;

    _updateElapsedTime(elapsedTime + interval); // update elapsed time
    _updateLeaderPosition(mappedVPs);

    // Debug
    _handleDebugIfEnabled("=== Mapped Vessel Participants ===");
    _handleDebugIfEnabled(mappedVPs);
    _handleDebugIfEnabled("==================================");
  };

  const _renderLegsBasedOnElaspedTime = (elapsedTime, isPlaying) => {
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

  const _checkForAvailableRaceDataAndRequestMoreIfNeeded = (elapsedTime) => {
    const retrievedTimestamps = retrievedTimestampsRef.current;
    const startRaceTime = raceTimeRef.current.start;

    // Check the next 2 second until the next 60 seconds
    const startTimeToCheck = elapsedTime + 2000;
    const maxTime = elapsedTime + 60000;

    for (let selectedTime = startTimeToCheck; selectedTime <= maxTime; selectedTime += 1000) {
      if (!retrievedTimestamps.includes(selectedTime)) {
        const nearest = findNearestRetrievedTimestamp(retrievedTimestamps, selectedTime, 1000);
        if (!nearest.previous.length) {
          _requestMoreRaceDataFromServer(startRaceTime + selectedTime);
          break;
        }
      }
    }
  };

  const _updateCourseToRaceMapWhenHasNewData = (course) => {
    const sequencedGeometries = course.courseSequencedGeometries;

    if (!sequencedGeometries) return;
    const mappedSequencedGeometries = normalizeSequencedGeometries(sequencedGeometries);

    setTimeout(() => {
      eventEmitter.emit(RaceEmitterEvent.sequenced_courses_update, mappedSequencedGeometries);
    }, 500);

    _handleDebugIfEnabled("=== Course Detail ===");
    _handleDebugIfEnabled(raceCourseDetail);
    _handleDebugIfEnabled("=====================");
  };

  const _updateLeaderPosition = (normalizedPosition) => {
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
        <Playback emitter={eventEmitter} onPlaybackTimeManualUpdate={_playTheRaceAtClickedChoseTime} />
      </div>

      <ConnectionLoader />
    </div>
  );
};

const LeaderboardContainer = styled.div`
  transition: all 0.3s;
`;