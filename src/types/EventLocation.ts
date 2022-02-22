import { CRS } from "./CRS";

export interface EventLocation {
    crs: CRS;
    type: string;
    coordinates: number[];
}