/* --- STATE --- */
export interface LoginState {
  user: any,
  is_authenticated: boolean,
  session_token: string,
  syrf_authenticated: boolean;
}

export type ContainerState = LoginState
