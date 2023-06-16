import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkAxiosGet } from "../../../../../helpers/queryHelper";
import { arrayUniqueByKey } from "../../../../../helpers/arrayHelper";

interface IState {
    dictionary: IDictionary[],
    dictionarySettings: IDictionarySettings,
    translateResult: ITranslateResult,
    languages: ILanguage[],
    page: number,
    status: string,
    error: string
}

const initialState:IState = {
    dictionary: [],
    dictionarySettings: {targetLanguage: ""},
    translateResult: {
        translatedWord: "", 
        originalWord: "",
        textLang: ""
    },
    languages: [],
    page: 0,
    status: "",
    error: ""
};

export const getDictionaryByUser: any = createAsyncThunk(
    'dictionary/fetch',
    async (page, { rejectWithValue }) => {
        return thunkAxiosGet('/dictionary/get-list-by-user/', {page}, rejectWithValue);
    }
);

export const getDictionarySettings: any = createAsyncThunk(
    'dictionary-settings/fetch',
    async (_, { rejectWithValue }) => {
        return thunkAxiosGet('/dictionary-settings/get-settings-by-user/', {}, rejectWithValue);
    }
);

export const getLanguages: any = createAsyncThunk(
    'languages/fetch',
    async (_, { rejectWithValue }) => {
        return thunkAxiosGet('/yandex-cloud/get-languages-list/', {}, rejectWithValue);
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
            const dictionaryArray = [...state.dictionary];
            dictionaryArray.unshift(action.payload);
            state.dictionary = dictionaryArray;
        },
        resetTranslateResult: (state) => {
            state.translateResult = {translatedWord: "", originalWord: "", textLang: ""};
        },
        setDictionary: (state, action: PayloadAction<IDictionary[]>) => {
            console.log({action})
            state.dictionary = action.payload;
        }
    },
    extraReducers: {
        [getDictionaryByUser.pending]: (state) => {
            state.status = 'loading';
            state.error = '';
        },
        [getDictionaryByUser.fulfilled]: (state, action: PayloadAction<{rows: IDictionary[], nextPage: number}>) => {
            state.status = 'resolved';
            state.dictionary = arrayUniqueByKey(state.dictionary.concat(action.payload.rows));
            state.page = action.payload.nextPage;
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

        [getLanguages.pending]: (state) => {
            state.status = 'loading';
            state.error = '';
        },
        [getLanguages.fulfilled]: (state, action: PayloadAction<ILanguage[]>) => {
            state.status = 'resolved';
            state.languages = action.payload;
        },
        [getLanguages.rejected]: (state,action) => {
            state.status = 'rejected';
            state.error = action.payload;
        },

        [getDictionarySettings.pending]: (state) => {
            state.status = 'loading';
            state.error = '';
        },
        [getDictionarySettings.fulfilled]: (state, action: PayloadAction<IDictionarySettings>) => {
            state.status = 'resolved';
            state.dictionarySettings = {targetLanguage: action.payload.targetLanguage};
        },
        [getDictionarySettings.rejected]: (state,action) => {
            state.status = 'rejected';
            state.error = action.payload;
        },
    }
});

export const dictionaryReducer = dictionarySlice.reducer;
export const dictionaryActions = dictionarySlice.actions;