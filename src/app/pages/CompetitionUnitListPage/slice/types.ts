/* --- STATE --- */
export interface MyRaceListState {
    results: any[];
    page: number;
    total: number;
    is_changing_page: boolean;
  }
  
  export type ContainerState = MyRaceListState
  