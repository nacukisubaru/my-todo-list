import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IState {
    isActiveAddTaskBtn: boolean,
}

const initialState:IState = {
    isActiveAddTaskBtn: true,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveAddTaskBtn: (state, action: PayloadAction<{isActive: boolean}>) => {
            state.isActiveAddTaskBtn = action.payload.isActive;
        },
    },
}); 

export const uiReducer = uiSlice.reducer;
export const uiActions = uiSlice.actions;