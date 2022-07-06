import { TableFiltering } from "types/TableFiltering";
import { TableSorting } from "types/TableSorting";

/* --- STATE --- */
export interface TrackState {
    isDeletingTrack: boolean;
    pagination: any;
    sorter: Partial<TableSorting>;
    filter: TableFiltering[];
    isLoading: boolean;
  }
  
  export type ContainerState = TrackState;