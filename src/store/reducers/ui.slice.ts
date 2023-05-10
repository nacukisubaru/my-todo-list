import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IState {
    isActiveAddTaskBtn: boolean,
    isActiveAddSectionBtn: boolean,
    showMenu: boolean,
    isVisibleDetailTodo: boolean
}

const initialState:IState = {
    isActiveAddTaskBtn: true,
    isActiveAddSectionBtn: true,
    showMenu: false,
    isVisibleDetailTodo: false
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
        },
        setVisibleDetailTodo: (state, action: PayloadAction<{isActive: boolean}>) => {
            state.isVisibleDetailTodo = action.payload.isActive;
        }
    },
}); 

export const uiReducer = uiSlice.reducer;
export const uiActions = uiSlice.actions;