/**
 * Root saga manages watcher lifecycle
 */

import { all, call, put, select, takeLatest } from "@redux-saga/core/effects";
import { getCompetitionUnitById } from "services/live-data-server/competition-unit";
import { getVesselParticipantGroupById } from "services/live-data-server/vessel-participant-group";
import { playbackActions } from ".";
import { selectCompetitionUnitDetail } from "./selectors";

export function* getCompetitionUnitDetail({ type, payload }) {
  const { id } = payload;

  const result = yield call(getCompetitionUnitById, id);
  yield put(playbackActions.setCompetitionUnitId(id));
  yield put(playbackActions.setCompetitionUnitDetail(result.data));
}

export function* getVesselParticipants() {
  const competitionUnitDetail = yield select(selectCompetitionUnitDetail);
  const { vesselParticipantGroupId } = competitionUnitDetail;

  const { data } = yield call(getVesselParticipantGroupById, vesselParticipantGroupId);
  yield put(playbackActions.setVesselParticipants(data.vesselParticipants));
};

export default function* playbackSaga() {
  yield all([
    takeLatest(
      playbackActions.getCompetitionUnitDetail.type,
      getCompetitionUnitDetail
    ),
    takeLatest(
      playbackActions.getVesselParticipants.type,
      getVesselParticipants
    )
  ]);
}
