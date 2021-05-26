/* --- STATE --- */
export interface LoginState {
  user: Object,
  isAuthenticated: Boolean,
  access_token: string
}

export type ContainerState = LoginState
