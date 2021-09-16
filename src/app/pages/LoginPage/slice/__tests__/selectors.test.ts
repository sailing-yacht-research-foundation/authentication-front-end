import * as selectors from '../selectors';
import { RootState } from 'types';
import { initialState } from '..';

describe('Login selectors', () => {
  let state: RootState = {};

  beforeEach(() => {
    state = {};
  });

  it('should select the initial state', () => {
    expect(selectors.selectSessionToken(state)).toEqual("");
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
      login: { ...initialState, is_authenticated: isAuthenticated },
    };
    expect(selectors.selectIsAuthenticated(state)).toEqual(isAuthenticated);
  });
});
