import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkAxiosGet } from "../../../helpers/queryHelper";
import {ITodoList} from "../types/todo.types";

interface IState {
    todos: ITodoList[],
    status: string,
    error: string
}

const initialState:IState = {
    todos: [],
    status: "",
    error: ""
};

export const getTodosBySection: any = createAsyncThunk(
    'todos/fetch',
    async (id, { rejectWithValue }) => {
        return thunkAxiosGet('/todo-list/by-section/'+id, {}, rejectWithValue);
    }
);

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
    },
    extraReducers: {
        [getTodosBySection.pending]: (state) => {
            state.status = 'loading';
            state.error = '';
        },
        [getTodosBySection.fulfilled]: (state, action: PayloadAction<ITodoList[]>) => {
            state.status = 'resolved';
            state.todos = action.payload;
        },
        [getTodosBySection.rejected]: (state,action) => {
            state.status = 'rejected';
            state.error = action.payload;
        },
    }
});

export const todosReducer = todosSlice.reducer;
export const todosActions = todosSlice.actions;