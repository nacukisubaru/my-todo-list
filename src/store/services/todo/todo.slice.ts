import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkAxiosGet } from "../../../helpers/queryHelper";
import {ITodoItem} from "../../../types/todo.types";

interface IState {
    todos: ITodoItem[],
    todosItems: ITodoItem[],
    currentTodo: any,
    status: string,
    error: string
}

const initialState:IState = {
    todos: [],
    todosItems: [],
    currentTodo: {},
    status: "",
    error: ""
};

export const getTodosBySection: any = createAsyncThunk(
    'todos/fetch',
    async (id, { rejectWithValue }) => {
        return thunkAxiosGet('/todo-list/by-section/', {id}, rejectWithValue);
    }
);

export const getTodo: any = createAsyncThunk(
    'todo/fetch',
    async (id, { rejectWithValue }) => {
        return thunkAxiosGet('/todo-list/getById/', {id}, rejectWithValue);
    }
);

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        setTodos: (state, action: PayloadAction<{data:ITodoItem[]}>) => {
            state.todos = action.payload.data; 
        },
        setTodoItems: (state, action: PayloadAction<{data:ITodoItem[]}>) => {
            state.todosItems = action.payload.data;
        },
        setCurrentTodo: (state, action: PayloadAction<{todo: ITodoItem}>) => {
            state.currentTodo = action.payload.todo;
        }
    },
    extraReducers: {
        [getTodosBySection.pending]: (state) => {
            state.status = 'loading';
            state.error = '';
        },
        [getTodosBySection.fulfilled]: (state, action: PayloadAction<ITodoItem[]>) => {
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