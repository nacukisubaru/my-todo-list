import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../api/authBaseQuery";

export const filesApi = createApi({
    reducerPath: 'filesApi',
    tagTypes: ['Files'],
    baseQuery: authBaseQuery,
    endpoints: (build) => ({
        getFilesByFolder: build.query({
            query: (id: number) => ({
                url: '/files/get-files-by-folder/' + id
            }),
            providesTags: (result: any) =>
            result
                ? [
                    ...result.map((value: any) => ({ type: 'Files', id: value.id })),
                    { type: 'Files', id: 'LIST' },
                ]
                : [{ type: 'Files', id: 'LIST' }],
        }),
        uploadFiles: build.mutation({
            query: (body) => ({
                url: '/files/create-file-in-folder',
                method: 'POST',
                body
            }),
            invalidatesTags: [{type: 'Files', id: 'LIST'}]
        }),
    })
});