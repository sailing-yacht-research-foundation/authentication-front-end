/* --- STATE --- */
export interface FacebookState {
    posts: object[],
    isConnected: boolean,
    getFeedError: boolean,
    exchangeTokenError: boolean,
  }
  
  export type ContainerState = FacebookState
  