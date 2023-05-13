import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../api/authBaseQuery";

export const todoApi = createApi({
    reducerPath: 'todoApi',
    baseQuery: authBaseQuery,
    endpoints: (build) => ({
        add: build.mutation({
            query: (body) => ({
                url: '/todo-list/create',
                method: 'POST',
                body
            }),
        }),
        update: build.mutation({
            query: (body) => ({
                url: '/todo-list/update',
                method: 'POST',
                body
            }),
        }),
        remove: build.mutation({
            query:(body) => ({
                url: '/todo-list/remove',
                method: 'POST',
                body
            }),
        }),
        updateSort: build.mutation({
            query: (body) => ({
                url: '/todo-list/updateSort',
                method: 'POST',
                body
            }),
        }),
        updTodosPositions: build.query({
            query: () => ({
                url: '/todo-list/updTodosPositions'
            }),
        }),
    })
});