import OuroborosRace from "utils/race/OuroborosRace";

/* --- STATE --- */
export interface PlaybackState {
    elapsedTime: number;
    raceLength: number;
    competitionUnitId?: string;
    competitionUnitDetail?: any;
    vesselParticipants?: any[];
    isPlaying?: boolean;
  }
  
  export type ContainerState = PlaybackState
  