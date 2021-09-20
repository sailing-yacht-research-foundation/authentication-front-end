/* --- STATE --- */
export interface HomeState {
    results: any[];
    keyword: string;
    from_date: string;
    to_date: string;
    page: number;
    is_searching: boolean;
    total: number;
    page_size: number;
  }
  
  export type ContainerState = HomeState
  