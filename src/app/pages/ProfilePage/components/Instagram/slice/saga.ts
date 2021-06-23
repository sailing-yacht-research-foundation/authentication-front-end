/**
 * Root saga manages watcher lifecycle
 */

 import { instagramActions } from ".";
 import { call, put, takeLatest, select } from 'redux-saga/effects';
 import axios from "axios";
 import { selectUser } from "app/pages/LoginPage/slice/selectors";
 import { getUserAttribute } from "utils/user-utils";
 
export function* getInstagramFeeds() {
     const user = yield select(selectUser);
     const posts = yield call(getFeeds, user);
 
     yield put(instagramActions.setPosts(posts));
 }
 
 async function getFeeds(user) {
     let posts = [];
 
     try {
         let { data } = await axios.get('https://graph.instagram.com/me/media?fields=id,caption', {
             params: {
                 access_token: getUserAttribute(user, 'custom:ig_token')
             }
         });
         posts = data.data;
     } catch (err) {
         console.log(err);
     }
 
     return posts;
 }
 
 export function* instagramSaga() {
     yield takeLatest(instagramActions.getPosts.type, getInstagramFeeds);
 }
 