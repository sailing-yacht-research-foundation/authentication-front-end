import "leaflet/dist/leaflet.css";

import React, { useEffect, useRef, useState } from "react";
import { MapContainer } from "react-leaflet";
import styled from "styled-components";
import { useLocation } from "react-router";
import queryString from "querystring";
import {
  normalizeSimplifiedTracksPingTime,
  generateRetrievedTimestamp,
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
import { MAP_DEFAULT_VALUE, PlaybackSpeed, RaceEmitterEvent, WebsocketConnectionStatus, WorkerEvent } from "utils/constants";
import { stringToColour } from "utils/helpers";
import { selectSessionToken, selectUserCoordinate } from "../../LoginPage/slice/selectors";
import { Leaderboard } from "./Leaderboard";
import { Playback } from "./Playback";
import { RaceMap } from "./RaceMap";
import { ConnectionLoader } from './ConnectionLoader';
import WebsocketWorker from "../workers/old-race-websocket-worker";
import MapFrameDataWorker from "../workers/old-race-map-frame-data";
import { getSimplifiedTracksByCompetitionUnit } from "services/live-data-server/competition-units";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import { message } from "antd";

let socketWorker, mapDataWorker;
let eventEmitter;

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
  const playbackSpeedRef = useRef<any>(PlaybackSpeed.speed1X);
  const coursePointsRef = useRef<any>({});
  const courseGeometries = useRef<any[]>([]);

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

  const [connectionStatus, setConnectionStatus] = React.useState(WebsocketConnectionStatus.UNINSTANTIATED);

  const { t } = useTranslation();

  useEffect(() => {
    handleSetIsConnecting(true);
    socketWorker = new Worker(WebsocketWorker);
    mapDataWorker = new Worker(MapFrameDataWorker);
    eventEmitter = new EventEmitter();
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
        socketWorker.terminate();
        mapDataWorker.terminate();
        eventEmitter = undefined;
        socketWorker = undefined;
        mapDataWorker = undefined;
      }
      dispatch(actions.setElapsedTime(0));
      dispatch(actions.setRaceLength(0));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed; // update the ref everytime the speed updates.
    socketWorker.postMessage({
      action: WorkerEvent.SEND_DATA_TO_WORKER,
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
    if (connectionStatus === WebsocketConnectionStatus.OPEN && isReady) {
      socketWorker.postMessage({
        action: WorkerEvent.SEND_WS_MESSAGE,
        data: {
          action: "playback_v2",
          data: {
            competitionUnitId: competitionUnitId,
            startTimeFetch: raceTime.start,
            timeToLoad: 30,
          },
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus, competitionUnitId, isReady]);

  // Manage message of websocket status
  useEffect(() => {
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

      socketWorker.postMessage({
        action: WorkerEvent.SEND_DATA_TO_WORKER,
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
    socketWorker.postMessage({
      action: WorkerEvent.SEND_DATA_TO_WORKER,
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

    initCoursePointsDataAndSendToWorker();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raceCourseDetail]);

  useEffect(() => {
    socketWorker.postMessage({
      action: 'initWS',
      url: `${streamUrl}/authenticate?session_token=${sessionToken}`
    });

    socketWorker.addEventListener('message', function (e) {
      const data = e.data;
      if (data.action === WorkerEvent.SET_CONNECTION_STATUS) {
        setConnectionStatus(data.data);
      } else if (data.action === WorkerEvent.UPDATE_WORKER_DATA_TO_MAIN_THREAD) {
        vesselParticipantsRef.current = data?.data?.vesselParticipants;

        if (data?.data?.retrievedTimestamps.length > 0) {
          retrievedTimestampsRef.current = data?.data?.retrievedTimestamps;
        }

        coursePointsRef.current = data?.data?.coursePoints;
      } else if (data.action === WorkerEvent.COURSE_MARK_UPDATE) {
        updateCourseMarksPosition(data.data);
      } else if (data.action === WorkerEvent.NEW_PARTICIPANT_JOINED) {
        addNewVesselParticipantToTheRace(data.data);
      } else if (data.action === WorkerEvent.VESSEL_PARTICIPANT_REMOVED) {
        removeVesselParticipantFromTheRace(data.data);
      }
    });

    mapDataWorker.addEventListener('message', function (e) {
      const data = e.data;

      if (data.action === WorkerEvent.UPDATE_WORKER_DATA_TO_MAIN_THREAD) {
        eventEmitter.emit(RaceEmitterEvent.PING, data.data.mappedVesselParticipants);
        eventEmitter.emit(RaceEmitterEvent.UPDATE_COURSE, data.data.mappedMarks);

        handleUpdateLeaderPosition(data.data.mappedVesselParticipants);

        // Debug
        handleDebug("=== Mapped Vessel Participants ===")
        handleDebug(data.data.mappedVesselParticipants);
        handleDebug("==================================");
      }
    });
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

  const initCoursePointsDataAndSendToWorker = () => {
    if (!raceCourseDetail.courseSequencedGeometries) return;

    courseGeometries.current = raceCourseDetail.courseSequencedGeometries;

    const coursePoints = {};

    raceCourseDetail.courseSequencedGeometries.map(geometry => {
      geometry.points.map(point => {
        coursePoints[point.id] = {
          tracks: [],
          geometryId: geometry.id,
          order: point.order,
          pointId: point.id
        }
      });
    })

    socketWorker.postMessage({
      action: WorkerEvent.SEND_DATA_TO_WORKER,
      data: {
        coursePoints: coursePoints
      }
    });
  }

  const addNewVesselParticipantToTheRace = (data) => {
    const { vesselParticipant, vessel, participant, position } = data;
    const { id } = vesselParticipant;

    if (vesselParticipantsRef?.current[id]) return;

    vesselParticipantsRef.current[id] = {
      ...vesselParticipant,
      deviceType: "boat",
      color: stringToColour(vesselParticipant.id),
      positions: [position.lat, position.lon],
      lastPosition: {
        lat: position.lat,
        lon: position.lon
      },
      participant: {
        competitor_name: vessel?.publicName,
        competitior_sail_number: vessel?.vesselParticipantId,
      },
    };

    socketWorker.postMessage({
      action: WorkerEvent.SEND_DATA_TO_WORKER,
      data: {
        vesselParticipants: vesselParticipantsRef.current
      }
    });

    message.info(t(translations.playback_page.competitor_joined, { competitor_name: participant.publicName, boat_name: vessel.publicName }));
  }

  const removeVesselParticipantFromTheRace = (data) => {
    const { vesselParticipant } = data;
    const { id, vessel } = vesselParticipant;

    if (vesselParticipantsRef?.current[id]) {
      delete vesselParticipantsRef?.current[id];
      socketWorker.postMessage({
        action: WorkerEvent.SEND_DATA_TO_WORKER,
        data: {
          vesselParticipants: vesselParticipantsRef.current
        }
      });
      eventEmitter.emit(RaceEmitterEvent.REMOVE_PARTICIPANT, id);
      message.info(t(translations.playback_page.boat_left_the_race, { boat_name: vessel?.publicName }));
    }
  }

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

      socketWorker.postMessage({
        action: WorkerEvent.SEND_DATA_TO_WORKER,
        data: {
          vesselParticipants: vesselParticipantsRef.current
        }
      });
    }

    setIsLoading(false);
    dispatch(actions.setIsPlaying(true));
    handleSetIsConnecting(false); // move out of the response check because sometimes the simplified tracks is not found and it block user from viewing the race using websocket.
  }

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

  const updateCourseMarksPosition = (data) => {
    eventEmitter.emit(RaceEmitterEvent.UPDATE_COURSE_MARK, data);
  }

  const handleSetElapsedTime = (elapsedTime) => {
    const time = (playbackSpeedRef.current !== PlaybackSpeed.speed1X)
      ? elapsedTime + (playbackSpeedRef.current * 1000) : elapsedTime; // we bypass playback 1x, only add time to other speeds
    const isElapsedTimeLessThanRaceLength = elapsedTime < raceLengthRef.current;

    if (isElapsedTimeLessThanRaceLength) {
      dispatch(actions.setElapsedTime(time));
      socketWorker.postMessage({
        action: WorkerEvent.SEND_DATA_TO_WORKER,
        data: {
          elapsedTime: elapsedTime
        }
      });
    } else if (!isElapsedTimeLessThanRaceLength) {
      dispatch(actions.setElapsedTime(raceLengthRef.current));
      dispatch(actions.setIsPlaying(false));
    }
  };

  const handlePlaybackClickedPosition = (targetTime) => {
    dispatch(actions.setIsPlaying(true));
  };

  const handleRenderTheBoat = (elapsedTime, isPlaying, interval) => {
    // Check if the elapsed time is retrieved
    const retrievedTimestamps = retrievedTimestampsRef.current;
    const vesselParticipants = vesselParticipantsRef.current;

    // If no retrieved timestamps
    if (!retrievedTimestamps.length || !isPlaying || !Object.keys(vesselParticipants)?.length) {
      return;
    }

    mapDataWorker.postMessage({
      action: WorkerEvent.MAP_DATA,
      data: {
        vesselParticipants,
        elapsedTime,
        retrievedTimestamps,
        courseGeometries: courseGeometries.current,
        coursePoints: coursePointsRef.current
      }
    });

    // // Set elapsed time
    handleSetElapsedTime(elapsedTime + interval);
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
    eventEmitter.emit(RaceEmitterEvent.RENDER_REGS, filteredRaceLegs);
  };

  const handleRenderCourseDetail = (course) => {
    const sequencedGeometries = course.courseSequencedGeometries;

    if (!sequencedGeometries) return;
    const mappedSequencedGeometries = normalizeSequencedGeometries(sequencedGeometries);

    setTimeout(() => {
      eventEmitter.emit(RaceEmitterEvent.RENDER_SEQUENCED_COURSE, mappedSequencedGeometries);
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
      <LeaderboardContainer style={{ width: "220px", position: "absolute", zIndex: 500, top: "16px", right: "16px" }}>
        <Leaderboard emitter={eventEmitter} participantsData={participantsData}></Leaderboard>
      </LeaderboardContainer>
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