/* --- STATE --- */
export interface LoginState {
  user: Object,
  is_authenticated: boolean,
  access_token: string,
  syrf_authenticated: boolean;
}

export type ContainerState = LoginState
