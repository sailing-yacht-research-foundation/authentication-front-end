import { loginActions } from 'app/pages/LoginPage/slice';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as slice from '..';
import {
  getInstagramFeeds,
  instagramSaga,
  exchangeInstagramLongLivedToken,
  exchangeInstagramTokenFromCode,
  updateUserInstagramToken
} from '../saga';

describe('instagram Saga', () => {
  let getInstagramPostsIterator: ReturnType<typeof getInstagramFeeds>;
  let exchangeTokenFromCodeIterator: ReturnType<typeof exchangeInstagramTokenFromCode>;
  let exchangeLongLivedTokenIterator: ReturnType<typeof exchangeInstagramLongLivedToken>;

  // We have to test twice, once for a successful load and once for an unsuccessful one
  // so we do all the stuff that happens beforehand automatically in the beforeEach
  beforeEach(() => {
    getInstagramPostsIterator = getInstagramFeeds();
    const userDescriptor = getInstagramPostsIterator.next().value;
    expect(userDescriptor).toMatchSnapshot();

    const postsDescriptor = getInstagramPostsIterator.next().value;
    expect(postsDescriptor).toMatchSnapshot();

    exchangeTokenFromCodeIterator = exchangeInstagramTokenFromCode('');
    const responseDescriptor = exchangeTokenFromCodeIterator.next().value;
    expect(responseDescriptor).toMatchSnapshot();

    exchangeLongLivedTokenIterator = exchangeInstagramLongLivedToken('');
    const longLivedTokenResponseDescriptor = exchangeLongLivedTokenIterator.next().value;
    expect(longLivedTokenResponseDescriptor).toMatchSnapshot();
  });

  it('should return set posts to empty array if feed response is empty', () => {
    const response = {
      data: {
        data: []
      }
    }
    const putDescriptor = getInstagramPostsIterator.next(response).value;
    expect(putDescriptor).toEqual(
      put(slice.instagramActions.setPosts([])),
    );

    const iteration = getInstagramPostsIterator.next();
    expect(iteration.done).toBe(true);
  });

  it('should setGetFeedsErrorState to true when response.data is undefined', () => {
    const response = {
      data: undefined
    }

    const putDescriptor = getInstagramPostsIterator.next(response).value;
    expect(putDescriptor).toEqual(
      put(slice.instagramActions.setGetFeedsErrorState(true)),
    );

    const iteration = getInstagramPostsIterator.next();
    expect(iteration.done).toBe(true);
  });

  it('should setExchangeTokenErrorState to true when response.response is defined', () => {
    const response = {
      response: {}
    }

    const putDescriptor = exchangeTokenFromCodeIterator.next(response).value;
    expect(putDescriptor).toEqual(
      put(slice.instagramActions.setExchangeTokenErrorState(true)),
    );

    const iteration = exchangeTokenFromCodeIterator.next();
    expect(iteration.done).toBe(true);
  });

  it('should exchangeLongLivedToken when response.data.access_token is defined', () => {
    const response = {
      data: {
        access_token: 'token'
      }
    }

    const putDescriptor = exchangeTokenFromCodeIterator.next(response).value;
    expect(putDescriptor).toEqual(
      put(slice.instagramActions.exchangeLongLivedToken('token')),
    );

    const iteration = exchangeTokenFromCodeIterator.next();
    expect(iteration.done).toBe(true);
  });

  it('should setExchangeTokenErrorState when response.response is defined when exchanging long lived token', () => {
    const response = {
      response: {}
    }

    const putDescriptor = exchangeLongLivedTokenIterator.next(response).value;
    expect(putDescriptor).toEqual(
      put(slice.instagramActions.setExchangeTokenErrorState(true)),
    );

    const iteration = exchangeLongLivedTokenIterator.next();
    expect(iteration.done).toBe(true);
  });

  it('should setIsConnected to true and getUser when response.data.token is recieved when exchanging long lived token', () => {
    const response = {
      data: {
        access_token: 'token'
      }
    }

    const result = {
      success: true,
    }
    
    const callUpdateUserInstagramTokenDescriptor = exchangeLongLivedTokenIterator.next(response).value;
    expect(callUpdateUserInstagramTokenDescriptor).toEqual(
      call(updateUserInstagramToken, 'token'),
    );

    const putSetIsConnectedDescriptor = exchangeLongLivedTokenIterator.next(result).value;
    expect(putSetIsConnectedDescriptor).toEqual(
      put(slice.instagramActions.setIsConnected(true)),
    );

    const putGetUserDescriptor = exchangeLongLivedTokenIterator.next(result).value;
    expect(putGetUserDescriptor).toEqual(
      put(loginActions.getUser()),
    );

    const iteration = exchangeLongLivedTokenIterator.next();
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

  it('should start task to watch for exchangeTokenFromCode action', () => {
    const takeLatestDescriptor = instagramIterator.next().value;
    expect(takeLatestDescriptor).toEqual(
      takeLatest(slice.instagramActions.exchangeTokenFromCode.type, exchangeInstagramTokenFromCode),
    );
  });

  it('should start task to watch for exchangeLongLivedToken action', () => {
    const takeLatestDescriptor = instagramIterator.next().value;
    expect(takeLatestDescriptor).toEqual(
      takeLatest(slice.instagramActions.exchangeLongLivedToken.type, exchangeInstagramLongLivedToken),
    );
  });
});
