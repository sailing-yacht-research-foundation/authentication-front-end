/* --- STATE --- */
export interface LoginState {
  user: any,
  is_authenticated: boolean,
  session_token: string,
  syrf_authenticated: boolean;
  user_coordinate?: null | Coordinate;
}

export type ContainerState = LoginState

export interface Coordinate {
  lat: number;
  lon: number;
}