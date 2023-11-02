import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkAxiosGet } from "../../../../../helpers/queryHelper";
import { arrayUniqueByKey } from "../../../../../helpers/arrayHelper";

interface IState {
    dictionary: IDictionary[],
    dictionarySettings: IDictionarySettings,
    dictionaryActiveSettings: IDictionaryActiveSettings,
    translateResult: ITranslateResult,
    translateLanguages: string[],
    translateMethod: translateMethod,
    fullTranslateList: IFullTranslateObject[],
    analogsWord: IFullTranslateObject[],
    lingvoExamples: ILingvoExample[],
    languages: ILanguage[],
    filterDictionary: IFilterDictionary,
    page: number,
    status: string,
    error: IError
}

const initialState: IState = {
    dictionary: [],
    dictionaryActiveSettings: { id: 0, sourceLanguage: "", targetLanguage: "" },
    dictionarySettings: {
        settings: [],
        langsForStudy: [],
        studyLangs: [],
        settingsForSelector: []
    },
    translateLanguages: [],
    translateMethod: "lingvo",
    translateResult: {
        translatedWord: "",
        originalWord: "",
        translateLang: "",
        originalLang: ""
    },
    fullTranslateList: [],
    analogsWord: [],
    languages: [],
    lingvoExamples: [],
    filterDictionary: {
        page: 0,
        languageOriginal: [],
        languageTranslation: [],
        studyStage: [],
        searchByOriginal: '',
        searchByTranslate: ''
    },
    page: 0,
    status: "",
    error: { statusCode: 0, message: "", errorCode: "" }
};

export const getDictionaryByUser = createAsyncThunk(
    'dictionary/fetch',
    async (params: IGetDictionaryListParams, { rejectWithValue }) => {
        return thunkAxiosGet('/dictionary/get-list-by-user/', { ...params }, rejectWithValue);
    }
);

export const getDictionaryActiveSettings = createAsyncThunk(
    'dictionary-active-settings/fetch',
    async (_, { rejectWithValue }) => {
        return thunkAxiosGet('/dictionary-settings/get-active-settings-by-user/', {}, rejectWithValue);
    }
);

export const getDictionarySettings = createAsyncThunk(
    'dictionary-settings/fetch',
    async (_, { rejectWithValue }) => {
        return thunkAxiosGet('/dictionary-settings/get-settings-by-user/', {}, rejectWithValue);
    }
);

export const getLanguages = createAsyncThunk(
    'languages/fetch',
    async (_, { rejectWithValue }) => {
        return thunkAxiosGet('/yandex-cloud/get-languages-list/', {}, rejectWithValue);
    }
);

export const translateWord = createAsyncThunk(
    'translate/fetch',
    async (params: ITranslateParams, { rejectWithValue }) => {
        return thunkAxiosGet('/lingvo-api/translate/', params, rejectWithValue);
    }
);

export const fullTranslate = createAsyncThunk(
    'full-translate/fetch',
    async (params: ITranslateParams, { rejectWithValue }) => {
        return thunkAxiosGet('/lingvo-api/full-translate/', params, rejectWithValue);
    }
);

export const getAnalogs = createAsyncThunk(
    'full-translate-analogs/fetch',
    async (params: ITranslateParams, { rejectWithValue }) => {
        return thunkAxiosGet('/lingvo-api/full-translate/', params, rejectWithValue);
    }
);

export const getExamplesForWord = createAsyncThunk(
    'get-examples-for-word/fetch',
    async (params: IExampleParams, { rejectWithValue }) => {
        return thunkAxiosGet('/lingvo-api/get-examples-for-word/', params, rejectWithValue);
    }
);

