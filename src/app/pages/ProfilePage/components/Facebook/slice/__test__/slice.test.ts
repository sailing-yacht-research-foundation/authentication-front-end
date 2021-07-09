import * as slice from '..';
import { ContainerState } from '../types';

describe('Facebook slice', () => {
  let state: ContainerState;

  beforeEach(() => {
    state = slice.initialState;
  });

  it('should return the initial state', () => {
    expect(slice.reducer(undefined, { type: '' })).toEqual(state);
  });

  it('should handle setIsConnected', () => {
    expect(
      slice.reducer(state, slice.facebookActions.setIsConnected(true)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      isConnected: true
    });
  });

  it('should handle setPosts', () => {
    const posts = [];
    expect(
      slice.reducer(state, slice.facebookActions.setPosts([])),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      posts: []
    });
  });

  it('should handle setGetFeedsErrorState', () => {
    const getFeedError = true;
    expect(
      slice.reducer(state, slice.facebookActions.setGetFeedsErrorState(getFeedError)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      getFeedError: true
    });
  });

  it('should handle setExchangeTokenErrorState', () => {
    const exchangeTokenError = true;
    expect(
      slice.reducer(state, slice.facebookActions.setExchangeTokenErrorState(exchangeTokenError)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      exchangeTokenError: true
    });
  });

  it('should handle exchangeToken', () => {
    const token = 'token';
    expect(
      slice.reducer(state, slice.facebookActions.exchangeToken(token)),
    ).toEqual<ContainerState>({
      ...slice.initialState
    });
  });
});
