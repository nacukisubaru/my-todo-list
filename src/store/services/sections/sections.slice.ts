import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkAxiosGet } from "../../../helpers/queryHelper";
import {ITodoItem} from "../../../types/todo.types";

interface IState {
    sections: ITodoItem[],
    sectionItems: ITodoItem[],
    sectionId: string,
    currentSection: any,
    status: string,
    error: string
}

const initialState:IState = {
    sections: [],
    sectionItems: [],
    currentSection: {},
    sectionId: '',
    status: "",
    error: ""
};

export const getSections: any = createAsyncThunk(
    'sections/fetch',
    async (_, { rejectWithValue }) => {
        return thunkAxiosGet('/sections-list/list/', {}, rejectWithValue);
    }
);


export const sectionsSlice = createSlice({
    name: 'sections',
    initialState,
    reducers: {
        setSections: (state, action: PayloadAction<{data:ITodoItem[]}>) => {
            state.sections = action.payload.data; 
        },
        setSectionId: (state, action: PayloadAction<{sectionId: string}>) => {
            state.sectionId = action.payload.sectionId;
        },
        setSectionItems: (state, action: PayloadAction<{data: ITodoItem[]}>) => {
            state.sectionItems = action.payload.data;
        },
        setCurrentSection: (state, action: PayloadAction<{section: any}>) => {
            state.currentSection = action.payload.section;
        }
    },
    extraReducers: {
        [getSections.pending]: (state) => {
            state.status = 'loading';
            state.error = '';
        },
        [getSections.fulfilled]: (state, action: PayloadAction<ITodoItem[]>) => {
            state.status = 'resolved';
            state.sections = action.payload;
        },
        [getSections.rejected]: (state,action) => {
            state.status = 'rejected';
            state.error = action.payload;
        },
    }
});

export const sectionsReducer = sectionsSlice.reducer;
export const sectionsActions = sectionsSlice.actions;