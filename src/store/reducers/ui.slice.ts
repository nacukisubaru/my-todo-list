import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IState {
    isActiveAddTaskBtn: boolean,
    editableTaskId: number,
    prevEditableTaskId: number
}

const initialState:IState = {
    isActiveAddTaskBtn: true,
    editableTaskId: 0,
    prevEditableTaskId: 0
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveAddTaskBtn: (state, action: PayloadAction<{isActive: boolean}>) => {
            state.isActiveAddTaskBtn = action.payload.isActive;
        },
        setEditableTaskId: (state, action: PayloadAction<{id: number}>) => {
            state.prevEditableTaskId = state.editableTaskId
            state.editableTaskId = action.payload.id;
        },
    },
}); 

export const uiReducer = uiSlice.reducer;
export const uiActions = uiSlice.actions;