import { TableFiltering } from "types/TableFiltering";
import { TableSorting } from "types/TableSorting";

/* --- STATE --- */
export interface VesselListState {
    pagination: any;
    sorter: Partial<TableSorting>;
    filter: TableFiltering[];
    isLoading: boolean;
  }

  export type ContainerState = VesselListState;
