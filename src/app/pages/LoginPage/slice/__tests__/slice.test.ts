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

  it('should handle setAccessToken', () => {
    const accessToken = "";
    expect(
      slice.reducer(state, slice.loginActions.setAccessToken(accessToken)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      access_token: accessToken
    });
  });

  it('should handle setLogout', () => {
    expect(
      slice.reducer(state, slice.loginActions.setLogout()),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      is_authenticated: false,
      access_token: ''
    });
  });
});
