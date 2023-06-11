import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkAxiosGet } from "../../../../../helpers/queryHelper";

interface IState {
    dictionary: IDictionary[],
    translateResult: ITranslateResult,
    status: string,
    error: string
}

const initialState:IState = {
    dictionary: [],
    translateResult: {translatedWord: "", originalWord: ""},
    status: "",
    error: ""
};

export const getDictionaryByUser: any = createAsyncThunk(
    'dictionary/fetch',
    async (page, { rejectWithValue }) => {
        return thunkAxiosGet('/dictionary/get-list-by-user/', {page}, rejectWithValue);
    }
);

export const translateWord: any = createAsyncThunk(
    'translate/fetch',
    async (params: ITranslateParams, { rejectWithValue }) => {
        return thunkAxiosGet('/yandex-cloud/translate/', params, rejectWithValue);
    }
);

export const dictionarySlice = createSlice({
    name: 'dictionary',
    initialState,
    reducers: {
        addWord: (state, action: PayloadAction<IDictionary>) => {
            console.log(action.payload)
            const dictionaryArray = [...state.dictionary];
            dictionaryArray.unshift(action.payload);
            state.dictionary = dictionaryArray;
        },
        resetTranslateResult: (state) => {
            state.translateResult = {translatedWord: "", originalWord: ""};
        }
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

        [translateWord.pending]: (state) => {
            state.status = 'loading';
            state.error = '';
        },
        [translateWord.fulfilled]: (state, action: PayloadAction<ITranslateResult>) => {
            state.status = 'resolved';
            state.translateResult = action.payload;
        },
        [translateWord.rejected]: (state,action) => {
            state.status = 'rejected';
            state.error = action.payload;
        },

    }
});

export const dictionaryReducer = dictionarySlice.reducer;
export const dictionaryActions = dictionarySlice.actions;