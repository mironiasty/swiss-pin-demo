import { createSlice, configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

interface AppState {
    backgroundTime: number | null;
}
const initialState: AppState = {
    backgroundTime: null,
};

const appStateSlice = createSlice({
    name: 'appState',
    initialState,
    reducers: {
        setBackgroundTime: state => {
            // using `performance` instead of Date!
            // Date can be 'tricked' by user, by changing device time.
            state.backgroundTime = performance.now();
        },
        clearBackgroundTime: state => {
            state.backgroundTime = null;
        },
    },
});

export const { setBackgroundTime, clearBackgroundTime } = appStateSlice.actions;

const store = configureStore({
    reducer: appStateSlice.reducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
