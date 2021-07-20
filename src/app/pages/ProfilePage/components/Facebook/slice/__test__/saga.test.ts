import { loginActions } from 'app/pages/LoginPage/slice';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as slice from '..';

import { exchangeFacebookToken, facebookSaga, getFacebookFeeds, updateUserFacebookToken } from '../saga';

describe('facebook Saga', () => {
  let getFacebookPostsIterator: ReturnType<typeof getFacebookFeeds>;
  let exchangeLongLivedTokenIterator: ReturnType<typeof exchangeFacebookToken>;

  // We have to test twice, once for a successful load and once for an unsuccessful one
  // so we do all the stuff that happens beforehand automatically in the beforeEach
  beforeEach(() => {
    getFacebookPostsIterator = getFacebookFeeds();
    const userDescriptor = getFacebookPostsIterator.next().value;
    expect(userDescriptor).toMatchSnapshot();

    const postsDescriptor = getFacebookPostsIterator.next().value;
    expect(postsDescriptor).toMatchSnapshot();

    exchangeLongLivedTokenIterator = exchangeFacebookToken('');
    const responseDescriptor = exchangeLongLivedTokenIterator.next().value;
    expect(responseDescriptor).toMatchSnapshot();
  });

  it('should return set getFeedsErrorState to true when response data is  not defined', () => {
    const response = {};
    const putDescriptor = getFacebookPostsIterator.next(response).value;
    expect(putDescriptor).toEqual(
      put(slice.facebookActions.setGetFeedsErrorState(true)),
    );

    const iteration = getFacebookPostsIterator.next();
    expect(iteration.done).toBe(true);
  });

  it('should exchangeLongLivedToken when response.data.access_token is defined', () => {
    const response = {
      data: {
        access_token: 'token'
      }
    };

    var result = {
      success: true,
    }
    
    const callUpdateUserInstagramTokenDescriptor = exchangeLongLivedTokenIterator.next(response).value;
    expect(callUpdateUserInstagramTokenDescriptor).toEqual(
      call(updateUserFacebookToken, 'token'),
    );

    const putSetIsConnectedDescriptor = exchangeLongLivedTokenIterator.next(result).value;
    expect(putSetIsConnectedDescriptor).toEqual(
      put(slice.facebookActions.setIsConnected(true)),
    );

    const putGetUserDescriptor = exchangeLongLivedTokenIterator.next(result).value;
    expect(putGetUserDescriptor).toEqual(
      put(loginActions.getUser()),
    );

    const iteration = exchangeLongLivedTokenIterator.next();
    expect(iteration.done).toBe(true);
  });

  it('should setExchangeTokenErrorState to true when response.data.access_token is not defined', () => {
    const response = {
      response: {}
    };
    
    const putDescriptor = exchangeLongLivedTokenIterator.next(response).value;
    expect(putDescriptor).toEqual(
      put(slice.facebookActions.setExchangeTokenErrorState(true)),
    );

    const iteration = exchangeLongLivedTokenIterator.next();
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

  it('should start task to watch for exchangeToken action', () => {
    const takeLatestDescriptor = facebookIterator.next().value;
    expect(takeLatestDescriptor).toEqual(
      takeLatest(slice.facebookActions.exchangeToken.type, exchangeFacebookToken),
    );
  });
});
