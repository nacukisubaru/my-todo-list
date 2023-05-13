import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../api/authBaseQuery";

export const sectionsApi = createApi({
    reducerPath: 'sectionsApi',
    baseQuery: authBaseQuery,
    endpoints: (build) => ({
        add: build.mutation({
            query: (body) => ({
                url: '/sections-list/create',
                method: 'POST',
                body
            }),
        }),
        update: build.mutation({
            query: (body) => ({
                url: '/sections-list/update',
                method: 'POST',
                body
            }),
        }),
        remove: build.mutation({
            query:(body) => ({
                url: '/sections-list/remove',
                method: 'POST',
                body
            }),
        }),
        updateSort: build.mutation({
            query: (body) => ({
                url: '/sections-list/updateSort',
                method: 'POST',
                body
            }),
        }),
    })
});