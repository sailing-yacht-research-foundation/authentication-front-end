import * as slice from '..';
import { ContainerState } from '../types';

describe('Instagram slice', () => {
  let state: ContainerState;

  beforeEach(() => {
    state = slice.initialState;
  });

  it('should return the initial state', () => {
    expect(slice.reducer(undefined, { type: '' })).toEqual(state);
  });

  it('should handle setIsConnected', () => {
    expect(
      slice.reducer(state, slice.instagramActions.setIsConnected(true)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
        isConnected: true
    });
  });

  it('should handle setPosts', () => {
    const posts = [];
    expect(
      slice.reducer(state, slice.instagramActions.setPosts(posts)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      posts: []
    });
  });

  it('should handle setGetFeedsErrorState', () => {
    const getFeedError = true;
    expect(
      slice.reducer(state, slice.instagramActions.setGetFeedsErrorState(getFeedError)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      getFeedError: true
    });
  });

  it('should handle setExchangeTokenErrorState', () => {
    expect(
      slice.reducer(state, slice.instagramActions.setExchangeTokenErrorState(true)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      exchangeTokenError: true
    });
  });

  it('should handle exchangeTokenFromCode', () => {
    expect(
      slice.reducer(state, slice.instagramActions.exchangeTokenFromCode('code')),
    ).toEqual<ContainerState>({
      ...slice.initialState
    });
  });

  it('should handle exchangeLongLivedToken', () => {
    expect(
      slice.reducer(state, slice.instagramActions.exchangeLongLivedToken('token')),
    ).toEqual<ContainerState>({
      ...slice.initialState
    });
  });
});
