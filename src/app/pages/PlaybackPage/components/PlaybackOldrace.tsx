import "leaflet/dist/leaflet.css";

import React, { useEffect, useRef, useState } from "react";
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
  turnTracksToVesselParticipantsData,
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
import websocketWorker from "../workers/old-race-worker";
import { getSimplifiedTracksByCompetitionUnit } from "services/live-data-server/competition-units";

const worker = new Worker(websocketWorker);

const eventEmitter = new EventEmitter();

export const PlaybackOldRace = (props) => {

  const streamUrl = `${process.env.REACT_APP_SYRF_STREAMING_SERVER_SOCKETURL}`;

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
  const raceLength = useSelector(selectRaceLength);
  const userCoordinate = useSelector(selectUserCoordinate);
  const playbackSpeed = useSelector(selectPlaybackSpeed);

  const { actions } = usePlaybackSlice();

  const [connectionStatus, setConnectionStatus] = React.useState(WebsocketConnectionStatus.uninstantiated);

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
    worker.postMessage({
      action: 'SendDataToWorker',
      data: {
        playbackSpeed: playbackSpeed
      }
    });
  }, [playbackSpeed]);

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
      worker.postMessage({
        action: 'SendWSMessage',
        data: {
          action: "playback",
          data: {
            competitionUnitId: competitionUnitId,
            startTimeFetch: raceTime.start,
            timeToLoad: 50,
          },
        }
      })
      setTimeout(() => {
        setIsLoading(false);
        dispatch(actions.setIsPlaying(true));
      }, 3000); // wait for render the time line
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

      worker.postMessage({
        action: 'SendDataToWorker',
        data: {
          vesselParticipants: vesselParticipantsRef.current,
          competitionUnitId: competitionUnitId
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselParticipants]);

  useEffect(() => {
    raceTimeRef.current = raceTime;
    worker.postMessage({
      action: 'SendDataToWorker',
      data: {
        raceTime: raceTime
      }
    })
    if (raceTime?.start) {
      getSimplifiedTracks();
    }
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

  useEffect(() => {
    worker.postMessage({
      action: 'initWS',
      url: `${streamUrl}/authenticate?session_token=${sessionToken}`
    });

    worker.addEventListener('message', function (e) {
      const data = e.data;
      if (data.action === 'SetConnectionStatus') {
        setConnectionStatus(data.data);
      } else if (data.action === 'UpdateWorkerDataToMainThread') {
        vesselParticipantsRef.current = data?.data?.vesselParticipants;
        if (data?.data?.retrievedTimestamps.length > 0)
          retrievedTimestampsRef.current = data?.data?.retrievedTimestamps;
      }
    })
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

  const getSimplifiedTracks = async () => {
    const response = await getSimplifiedTracksByCompetitionUnit(String(competitionUnitId));
    if (response.success) {
      const normalizedSimplifiedTracks = normalizeSimplifiedTracksPingTime(raceTime.start, response.data);
      simplifiedTracksRef.current = normalizedSimplifiedTracks;
      vesselParticipantsRef.current = turnTracksToVesselParticipantsData(vesselParticipantsRef.current, simplifiedTracksRef.current);
      handleMapRetrievedTimestamps(vesselParticipantsRef.current);
      worker.postMessage({
        action: 'SendDataToWorker',
        data: {
          vesselParticipants: vesselParticipantsRef.current
        }
      });
    }
  }

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

  const handleSetElapsedTime = (elapsedTime) => {
    const time = (playbackSpeedRef.current !== PlaybackSpeed.speed1X)
      ? elapsedTime + (playbackSpeedRef.current * 1000) : elapsedTime; // we bypass playback 1x, only add time to other speeds
    const isElapsedTimeLessThanRaceLength = elapsedTime < raceLengthRef.current;

    if (isElapsedTimeLessThanRaceLength) {
      dispatch(actions.setElapsedTime(time));
      worker.postMessage({
        action: 'SendDataToWorker',
        data: {
          elapsedTime: elapsedTime
        }
      });
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

    worker.postMessage({
      action: 'SendWSMessage',
      data: {
        action: "playback",
        data: {
          competitionUnitId: competitionUnitId,
          startTimeFetch: nextDateTimeCpy,
          timeToLoad: 50,
        },
      }
    })
  };

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