import { call, put, takeLatest } from "@redux-saga/core/effects";
import { toast } from "react-toastify";
import { getMembers, getAdmins, getGroupById } from "services/live-data-server/groups";
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

export function* getGroup({ type, payload }) {
    const groupId = payload;

    yield put(groupDetailActions.setIsGettingGroup(true));
    const response = yield call(getGroupById, groupId);
    yield put(groupDetailActions.setIsGettingGroup(false));

    if (response.success) {
        yield put(groupDetailActions.setGroup(response.data));
    } else {
        yield put(groupDetailActions.setGetGroupFailed(true));
        toast.error('Oops! There is an error getting this group information');
    }
}

export default function* groupSaga() {
    yield takeLatest(groupDetailActions.getAdmins.type, getGroupAdmins);
    yield takeLatest(groupDetailActions.getMembers.type, getGroupMembers);
    yield takeLatest(groupDetailActions.getGroup.type, getGroup);
}
