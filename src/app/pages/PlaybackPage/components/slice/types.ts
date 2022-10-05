import { PlaybackTypes } from "types/Playback";
import { VesselParticipant } from 'types/EventVesselParticipant';

/* --- STATE --- */
export interface PlaybackState {
    elapsedTime: number;
    raceLength: number;
    competitionUnitId?: string;
    competitionUnitDetail?: any;
    vesselParticipants?: VesselParticipant[];
    isPlaying?: boolean;
    searchRaceId?: string;
    searchRaceDetail?: any;
    playbackType?: PlaybackTypes;
    raceSimplifiedTracks?: any;
    raceLegs?: any;
    raceCourseDetail?: any;
    raceTime?: any;
    realRaceTime?: any;
    raceRetrievedTimestamps?: number[],
    timeBeforeRaceBegin?: number,
    isConnecting?: boolean,
    speed?: number;
    viewsCount: number;
    canIncreaseDecreaseSpeed: boolean;
    isSimplifiedPlayback: boolean;
    vesselParticipantForShowingKudos: any;
    windTime: any;
    isHavingCountdown: boolean;
}

export type ContainerState = PlaybackState;
