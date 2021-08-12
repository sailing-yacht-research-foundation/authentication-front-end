import OuroborosRace from "utils/race/OuroborosRace";

/* --- STATE --- */
export interface PlaybackState {
    elapsedTime: number;
    raceLength: number;
    race: any;
  }
  
  export type ContainerState = PlaybackState
  