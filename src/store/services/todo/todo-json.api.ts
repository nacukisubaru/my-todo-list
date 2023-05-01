import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { host } from "../../../http/http.request.config";

export const todoJsonApi = createApi({
    reducerPath: 'todoJsonApi',
    baseQuery: fetchBaseQuery({baseUrl: host + '/todo-items-json/'}),
    endpoints: (build) => ({
        addItems: build.mutation({
            query: (body) => ({
                url: 'addItems',
                method: 'POST',
                body
            }),
        }),
        addSections: build.mutation({
            query: (body) => ({
                url: 'addSections',
                method: 'POST',
                body
            }),
        }),
    })
});