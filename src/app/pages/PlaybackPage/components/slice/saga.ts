/**
 * Root saga manages watcher lifecycle
 */

import { all, call, put, select, takeLatest } from "@redux-saga/core/effects";
import { message } from "antd";
import {
  getCompetitionUnitById,
  getCourseByCompetitionUnit,
  getLegsByCompetitionUnit,
  getSimplifiedTracksByCompetitionUnit,
  getTimeByCompetitionUnit,
  searchScrapedRaceById,
} from "services/live-data-server/competition-units";
import { getVesselParticipantGroupById } from "services/live-data-server/vessel-participant-group";
import { PlaybackTypes } from "types/Playback";
import { playbackActions } from ".";

export function* getCompetitionUnitDetail({ type, payload }) {
  const { id } = payload;

  const result = yield call(getCompetitionUnitById, id);

  if (result.success) {
    yield put(playbackActions.setCompetitionUnitId(id));
    yield put(playbackActions.setCompetitionUnitDetail(result.data));
  } else {
    message.error("Competition unit id not found!");
  }
}

export function* getVesselParticipants({ type, payload }) {
  const { vesselParticipantGroupId } = payload;

  const { data } = yield call(getVesselParticipantGroupById, vesselParticipantGroupId);
  yield put(playbackActions.setVesselParticipants(data.vesselParticipants));
}

export function* getSearchRaceDetail({ type, payload }) {
  const { searchRaceId } = payload;
  if (!searchRaceId) return message.error("Race not found!");
  const result = yield call(searchScrapedRaceById, searchRaceId);

  if (result.success) {
    yield put(playbackActions.setSearchRaceId(searchRaceId));

    // Select the first data
    const raceDetail = result.data.hits?.hits?.[0];
    if (!raceDetail) return message.error("Race not found!");

    yield put(playbackActions.setSearchRaceDetail(raceDetail._source));
  } else {
    message.error(result.error.message || "Something went wrong when try to search the race id");
  }
}

export function* getRaceData({ type, payload }) {
  const { raceId } = payload;

  yield put(playbackActions.setPlaybackType(PlaybackTypes.RACELOADING));
  const competitionUnitResult = yield call(getCompetitionUnitById, raceId);
  const searchRaceDetailResult = yield call(searchScrapedRaceById, raceId);

  // Competition unit result
  if (competitionUnitResult.success) {
    yield put(playbackActions.setCompetitionUnitId(raceId));
    yield put(playbackActions.setCompetitionUnitDetail(competitionUnitResult.data));

    // Old race
    if (competitionUnitResult.data.isCompleted) {
      return yield put(playbackActions.setPlaybackType(PlaybackTypes.OLDRACE));
    }

    // Streaming race
    return yield put(playbackActions.setPlaybackType(PlaybackTypes.STREAMINGRACE));
  }

  // Search race result
  else if (searchRaceDetailResult.success) {
    yield put(playbackActions.setSearchRaceId(raceId));

    const raceDetail = searchRaceDetailResult.data?.hits?.hits?.[0];
    if (!raceDetail) {
      yield put(playbackActions.setPlaybackType(PlaybackTypes.RACENOTFOUND));
      return message.error("Race not found!");
    }

    yield put(playbackActions.setSearchRaceDetail(raceDetail._source));

    if ((raceDetail._source?.url || "").includes("http://")) {
      return yield put(playbackActions.setPlaybackType(PlaybackTypes.INSECURESCRAPEDRACE));
    }

    if (raceDetail._source?.source === "SYRF") {
      yield put(playbackActions.setPlaybackType(PlaybackTypes.RACENOTFOUND));
      return message.error("Race not found!");
    }

    yield put(playbackActions.setPlaybackType(PlaybackTypes.SCRAPEDRACE));
  }

  // If no data found
  else {
    yield put(playbackActions.setPlaybackType(PlaybackTypes.RACENOTFOUND));
    message.error("Race not found!");
  }
}

export function* getRaceSimplifiedTracks({ type, payload }) {
  const { raceId } = payload;
  if (!raceId) return message.error("Race not found!");

  const result = yield call(getSimplifiedTracksByCompetitionUnit, raceId);
  if (result.success) {
    yield put(playbackActions.setRaceSimplifiedTracks(result.data));
  } else {
    message.error("Failed to get simplified tracks!");
  }
}

export function* getRaceLegs({ type, payload }) {
  const { raceId } = payload;
  if (!raceId) return message.error("Race not found!");

  const result = yield call(getLegsByCompetitionUnit, raceId);
  if (result.success) {
    yield put(playbackActions.setRaceLegs(result.data));
  } else {
    message.error("Failed to get race legs");
  }
}

export function* getRaceLength({ type, payload }) {
  const { raceId } = payload;
  if (!raceId) return message.error("Race not found!");

  const result = yield call(getTimeByCompetitionUnit, raceId);
  if (result.success) {
    const startMillis = new Date(result.data.startTime).getTime();
    const endMillis = new Date(result.data.endTime).getTime();

    const raceLength = Math.ceil(endMillis - startMillis);
    yield put(playbackActions.setRaceLength(raceLength));
    yield put(playbackActions.setRaceTime({ start: startMillis, end: endMillis }));
  } else {
    message.error("Failed to get race time");
  }
}

export function* getRaceCourseDetail({ type, payload }) {
  const { raceId } = payload;
  if (!raceId) return message.error("Race not found!");

  const result = yield call(getCourseByCompetitionUnit, raceId);
  if (result.success) {
    yield put(playbackActions.setRaceCourseDetail(result.data));
  } else {
    message.error("Failed to get race course detail");
  }
}

export function* getOldRaceDate({ type, payload }) {
  const { raceId } = payload;
  if (!raceId) return message.error("Race not found");

  yield put(playbackActions.getRaceLength({ raceId }));
  yield put(playbackActions.getRaceLegs({ raceId }));
  yield put(playbackActions.getRaceSimplifiedTracks({ raceId }));
  yield put(playbackActions.getRaceCourseDetail({ raceId }));
}

export default function* playbackSaga() {
  yield all([
    takeLatest(playbackActions.getCompetitionUnitDetail.type, getCompetitionUnitDetail),
    takeLatest(playbackActions.getVesselParticipants.type, getVesselParticipants),
    takeLatest(playbackActions.getSearchRaceDetail.type, getSearchRaceDetail),
    takeLatest(playbackActions.getRaceData.type, getRaceData),
    takeLatest(playbackActions.getOldRaceData.type, getOldRaceDate),
    takeLatest(playbackActions.getRaceLength.type, getRaceLength),
    takeLatest(playbackActions.getRaceLegs.type, getRaceLegs),
    takeLatest(playbackActions.getRaceSimplifiedTracks.type, getRaceSimplifiedTracks),
    takeLatest(playbackActions.getRaceCourseDetail.type, getRaceCourseDetail),
  ]);
}
