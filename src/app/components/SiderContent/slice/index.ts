import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import siderSaga from './saga';
import { SiderState } from './types';

export const initialState: SiderState = {
    isToggled: true
};

const slice = createSlice({
    name: 'sider',
    initialState,
    reducers: {
        setIsToggled(state, action: PayloadAction<boolean>) {
            console.log(action.payload);
            state.isToggled = action.payload;
        }
    },
});

export const { actions: loginActions, reducer } = slice;

export const useSiderSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga: siderSaga });
    return { actions: slice.actions };
};
