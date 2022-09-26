import { PayloadAction } from "@reduxjs/toolkit";
import { CompetitionUnit } from "types/CompetitionUnit";
import { VesselParticipant } from "types/EventVesselParticipant";
import { PlaybackTypes } from "types/Playback";
import { createSlice } from "utils/@reduxjs/toolkit";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import playbackSaga from "./saga";
import { PlaybackState } from "./types";

export const initialState: PlaybackState = {
    elapsedTime: 0,
    raceLength: 0,
    competitionUnitId: "",
    competitionUnitDetail: {},
    vesselParticipants: [],
    isPlaying: false,
    searchRaceId: "",
    searchRaceDetail: "",
    playbackType: PlaybackTypes.RACELOADING,
    raceSimplifiedTracks: [],
    raceLegs: [],
    raceCourseDetail: {},
    raceTime: {
        start: 0,
        end: 0,
    },
    realRaceTime: {
        start: 0,
        end: 0,
    },
    raceRetrievedTimestamps: [],
    timeBeforeRaceBegin: 0,
    isConnecting: false,
    speed: 1,
    viewsCount: 0,
    canIncreaseDecreaseSpeed: true,
    isSimplifiedPlayback: false,
    vesselParticipantForShowingKudos: {},
    windTime: {
        year: '0',
        month: '0',
        date: '0',
        hour: '0'
    }
};

const slice = createSlice({
    name: "playback",
    initialState,
    reducers: {
        setElapsedTime(state, action: PayloadAction<number>) {
            state.elapsedTime = action.payload;
        },
        setRaceLength(state, action: PayloadAction<number>) {
            state.raceLength = action.payload;
        },
        setCompetitionUnitId(state, action: PayloadAction<string>) {
            state.competitionUnitId = action.payload;
        },
        setCompetitionUnitDetail(state, action: PayloadAction<CompetitionUnit>) {
            state.competitionUnitDetail = action.payload;
        },
        setVesselParticipants(state, action: PayloadAction<VesselParticipant[]>) {
            state.vesselParticipants = action.payload;
        },
        setIsPlaying(state, action: PayloadAction<boolean>) {
            state.isPlaying = action.payload;
        },
        setSearchRaceId(state, action: PayloadAction<string>) {
            state.searchRaceId = action.payload;
        },
        setSearchRaceDetail(state, action: PayloadAction<any>) {
            state.searchRaceDetail = action.payload;
        },
        setPlaybackType(state, action: PayloadAction<PlaybackTypes>) {
            state.playbackType = action.payload;
        },
        setRaceSimplifiedTracks(state, action: PayloadAction<any>) {
            state.raceSimplifiedTracks = action.payload;
        },
        setRaceLegs(state, action: PayloadAction<any>) {
            state.raceLegs = action.payload;
        },
        setRaceCourseDetail(state, action: PayloadAction<any>) {
            state.raceCourseDetail = action.payload;
        },
        setRaceTime(state, action: PayloadAction<any>) {
            state.raceTime = action.payload;
        },
        setRealRaceTime(state, action: PayloadAction<any>) {
            state.realRaceTime = action.payload;
        },
        setRetrievedTimestamps(state, action: PayloadAction<any>) {
            state.raceRetrievedTimestamps = action.payload;
        },
        setTimeBeforeRaceBegin(state, action: PayloadAction<number>) {
            state.timeBeforeRaceBegin = action.payload;
        },
        setIsConnecting(state, action: PayloadAction<boolean>) {
            state.isConnecting = action.payload;
        },
        getCompetitionUnitDetail(state, action: PayloadAction<any>) { },
        getVesselParticipants(state, action: PayloadAction<any>) { },
        getSearchRaceDetail(state, action: PayloadAction<any>) { },
        getRaceData(state, action: PayloadAction<any>) { },
        getRaceSimplifiedTracks(state, action: PayloadAction<any>) { },
        getRaceLegs(state, action: PayloadAction<any>) { },
        getRaceStartTimeAndEndTime(state, action: PayloadAction<any>) { },
        getRaceCourseDetail(state, action: PayloadAction<any>) { },
        getOldRaceData(state, action: PayloadAction<any>) { },
        getTimeBeforeRaceBegin(state, action: PayloadAction<any>) { },
        getAndSetRaceLengthUsingServerData(state, action: PayloadAction<any>) { },
        setPlaybackSpeed(state, action: PayloadAction<number>) {
            state.speed = action.payload;
        },
        setViewsCount(state, action: PayloadAction<number>) {
            state.viewsCount = action.payload;
        },
        setCanIncreaseDecreaseSpeed(state, action: PayloadAction<boolean>) {
            state.canIncreaseDecreaseSpeed = action.payload;
        },
        setIsSimplifiedPlayback(state, action: PayloadAction<boolean>) {
            state.isSimplifiedPlayback = action.payload;
        },
        setVesselParticipantIdForShowingKudos(state, action: PayloadAction<any>) {
            state.vesselParticipantForShowingKudos = action.payload;
        },
        clearData(state) {
            state.elapsedTime = 0;
            state.raceLength = 0;
            state.raceCourseDetail = {};
            state.raceTime.start = 0;
            state.raceTime.end = 0;
            state.realRaceTime = state.raceTime;
            state.windTime = {
                year: '0',
                month: '0',
                date: '0',
                hour: '0'
            }
        },
        setWindTime(state, action: PayloadAction<any>) {
            state.windTime = action.payload;
        }
    },
});

export const { actions: playbackActions, reducer } = slice;

export const usePlaybackSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: playbackSaga });
    return { actions: slice.actions };
};
