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
        getCompetitionUnitDetail(state, action: PayloadAction<any>) {},
        getVesselParticipants(state, action: PayloadAction<any>) {},
        getSearchRaceDetail(state, action: PayloadAction<any>) {},
        getRaceData(state, action: PayloadAction<any>) {},
    },
});

export const { actions: playbackActions, reducer } = slice;

export const usePlaybackSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: playbackSaga });
    return { actions: slice.actions };
};
