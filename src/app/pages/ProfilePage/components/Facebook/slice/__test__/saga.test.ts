import { put, takeLatest } from 'redux-saga/effects';
import * as slice from '..';

import { facebookSaga, getFacebookFeeds } from '../saga';

describe('facebook Saga', () => {
  let feeds: any;
  let getFacebookPostsIterator: ReturnType<typeof getFacebookFeeds>;

  // We have to test twice, once for a successful load and once for an unsuccessful one
  // so we do all the stuff that happens beforehand automatically in the beforeEach
  beforeEach(() => {
    getFacebookPostsIterator = getFacebookFeeds();
    const userDescriptor = getFacebookPostsIterator.next().value;
    expect(userDescriptor).toMatchSnapshot();

    const postsDescriptor = getFacebookPostsIterator.next().value;
    expect(postsDescriptor).toMatchSnapshot();
  });

  it('should return set posts to empty array if feed response is empty', () => {
    feeds = [];
    const putDescriptor = getFacebookPostsIterator.next(feeds).value;
    expect(putDescriptor).toEqual(
      put(slice.facebookActions.setPosts([])),
    );

    const iteration = getFacebookPostsIterator.next();
    expect(iteration.done).toBe(true);
  });
});

describe('facebook Saga Init', () => {
  const facebookIterator = facebookSaga();
  it('should start task to watch for getPosts action', () => {
    const takeLatestDescriptor = facebookIterator.next().value;
    expect(takeLatestDescriptor).toEqual(
      takeLatest(slice.facebookActions.getPosts.type, getFacebookFeeds),
    );
  });
});
