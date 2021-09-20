/**
 * Root saga manages watcher lifecycle
 */

import { all, call, put, select, takeLatest } from "@redux-saga/core/effects";
import { message } from "antd";
import { getCompetitionUnitById } from "services/live-data-server/competition-units";
import { getVesselParticipantGroupById } from "services/live-data-server/vessel-participant-group";
import { playbackActions } from ".";
import { selectCompetitionUnitDetail } from "./selectors";

export function* getCompetitionUnitDetail({ type, payload }) {
  const { id } = payload;

  const result = yield call(getCompetitionUnitById, id);

  if (result.success) {
    yield put(playbackActions.setCompetitionUnitId(id));
    yield put(playbackActions.setCompetitionUnitDetail(result.data));
  } else {
    message.error('Competition unit id not found!')
  }
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
