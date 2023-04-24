import { configureStore } from "@reduxjs/toolkit";
import { todosReducer } from "./services/todo/todo.slice";

export const makeStore = () => configureStore({
    reducer: {
        todosReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}).concat(
    ),
});


export const store = makeStore();
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;