import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../../store/services/api/authBaseQuery";

export const dictionaryApi = createApi({
    reducerPath: 'dictionaryApi',
    baseQuery: authBaseQuery,
    endpoints: (build) => ({
        add: build.mutation({
            query: (body: ICreateDictionary) => ({
                url: '/dictionary/create',
                method: 'POST',
                body
            }),
        }),
        createExampleAndTranslate: build.mutation({
            query: (body: ICreateDictionaryExample) => ({
                url: '/dictionary-examples/create-example-and-translate',
                method: 'POST',
                body
            }),
        }),
        createLinkedWord: build.mutation({
            query: (body: ICreateLinkedWord) => ({
                url: '/dictionary-linked-words/create',
                method: 'POST',
                body
            }),
        }),
        updateSudyStage: build.mutation({
            query: (body: IUpdateStudyStage) => ({
                url: '/dictionary/update-study-stage',
                method: 'POST',
                body
            }),
        }),
        updateNotes: build.mutation({
            query: (body: IUpdateNotes) => ({
                url: '/dictionary/update-notes',
                method: 'POST',
                body
            }),
        }),
        updateWord: build.mutation({
            query: (body: IUpdateWord) => ({
                url: '/dictionary/update-word',
                method: 'POST',
                body
            }),
        }),
        remove: build.mutation({
            query:(body) => ({
                url: '/dictionary/remove',
                method: 'POST',
                body
            }),
        })
    })
});