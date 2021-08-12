import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import OuroborosRace from 'utils/race/OuroborosRace';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import playbackSaga from './saga';
import { PlaybackState } from './types';

export const initialState: PlaybackState = {
    elapsedTime: 0,
    raceLength: 0,
    race: {},
};

const slice = createSlice({
    name: 'playback',
    initialState,
    reducers: {
        setElapsedTime(state, action: PayloadAction<number>) {
            state.elapsedTime = action.payload;
        },
        setRaceLength(state, action: PayloadAction<number>) {
            state.raceLength = action.payload;
        },
        setRace(state, action: PayloadAction<OuroborosRace>) {
            state.race = action.payload;
        }
    },
});

export const { actions: playbackActions, reducer } = slice;

export const usePlaybackSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: playbackSaga });
    return { actions: slice.actions };
};
