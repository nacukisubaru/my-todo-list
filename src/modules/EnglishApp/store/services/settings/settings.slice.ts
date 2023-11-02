import { createSlice } from "@reduxjs/toolkit";

interface IState {
}

const initialState: IState = {
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
    }
});

export const settingsReducer = settingsSlice.reducer;
export const settingsActions = settingsSlice.actions;