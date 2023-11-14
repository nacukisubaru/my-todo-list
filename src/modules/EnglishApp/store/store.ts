import { configureStore } from "@reduxjs/toolkit";
import { dictionaryApi } from "./services/dictionary/dictionary.api";
import { dictionaryReducer } from "./services/dictionary/dictionary.slice";
import { settingsReducer } from "./services/settings/settings.slice";
import { settingsApi } from "./services/settings/settings.api";
import { bookReaderApi } from "./services/book-reader/book-reader.api";

const arrayMiddlewares: any[] = [
    dictionaryApi.middleware,
    settingsApi.middleware,
    bookReaderApi.middleware
];

export const makeStore = () => configureStore({
    reducer: {
        dictionaryReducer,
        settingsReducer,
        [bookReaderApi.reducerPath]: bookReaderApi.reducer,
    },

    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(arrayMiddlewares),
});


export const store = makeStore();
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;