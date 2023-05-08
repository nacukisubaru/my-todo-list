import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IState {
    isActiveAddTaskBtn: boolean,
    isActiveAddSectionBtn: boolean,
    showMenu: boolean
}

const initialState:IState = {
    isActiveAddTaskBtn: true,
    isActiveAddSectionBtn: true,
    showMenu: false
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveAddTaskBtn: (state, action: PayloadAction<{isActive: boolean}>) => {
            state.isActiveAddTaskBtn = action.payload.isActive;
        },
        setActiveAddSectionBtn: (state, action: PayloadAction<{isActive: boolean}>) => {
            state.isActiveAddSectionBtn = action.payload.isActive;
        },
        toggleMenu: (state, action: PayloadAction<{isActive: boolean}>) => {
            state.showMenu = action.payload.isActive;
        }
    },
}); 

export const uiReducer = uiSlice.reducer;
export const uiActions = uiSlice.actions;