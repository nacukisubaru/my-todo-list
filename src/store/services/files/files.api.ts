import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../api/authBaseQuery";

export const filesApi = createApi({
    reducerPath: 'filesApi',
    baseQuery: authBaseQuery,
    endpoints: (build) => ({
        getFilesByFolder: build.query({
            query: (id: number) => ({
                url: '/files/get-files-by-folder/' + id
            }),
        }),
    })
});