/**
 * Root saga manages watcher lifecycle
 */

import { facebookActions } from ".";
import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import axios from "axios";
import { selectUser } from "app/pages/LoginPage/slice/selectors";
import { getUserAttribute } from "utils/user-utils";

function* getFacebookFeeds() {
    const user = yield select(selectUser);
    const posts = yield call(getFeeds, user);

    yield put(facebookActions.setPosts(posts));
}

async function getFeeds(user) {
    let posts = [];

    try {
        let { data } = await axios.get('https://graph.facebook.com/me/feed', {
            params: {
                access_token: getUserAttribute(user, 'custom:fb_token')
            }
        });
        posts = data.data;
    } catch (err) {
        console.log(err);
    }

    return posts;
}

export default function* facebookSaga() {
    yield takeLatest(facebookActions.getPosts.type, getFacebookFeeds);
}
