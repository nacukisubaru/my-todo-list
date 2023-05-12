import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { host } from "../../../http/http.request.config";

const baseQuery = fetchBaseQuery({ baseUrl: host })

const authBaseQuery: BaseQueryFn<
    FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        args.headers = {
            'Authorization': `Bearer ${token}`
        };
    }

    let result = await baseQuery(args, api, extraOptions);
    return result;
}

export default authBaseQuery;