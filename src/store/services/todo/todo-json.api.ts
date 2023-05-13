import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../api/authBaseQuery";

export const todoJsonApi = createApi({
    reducerPath: 'todoJsonApi',
    baseQuery: authBaseQuery,
    endpoints: (build) => ({
        addItems: build.mutation({
            query: (body) => ({
                url: '/todo-items-json/addItems',
                method: 'POST',
                body
            }),
        }),
        addTodoSections: build.mutation({
            query: (body) => ({
                url: '/todo-items-json/addTodoSections',
                method: 'POST',
                body
            }),
        }),
        addSections: build.mutation({
            query: (body) => ({
                url: '/todo-items-json/addSections',
                method: 'POST',
                body
            }),
        }),
    })
});