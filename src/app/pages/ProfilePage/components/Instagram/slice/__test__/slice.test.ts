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
      slice.reducer(state, slice.instagramActions.setPosts([])),
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
    const posts = [];
    expect(
      slice.reducer(state, slice.instagramActions.setPosts([])),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      posts: []
    });
  });

  it('should handle exchangeTokenFromCode', () => {
    const posts = [];
    expect(
      slice.reducer(state, slice.instagramActions.setPosts([])),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      posts: []
    });
  });

  it('should handle exchangeLongLivedToken', () => {
    const posts = [];
    expect(
      slice.reducer(state, slice.instagramActions.setPosts([])),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      posts: []
    });
  });
});
