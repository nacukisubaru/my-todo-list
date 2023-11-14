import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../../store/services/api/authBaseQuery";
//params:IBookParams
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
    })
});