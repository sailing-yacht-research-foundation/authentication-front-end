import { PayloadAction } from "@reduxjs/toolkit";
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
    raceTime: {},
    raceRetrievedTimestamps: [],
    timeBeforeRaceBegin: 0,
    isConnecting: false,
    speed: 1,
    viewsCount: 0,
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
        setCompetitionUnitDetail(state, action: PayloadAction<any>) {
            state.competitionUnitDetail = action.payload;
        },
        setVesselParticipants(state, action: PayloadAction<any>) {
            state.vesselParticipants = action.payload;
        },
        setIsPlaying(state, action: PayloadAction<any>) {
            state.isPlaying = action.payload;
        },
        setSearchRaceId(state, action: PayloadAction<any>) {
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
        setRetrievedTimestamps(state, action: PayloadAction<any>) {
            state.raceRetrievedTimestamps = action.payload;
        },
        setTimeBeforeRaceBegin(state, action: PayloadAction<number>) {
            state.timeBeforeRaceBegin = action.payload;
        },
        setIsConnecting(state, action: PayloadAction<boolean>) {
            state.isConnecting = action.payload;
        },
        getCompetitionUnitDetail(state, action: PayloadAction<any>) {},
        getVesselParticipants(state, action: PayloadAction<any>) {},
        getSearchRaceDetail(state, action: PayloadAction<any>) {},
        getRaceData(state, action: PayloadAction<any>) {},
        getRaceSimplifiedTracks(state, action: PayloadAction<any>) {},
        getRaceLegs(state, action: PayloadAction<any>) {},
        getRaceLength(state, action: PayloadAction<any>) {},
        getRaceCourseDetail(state, action: PayloadAction<any>) {},
        getOldRaceData(state, action: PayloadAction<any>) {},
        getTimeBeforeRaceBegin(state, action: PayloadAction<any>) {},
        setPlaybackSpeed(state, action: PayloadAction<number>) {
            state.speed = action.payload;
        },
        setViewsCount(state, action: PayloadAction<number>) {
            state.viewsCount = action.payload;
        }
    },
});

export const { actions: playbackActions, reducer } = slice;

export const usePlaybackSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: playbackSaga });
    return { actions: slice.actions };
};
