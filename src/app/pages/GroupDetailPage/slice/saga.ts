import { call, put, takeLatest } from "@redux-saga/core/effects";
import { toast } from "react-toastify";
import { getMembers, getAdmins } from "services/live-data-server/groups";
import { groupDetailActions } from ".";

export function* getGroupMembers({ type, payload }) {
    const { page, groupId } = payload;
    yield put(groupDetailActions.setIsGettingMembers(true));
    const response = yield call(getMembers, groupId, page);
    yield put(groupDetailActions.setIsGettingMembers(false));

    if (response.success) {
        yield put(groupDetailActions.setMembers(response.data?.rows));
        yield put(groupDetailActions.setCurrentMemberPage(response.data?.page));
        yield put(groupDetailActions.setMemberTotal(response.data?.count));
    } else {
        toast.error('Oops! We\'re unable to list members');
    }
}

export function* getGroupAdmins({ type, payload }) {
    const { page, groupId } = payload;
    yield put(groupDetailActions.setIsGettingAdmins(true));
    const response = yield call(getAdmins, groupId, page);
    yield put(groupDetailActions.setIsGettingAdmins(false));

    if (response.success) {
        yield put(groupDetailActions.setAdmins(response.data?.rows));
        yield put(groupDetailActions.setCurrentAdminPage(response.data?.page));
        yield put(groupDetailActions.setAdminTotal(response.data?.count));
    } else {
        toast.error('Oops! We\'re unable to list admins');
    }
}

export default function* groupSaga() {
    yield takeLatest(groupDetailActions.getAdmins.type, getGroupAdmins);
    yield takeLatest(groupDetailActions.getMembers.type, getGroupMembers);
}
