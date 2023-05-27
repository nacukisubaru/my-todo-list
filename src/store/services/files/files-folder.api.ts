import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../api/authBaseQuery";

export const filesFolderApi = createApi({
    reducerPath: 'filesFolderApi',
    baseQuery: authBaseQuery,
    tagTypes: ['Folders'],
    endpoints: (build) => ({
        getFoldersByUser: build.query({
            query: () => ({
                url: '/files-folders/get-list-by-user/'
            }),
            providesTags: (result: any) =>
            result
                ? [
                    ...result.map((value: any) => ({ type: 'Folders', id: value.id })),
                    { type: 'Folders', id: 'LIST' },
                ]
                : [{ type: 'Folders', id: 'LIST' }],
        }),
        createFolder: build.mutation({
            query: (body) => ({
                url: '/files-folders/create',
                method: 'POST',
                body
            }),
            invalidatesTags: [{type: 'Folders', id: 'LIST'}]
        }),
    })
});