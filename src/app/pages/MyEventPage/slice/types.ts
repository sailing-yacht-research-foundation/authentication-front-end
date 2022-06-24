/* --- STATE --- */
export interface MyEventListState {
    results: any[];
    page: number;
    total: number;
    is_changing_page: boolean;
    size: number;
    keyword: string;
  }
  
  export type ContainerState = MyEventListState
  