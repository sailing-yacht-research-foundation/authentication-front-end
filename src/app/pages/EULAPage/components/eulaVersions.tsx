import { EulaInterface } from "types/Eula";
import { EulaV100 } from "./eulaV100";

// Should be ascending based on version release
export const versionList: EulaInterface[] = [
  {
    key: "eula-1.0.0",
    version: "1.0.0",
    releaseDate: new Date("November 2, 2021 00:00:00"),
    Component: EulaV100,
  },
];
