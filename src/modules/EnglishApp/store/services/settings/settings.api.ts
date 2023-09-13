import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../../store/services/api/authBaseQuery";

export const settingsApi = createApi({
    reducerPath: 'settingsApi',
    baseQuery: authBaseQuery,
    endpoints: (build) => ({
        addLanguageSettings: build.mutation({
            query: (body: IAddDictionarySettings) => ({
                url: '/dictionary-settings/create-settings',
                method: 'POST',
                body
            }),
        }),
        setActiveLanguageSetting: build.mutation({
            query: (body: {id: string}) => ({
                url: '/dictionary-settings/set-active-setting',
                method: 'POST',
                body
            }),
        }),
    })
});