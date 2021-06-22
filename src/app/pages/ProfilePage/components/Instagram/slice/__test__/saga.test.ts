import { put, takeLatest } from 'redux-saga/effects';
import * as slice from '..';

import { getInstagramFeeds, instagramSaga } from '../saga';

describe('instagram Saga', () => {
  let feeds: any;
  let getInstagramIterator: ReturnType<typeof getInstagramFeeds>;

  // We have to test twice, once for a successful load and once for an unsuccessful one
  // so we do all the stuff that happens beforehand automatically in the beforeEach
  beforeEach(() => {
    getInstagramIterator = getInstagramFeeds();
    const userDescriptor = getInstagramIterator.next().value;
    expect(userDescriptor).toMatchSnapshot();

    const postsDescriptor = getInstagramIterator.next().value;
    expect(postsDescriptor).toMatchSnapshot();
  });

  it('should return set posts to empty array if feed response is empty', () => {
    feeds = [];
    const putDescriptor = getInstagramIterator.next(feeds).value;
    expect(putDescriptor).toEqual(
      put(slice.instagramActions.setPosts([])),
    );

    const iteration = getInstagramIterator.next();
    expect(iteration.done).toBe(true);
  });
});

describe('instagram Saga Init', () => {
  const instagramIterator = instagramSaga();
  it('should start task to watch for getPosts action', () => {
    const takeLatestDescriptor = instagramIterator.next().value;
    expect(takeLatestDescriptor).toEqual(
      takeLatest(slice.instagramActions.getPosts.type, getInstagramFeeds),
    );
  });
});
