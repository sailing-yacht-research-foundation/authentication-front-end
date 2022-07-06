import { TableFiltering } from "types/TableFiltering";
import { TableSorting } from "types/TableSorting";

/* --- STATE --- */
export interface MyEventListState {
    results: any[];
    page: number;
    total: number;
    is_changing_page: boolean;
    size: number;
    filter: TableFiltering[];
    sorter: Partial<TableSorting>;
  }
  
  export type ContainerState = MyEventListState
  