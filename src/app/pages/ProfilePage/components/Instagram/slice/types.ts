/* --- STATE --- */
export interface InstagramState {
    posts: object[],
    isConnected: boolean,
    getFeedError: boolean,
    exchangeTokenError: boolean,
  }
  
  export type ContainerState = InstagramState
  