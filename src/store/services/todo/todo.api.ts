import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { host } from "../../../http/http.request.config";

export const todoApi = createApi({
    reducerPath: 'todoApi',
    baseQuery: fetchBaseQuery({baseUrl: host + '/todo-list/'}),
    endpoints: (build) => ({
        add: build.mutation({
            query: (body) => ({
                url: 'create',
                method: 'POST',
                body
            }),
        }),
        update: build.mutation({
            query: (body) => ({
                url: 'update',
                method: 'POST',
                body
            }),
        }),
        remove: build.mutation({
            query:(body) => ({
                url: 'remove',
                method: 'POST',
                body
            }),
        }),
        updateSort: build.mutation({
            query: (body) => ({
                url: 'updateSort',
                method: 'POST',
                body
            }),
        }),
    })
});