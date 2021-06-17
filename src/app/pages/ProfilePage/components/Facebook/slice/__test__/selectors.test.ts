import * as selectors from '../selectors';
import { RootState } from 'types';
import { initialState } from '..';

describe('Facebook selectors', () => {
  let state: RootState = {};

  beforeEach(() => {
    state = {};
  });

  it('should select the initial state', () => {
    expect(selectors.selectIsConnected(state)).toEqual(false);
  });

  it('should select isConnected', () => {
    state = {
      facebook: { ...initialState, isConnected: false },
    };
    expect(selectors.selectIsConnected(state)).toEqual(false);
  });

  it('should select posts', () => {
    const posts = [];
    state = {
      facebook: { ...initialState, posts: posts },
    };
    expect(selectors.selectPosts(state)).toEqual(posts);
  });
});
