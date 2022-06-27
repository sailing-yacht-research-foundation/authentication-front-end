import { TableFilteringType } from "utils/constants";

export interface TableFiltering {
    key: string;
    value: any;
    type: TableFilteringType;
}
