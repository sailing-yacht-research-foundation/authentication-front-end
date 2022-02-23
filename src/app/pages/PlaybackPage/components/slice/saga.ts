/**
 * Root saga manages watcher lifecycle
 */

import { all, call, put, takeLatest, select } from "@redux-saga/core/effects";
import {
  getCompetitionUnitById,
  getCourseByCompetitionUnit,
  getLegsByCompetitionUnit,
  getRaceViewsCount,
  getSimplifiedTracksByCompetitionUnit,
  getTimeByCompetitionUnit,
  searchScrapedRaceById,
} from "services/live-data-server/competition-units";
import { getVesselParticipantGroupById } from "services/live-data-server/vessel-participant-group";
import { PlaybackTypes } from "types/Playback";
import { playbackActions } from ".";
import { selectRaceTime } from "./selectors";

export function* getCompetitionUnitDetail({ type, payload }) {
  const { id } = payload;

  const result = yield call(getCompetitionUnitById, id);

  if (result.success) {
    yield put(playbackActions.setCompetitionUnitId(id));
    yield put(playbackActions.setCompetitionUnitDetail(result.data));
  }
}

export function* getVesselParticipants({ type, payload }) {
  const { vesselParticipantGroupId } = payload;

  const { data } = yield call(getVesselParticipantGroupById, vesselParticipantGroupId);

  if (data)
    yield put(playbackActions.setVesselParticipants(data.vesselParticipants));
}

export function* getSearchRaceDetail({ type, payload }) {
  const { searchRaceId } = payload;
  if (!searchRaceId) return;
  const result = yield call(searchScrapedRaceById, searchRaceId);

  if (result.success) {
    yield put(playbackActions.setSearchRaceId(searchRaceId));

    // Select the first data
    const raceDetail = result.data.hits?.hits?.[0];
    if (!raceDetail) return;

    yield put(playbackActions.setSearchRaceDetail(raceDetail._source));
  }
}

export function* getRaceData({ type, payload }) {
  const { raceId } = payload;

  if (!raceId) {
    yield put(playbackActions.setPlaybackType(PlaybackTypes.RACENOTFOUND));
    return;
  }

  yield put(playbackActions.setPlaybackType(PlaybackTypes.RACELOADING));
  const competitionUnitResult = yield call(getCompetitionUnitById, raceId);
  const searchRaceDetailResult = yield call(searchScrapedRaceById, raceId);

  // Competition unit result
  if (competitionUnitResult.success) {
    yield put(playbackActions.setCompetitionUnitId(raceId));
    yield put(playbackActions.setCompetitionUnitDetail(competitionUnitResult.data));

    // Old race
    if (competitionUnitResult.data.isCompleted) {
      yield put(playbackActions.setPlaybackType(PlaybackTypes.OLDRACE));
      const response = yield call(getRaceViewsCount, raceId);
      if (response.success) yield put(playbackActions.setViewsCount(response?.data?.count));
      return;
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
      return;
    }

    yield put(playbackActions.setSearchRaceDetail(raceDetail._source));

    if ((raceDetail._source?.url || "").includes("http://")) {
      return yield put(playbackActions.setPlaybackType(PlaybackTypes.INSECURESCRAPEDRACE));
    }

    if (raceDetail._source?.source === "SYRF") {
      yield put(playbackActions.setPlaybackType(PlaybackTypes.RACENOTFOUND));
      return;
    }

    yield put(playbackActions.setPlaybackType(PlaybackTypes.SCRAPEDRACE));
  }

  // If no data found
  else {
    yield put(playbackActions.setPlaybackType(PlaybackTypes.RACENOTFOUND));
    return;
  }
}

export function* getRaceSimplifiedTracks({ type, payload }) {
  const { raceId } = payload;
  if (!raceId) return;

  const result = yield call(getSimplifiedTracksByCompetitionUnit, raceId);
  if (result.success) {
    yield put(playbackActions.setRaceSimplifiedTracks(result.data));
  }
}

export function* getRaceLegs({ type, payload }) {
  const { raceId } = payload;
  if (!raceId) return;

  const result = yield call(getLegsByCompetitionUnit, raceId);
  if (result.success) {
    yield put(playbackActions.setRaceLegs(result.data));
  }
}

export function* getRaceStartTimeAndEndTime({ type, payload }) {
  const { raceId } = payload;
  if (!raceId) return;

  const result = yield call(getTimeByCompetitionUnit, raceId);
  if (result.success) {
    const raceTime = yield select(selectRaceTime);
    const startMillis = new Date(result.data.startTime).getTime();
    const endMillis = new Date(result.data.endTime).getTime();
    yield put(playbackActions.setRaceTime({ ...raceTime, realStart: startMillis, realEnd: endMillis }));
  }
}

export function* getRaceCourseDetail({ type, payload }) {
  const { raceId } = payload;
  if (!raceId) return;

  const result = yield call(getCourseByCompetitionUnit, raceId);
  if (result.success) {
    yield put(playbackActions.setRaceCourseDetail(result.data));
  }
}

export function* getOldRaceData({ type, payload }) {
  const { raceId } = payload;
  if (!raceId) return;

  yield put(playbackActions.getRaceStartTimeAndEndTime({ raceId }));
  yield put(playbackActions.getRaceLegs({ raceId }));
  yield put(playbackActions.getRaceCourseDetail({ raceId }));
}

export function* getTimeBeforeRaceBegin({ type, payload }) {
  const { raceStartTime } = payload;
  if (!raceStartTime) return;

  const currentTime = new Date().getTime();
  const startTime = new Date(raceStartTime).getTime();

  let timeDiff = startTime - currentTime;
  if (timeDiff < 0) timeDiff = 0;

  yield put(playbackActions.setTimeBeforeRaceBegin(timeDiff));
}

export default function* playbackSaga() {
  yield all([
    takeLatest(playbackActions.getCompetitionUnitDetail.type, getCompetitionUnitDetail),
    takeLatest(playbackActions.getVesselParticipants.type, getVesselParticipants),
    takeLatest(playbackActions.getSearchRaceDetail.type, getSearchRaceDetail),
    takeLatest(playbackActions.getRaceData.type, getRaceData),
    takeLatest(playbackActions.getOldRaceData.type, getOldRaceData),
    takeLatest(playbackActions.getRaceLegs.type, getRaceLegs),
    takeLatest(playbackActions.getRaceSimplifiedTracks.type, getRaceSimplifiedTracks),
    takeLatest(playbackActions.getRaceCourseDetail.type, getRaceCourseDetail),
    takeLatest(playbackActions.getTimeBeforeRaceBegin.type, getTimeBeforeRaceBegin),
    takeLatest(playbackActions.getRaceStartTimeAndEndTime.type, getRaceStartTimeAndEndTime),
  ]);
}
