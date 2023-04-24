import axios from "axios";
import { host } from "../http/http.request.config";

export interface IQueryBuilder {
    action: string,
    params: any
}

export const queryBuilder = (path: string, params: any) => {
    let url: string = host + path;
    if (params) {
        url += '?';
    }
    //warning нужно исправить
    for (let inc in params) {
        if (Array.isArray(params[inc])) {
            params[inc].map((item: string) => {
                url += inc + '[]=' + item + "&";
                return url;
            });
        } else {
            url += inc + '=' + params[inc] + "&";
        }
    }

    return url.slice(0, -1);
}


export const thunkAxiosPost = async (path = "", params = {}, rejectWithValue: any) => {
    const url = host + path;
    let request = axios;

    try {
        const response = await request.post(url, params);
        if (!response || !response.data) {
            throw new Error('error');
        }

        return response.data;

    } catch (error: any) {
        return rejectWithValue(error);
    }
}

export const thunkAxiosGet = async (path = "", params = {}, rejectWithValue: any) => {
    const url = queryBuilder(path, params);
    let request = axios;
 
    try {
        const response = await request.get(url);
        if (!response || !response.data) {
            throw new Error('error');
        }

        return response.data;

    } catch (error: any) {
        return rejectWithValue(error.response.data);
    }
}