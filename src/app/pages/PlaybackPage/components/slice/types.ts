import { PlaybackTypes } from "types/Playback";

/* --- STATE --- */
export interface PlaybackState {
    elapsedTime: number;
    raceLength: number;
    competitionUnitId?: string;
    competitionUnitDetail?: any;
    vesselParticipants?: any[];
    isPlaying?: boolean;
    searchRaceId?: string;
    searchRaceDetail?: any;
    playbackType?: PlaybackTypes;
    raceSimplifiedTracks?: any;
    raceLegs?: any;
    raceCourseDetail?: any;
    raceTime?: any;
    raceRetrievedTimestamps?: number[],
    timeBeforeRaceBegin?: number,
}

export type ContainerState = PlaybackState;
