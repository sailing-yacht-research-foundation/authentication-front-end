import { CRS } from "./CRS";

export interface ApproximateStartLocation {
    crs: CRS;
    type: string;
    coordinates: number[];
}