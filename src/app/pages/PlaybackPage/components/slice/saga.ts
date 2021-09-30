/**
 * Root saga manages watcher lifecycle
 */

import { all, call, delay, put, select, takeLatest } from "@redux-saga/core/effects";
import { message } from "antd";
import { getCompetitionUnitById, searchScrapedRaceById } from "services/live-data-server/competition-units";
import { getVesselParticipantGroupById } from "services/live-data-server/vessel-participant-group";
import { PlaybackTypes } from "types/Playback";
import { urlToCompany } from "utils/url-to-company-map";
import { playbackActions } from ".";
import { selectCompetitionUnitDetail } from "./selectors";

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

export function* getVesselParticipants() {
  const competitionUnitDetail = yield select(selectCompetitionUnitDetail);
  const { vesselParticipantGroupId } = competitionUnitDetail;

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
    yield put(playbackActions.setPlaybackType(PlaybackTypes.STREAMINGRACE));
  }

  // Search race result
  else if (searchRaceDetailResult.success) {
    yield put(playbackActions.setSearchRaceId(raceId));

    const raceDetail = searchRaceDetailResult.data?.hits?.hits?.[0];
    if (!raceDetail) return message.error("Race not found!");

    yield put(playbackActions.setSearchRaceDetail(raceDetail._source));

    if ((raceDetail._source?.url || "").includes("http://")) {
      return yield put(playbackActions.setPlaybackType(PlaybackTypes.INSECURESCRAPEDRACE));
    }

    yield put(playbackActions.setPlaybackType(PlaybackTypes.SCRAPEDRACE));
  }

  // If no data found
  else {
    yield put(playbackActions.setPlaybackType(PlaybackTypes.RACENOTFOUND));
    message.error("Race not found!");
  }
}

export default function* playbackSaga() {
  yield all([
    takeLatest(playbackActions.getCompetitionUnitDetail.type, getCompetitionUnitDetail),
    takeLatest(playbackActions.getVesselParticipants.type, getVesselParticipants),
    takeLatest(playbackActions.getSearchRaceDetail.type, getSearchRaceDetail),
    takeLatest(playbackActions.getRaceData.type, getRaceData),
  ]);
}
