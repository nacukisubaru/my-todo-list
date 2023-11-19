import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../../store/services/api/authBaseQuery";

export const bookReaderApi = createApi({
    reducerPath: 'bookReaderApi',
    baseQuery: authBaseQuery,
    endpoints: (build) => ({
        getBook: build.query<IBook, IBookParams>({
            query: (params:IBookParams) => ({
                url: '/book-reader/get-book',
                params
            })
        }),
        updateBookmarker: build.mutation({
            query: (body: IUpdateBookmarkerParams) => ({
                url: '/book-reader/update-bookmarker',
                method: 'POST',
                body
            }),
        }),
        updateRead: build.mutation({
            query: (body: IUpdateReadParams) => ({
                url: '/book-reader/update-read',
                method: 'POST',
                body
            }),
        }),
    })
});