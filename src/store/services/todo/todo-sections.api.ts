import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../api/authBaseQuery";

export const todoSectionsApi = createApi({
    reducerPath: 'todoSectionsApi',
    baseQuery: authBaseQuery,
    endpoints: (build) => ({
        add: build.mutation({
            query: (body) => ({
                url: '/sections-todo-list/create',
                method: 'POST',
                body
            }),
        }),
        update: build.mutation({
            query: (body) => ({
                url: '/sections-todo-list/update',
                method: 'POST',
                body
            }),
        }),
        remove: build.mutation({
            query:(body) => ({
                url: '/sections-todo-list/remove',
                method: 'POST',
                body
            }),
        }),
        updateSort: build.mutation({
            query: (body) => ({
                url: '/sections-todo-list/updateSort',
                method: 'POST',
                body
            }),
        }),
    })
});