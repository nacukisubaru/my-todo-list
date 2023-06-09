import { configureStore } from "@reduxjs/toolkit";
import { dictionaryApi } from "./services/dictionary/dictionary.api";
import { dictionaryReducer } from "./services/dictionary/dictionary.slice";

const arrayMiddlewares: any[] = [
    dictionaryApi.middleware
];

export const makeStore = () => configureStore({
    reducer: {
        dictionaryReducer
    },

    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(arrayMiddlewares),
});


export const store = makeStore();
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;