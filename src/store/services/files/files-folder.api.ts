import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../api/authBaseQuery";

export const filesFolderApi = createApi({
    reducerPath: 'filesFolderApi',
    baseQuery: authBaseQuery,
    endpoints: (build) => ({
        getFoldersByUser: build.query({
            query: () => ({
                url: '/files-folders/get-list-by-user/'
            }),
        }),
    })
});