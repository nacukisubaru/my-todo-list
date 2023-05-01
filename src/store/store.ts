import { configureStore } from "@reduxjs/toolkit";
import { todosReducer } from "./services/todo/todo.slice";
import { uiReducer } from "./reducers/ui.slice";
import { todoApi } from "./services/todo/todo.api";
import { todoJsonApi } from "./services/todo/todo-json.api";
import { todoSectionsApi } from "./services/todo/todo-sections.api";

export const makeStore = () => configureStore({
    reducer: {
        todosReducer,
        uiReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}).concat(
        todoApi.middleware,
        todoJsonApi.middleware,
        todoSectionsApi.middleware
    ),
});


export const store = makeStore();
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;