export const dictionarySlice = createSlice({
    name: 'dictionary',
    initialState,
    reducers: {
        addWord: (state, action: PayloadAction<IDictionary>) => {
            const dictionary: IDictionary = action.payload;
            const dictionaryArray = [...state.dictionary];
            const isExistWord = dictionaryArray.some((word) => word.originalWord === dictionary.originalWord
                && word.translatedWord === dictionary.translatedWord
            );
            if (!isExistWord) {
                dictionaryArray.unshift(dictionary);
                state.dictionary = dictionaryArray;
            }
        },
        resetTranslateResult: (state) => {
            state.translateResult = { translatedWord: "", originalWord: "", originalLang: "", translateLang: "" };
        },
        setDictionary: (state, action: PayloadAction<IDictionary[]>) => {
            state.dictionary = action.payload;
        },
        resetDictionary: (state) => {
            state.dictionary = [];
        },
        setDictionaryFilter: (state, action: PayloadAction<IFilterDictionary>) => {
            state.filterDictionary = action.payload;
        },
        resetDictionaryFilter: (state) => {
            state.filterDictionary = {
                page: 0,
                languageOriginal: [],
                languageTranslation: [],
                studyStage: [],
                searchByOriginal: '',
                searchByTranslate: ''
            };
        },
        changeTranslateLanguages: (state) => {
            if (state.translateLanguages[0] === state.dictionaryActiveSettings.sourceLanguage) {
                state.translateLanguages[0] = state.dictionaryActiveSettings.targetLanguage;
                state.translateLanguages[1] = state.dictionaryActiveSettings.sourceLanguage;
            } else {
                state.translateLanguages[0] = state.dictionaryActiveSettings.sourceLanguage;
                state.translateLanguages[1] = state.dictionaryActiveSettings.targetLanguage;
            }
        },
        changeTranslateMethod: (state) => {
            if (state.translateMethod === "lingvo") {
                state.translateMethod = "yandex";
            } else {
                state.translateMethod = "lingvo";
            }
        },
        resetFullTranslateList: (state) => {
            state.fullTranslateList = [];
            state.analogsWord = [];
            state.lingvoExamples = [];
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getDictionaryByUser.pending, (state) => {
            state.status = 'loading';
            state.error = { statusCode: 0, message: "", errorCode: "" };
          })
          .addCase(getDictionaryByUser.fulfilled, (state, action) => {
            state.status = 'resolved';
            state.dictionary = arrayUniqueByKey(state.dictionary.concat(action.payload.rows));
            state.page = action.payload.nextPage;
          })
          .addCase(getDictionaryByUser.rejected, (state, action) => {
            const errorObj: any = action.payload;
            state.status = 'rejected';
            state.error = errorObj;
          })

          .addCase(translateWord.pending, (state) => {
            state.status = 'loading';
            state.error = { statusCode: 0, message: "", errorCode: "" };
          })
          .addCase(translateWord.fulfilled, (state, action) => {
            state.status = 'resolved';
            state.translateResult = action.payload;
          })
          .addCase(translateWord.rejected, (state, action) => {
            const errorObj: any = action.payload;
            state.status = 'rejected';
            state.error = errorObj;
          })

          .addCase(getLanguages.pending, (state) => {
            state.status = 'loading';
            state.error = { statusCode: 0, message: "", errorCode: "" };
          })
          .addCase(getLanguages.fulfilled, (state, action) => {
            state.status = 'resolved';
            state.languages = action.payload;
          })
          .addCase(getLanguages.rejected, (state, action) => {
            const errorObj: any = action.payload;
            state.status = 'rejected';
            state.error = errorObj;
          })

          .addCase(getDictionaryActiveSettings.pending, (state) => {
            state.status = 'loading';
            state.error = { statusCode: 0, message: "", errorCode: "" };
          })
          .addCase(getDictionaryActiveSettings.fulfilled, (state, action) => {
                state.status = 'resolved';

                const sourceLanguage = action.payload.sourceLanguage;
                const targetLanguage = action.payload.targetLanguage;

                const langOriginalObj: any = {
                    code: action.payload.sourceLanguage,
                    isoName: action.payload.sourceISO
                };

                const langTranslationObj: any = {
                    code: action.payload.targetLanguage,
                    isoName: action.payload.targetISO
                };

                const langOriginal = state.filterDictionary.languageOriginal;
                const langTranslation = state.filterDictionary.languageTranslation;
                
                let languageOriginal:ILanguage[]  = [];
                let languageTranslation: ILanguage[] = [];
                if (langOriginal) {
                    if (langOriginal.length === 1) {
                        languageOriginal = langOriginal.filter(lang => lang.code !== state.dictionaryActiveSettings.sourceLanguage);
                    } else {
                        languageOriginal = langOriginal.filter(lang => lang.code !== sourceLanguage);
                    }
                }

                if (langTranslation) {
                    if (langTranslation.length === 1) {
                        languageTranslation = langTranslation.filter(lang => lang.code !== state.dictionaryActiveSettings.targetLanguage);
                    } else {
                        languageTranslation = langTranslation.filter(lang => lang.code !== targetLanguage);
                    }
                }

                if (!languageOriginal.find(lang => lang.code === langOriginalObj.code)) {
                    languageOriginal.push(langOriginalObj);
                }
              
                if (!languageTranslation.find(lang => lang.code === langTranslationObj.code)){
                    languageTranslation.push(langTranslationObj);
                }

                state.filterDictionary = {
                    ...state.filterDictionary,
                    languageOriginal,
                    languageTranslation,
                };
                
                state.dictionaryActiveSettings = {
                    id: action.payload.id,
                    sourceLanguage: action.payload.sourceLanguage,
                    targetLanguage: action.payload.targetLanguage,
                };

                state.translateLanguages = [action.payload.sourceLanguage, action.payload.targetLanguage];
          })
          .addCase(getDictionaryActiveSettings.rejected, (state, action) => {
            const errorObj: any = action.payload;
            state.status = 'rejected';
            state.error = errorObj;
          })

          .addCase(getDictionarySettings.pending, (state) => {
            state.status = 'loading';
            state.error = { statusCode: 0, message: "", errorCode: "" };
          })
          .addCase(getDictionarySettings.fulfilled, (state, action) => {
            state.status = 'resolved';
            state.dictionarySettings = action.payload;
            state.dictionarySettings.settingsForSelector = state.dictionarySettings.settings.map(setting => {
                return {
                    id: setting.id,
                    name: setting.sourceISO + '-' + setting.targetISO
                }
            });
          })
          .addCase(getDictionarySettings.rejected, (state, action) => {
            const errorObj: any = action.payload;
            state.status = 'rejected';
            state.error = errorObj;
          })

          .addCase(fullTranslate.pending, (state) => {
            state.status = 'loading';
            state.error = { statusCode: 0, message: "", errorCode: "" };
          })
          .addCase(fullTranslate.fulfilled, (state, action) => {
            state.status = 'resolved';
            state.fullTranslateList = action.payload;
          })
          .addCase(fullTranslate.rejected, (state, action) => {
            const errorObj: any = action.payload;
            state.status = 'rejected';
            state.error = errorObj;
          })

          .addCase(getAnalogs.pending, (state) => {
            state.status = 'loading';
            state.error = { statusCode: 0, message: "", errorCode: "" };
          })
          .addCase(getAnalogs.fulfilled, (state, action) => {
            state.status = 'resolved';
            state.analogsWord = action.payload;
          })
          .addCase(getAnalogs.rejected, (state, action) => {
            const errorObj: any = action.payload;
            state.status = 'rejected';
            state.error = errorObj;
          })

          .addCase(getExamplesForWord.pending, (state) => {
            state.status = 'loading';
            state.error = { statusCode: 0, message: "", errorCode: "" };
          })
          .addCase(getExamplesForWord.fulfilled, (state, action) => {
            state.status = 'resolved';
            state.lingvoExamples = action.payload;
          })
          .addCase(getExamplesForWord.rejected, (state, action) => {
            const errorObj: any = action.payload;
            state.status = 'rejected';
            state.error = errorObj;
          })
      },
});

export const dictionaryReducer = dictionarySlice.reducer;
export const dictionaryActions = dictionarySlice.actions;