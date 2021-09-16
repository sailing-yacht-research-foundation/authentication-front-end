import * as slice from '..';
import { ContainerState } from '../types';

describe('Login slice', () => {
  let state: ContainerState;

  beforeEach(() => {
    state = slice.initialState;
  });

  it('should return the initial state', () => {
    expect(slice.reducer(undefined, { type: '' })).toEqual(state);
  });

  it('should handle setUser', () => {
    const user = {};
    expect(
      slice.reducer(state, slice.loginActions.setUser(user)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      user: user,
    });
  });

  it('should handle setIsAuthenticated', () => {
    expect(
      slice.reducer(state, slice.loginActions.setIsAuthenticated(true)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
        is_authenticated: true
    });
  });

  it('should handle setSessionToken', () => {
    const sessionToken = "";
    expect(
      slice.reducer(state, slice.loginActions.setSessionToken(sessionToken)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      session_token: sessionToken
    });
  });

  it('should handle setLogout', () => {
    expect(
      slice.reducer(state, slice.loginActions.setLogout()),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      is_authenticated: false,
      session_token: ''
    });
  });
});
