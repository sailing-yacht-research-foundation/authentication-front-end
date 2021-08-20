import OuroborosRace from "utils/race/OuroborosRace";

/* --- STATE --- */
export interface PlaybackState {
    elapsedTime: number;
    raceLength: number;
  }
  
  export type ContainerState = PlaybackState
  