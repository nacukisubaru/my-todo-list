import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkAxiosGet } from "../../../helpers/queryHelper";
import {ISection, ITodoItem} from "../../../types/todo.types";

interface IState {
    sections: ISection[],
    sectionId: string,
    status: string,
    error: string
}

const initialState:IState = {
    sections: [],
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
        setSections: (state, action: PayloadAction<{data:ISection[]}>) => {
            state.sections = action.payload.data; 
        },
        setSectionId: (state, action: PayloadAction<{sectionId: string}>) => {
            state.sectionId = action.payload.sectionId;
        }
        // setTodoItems: (state, action: PayloadAction<{data: ITodoItem[]}>) => {
        //     state.todosItems = action.payload.data;
        // }
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