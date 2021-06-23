import * as selectors from '../selectors';
import { RootState } from 'types';
import { initialState } from '..';

describe('GithubRepoForm selectors', () => {
  let state: RootState = {};

  beforeEach(() => {
    state = {};
  });

  it('should select the initial state', () => {
    expect(selectors.selectAccessToken(state)).toEqual("");
  });

  it('should select user', () => {
    state = {
      login: { ...initialState, user: {} },
    };
    expect(selectors.selectUser(state)).toEqual({});
  });

  it('should select isAuthenticated', () => {
    const isAuthenticated = false;
    state = {
      login: { ...initialState, isAuthenticated: isAuthenticated },
    };
    expect(selectors.selectIsAuthenticated(state)).toEqual(isAuthenticated);
  });
});
