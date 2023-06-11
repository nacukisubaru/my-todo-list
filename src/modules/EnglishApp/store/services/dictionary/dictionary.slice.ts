import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkAxiosGet } from "../../../../../helpers/queryHelper";

interface IState {
    dictionary: IDictionary[]
    status: string,
    error: string
}

const initialState:IState = {
    dictionary: [],
    status: "",
    error: ""
};

export const getDictionaryByUser: any = createAsyncThunk(
    'todos/fetch',
    async (page, { rejectWithValue }) => {
        return thunkAxiosGet('/dictionary/get-list-by-user/', {page}, rejectWithValue);
    }
);

export const dictionarySlice = createSlice({
    name: 'dictionary',
    initialState,
    reducers: {
        addWord: (state, action: PayloadAction<{data:IDictionary[]}>) => {
            state.dictionary.concat(action.payload.data);
        },
    },
    extraReducers: {
        [getDictionaryByUser.pending]: (state) => {
            state.status = 'loading';
            state.error = '';
        },
        [getDictionaryByUser.fulfilled]: (state, action: PayloadAction<{rows: IDictionary[]}>) => {
            state.status = 'resolved';
            state.dictionary = action.payload.rows;
        },
        [getDictionaryByUser.rejected]: (state,action) => {
            state.status = 'rejected';
            state.error = action.payload;
        },
    }
});

export const dictionaryReducer = dictionarySlice.reducer;
export const dictionaryActions = dictionarySlice.actions;