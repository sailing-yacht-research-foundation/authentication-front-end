/* --- STATE --- */
export interface LoginState {
  user: any,
  is_authenticated: boolean,
  session_token: string,
  syrf_authenticated: boolean;
  user_coordinate?: null | Coordinate;
  refresh_token?: string;
  get_profile_attempts_count?: number;
  token_expired_date: any;
  refresh_token_expired_date: any;
}

export type ContainerState = LoginState

export interface Coordinate {
  lat: number;
  lon: number;
}