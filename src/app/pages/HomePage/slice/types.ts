/* --- STATE --- */
export interface HomeState {
    results: any[];
    keyword: string;
    fromDate: string;
    toDate: string;
    page: number;
    isSearching: boolean;
    total: number;
    pageSize: number;
    showAdvancedSearch: boolean;
    sort: string;
    upcomingResults: any[];
    upcomingResultPage: number;
    upcomingResultSize: number;
    upcomingResultTotal: number;
    upcomingResultDistance: number;
    upcomingResultDuration: number;
    noResultFound: boolean;
    relations: any[];
  }
  
  export type ContainerState = HomeState
  