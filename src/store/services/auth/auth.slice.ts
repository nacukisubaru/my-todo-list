import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuth, ILogin, IRegistration } from "../../../types/auth.types";
import { thunkAxiosPost } from "../../../helpers/queryHelper";

const initialState: IAuth = {
    accessToken: '',
    isAuth: false,
    status: '',
    error: {message: ''}
};

export const registrate:any = createAsyncThunk(
    'registration/post',
    async(body: IRegistration, {rejectWithValue}) => {
        return thunkAxiosPost('/auth/registration', {...body}, rejectWithValue);
    }
);

export const login:any = createAsyncThunk(
    'login/post',
    async(body: ILogin, {rejectWithValue}) => {
        return thunkAxiosPost('/auth/login', {...body}, rejectWithValue);
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addUserData: (state, action: PayloadAction<IAuth>) => {
            const token = action.payload.accessToken;
            state.accessToken = token;
        },
        clearUserErrors: (state) => {
            state.error = {message: ''};
        },
        setAuth: (state, action: PayloadAction<{isAuth: boolean}>) => {
            state.isAuth = action.payload.isAuth;
        }
    },
    extraReducers: {
        [login.pending]: (state) => {
            state.status = 'loading';
        },
        [login.fulfilled]: (state, action: PayloadAction<{token: string}>) => {
            state.status = 'resolved';
            const token = action.payload.token;
            state.error =  {message: ''}
            state.accessToken = token;
            state.isAuth = true;
            localStorage.setItem("accessToken", token);
            window.location.replace('/app');
        },
        [login.rejected]: (state,action) => {
            state.status = 'rejected';
            state.error = action.payload.response.data;
            state.isAuth = false;
        },
        [registrate.pending]: (state) => {
            state.status = 'loading';
        },
        [registrate.fulfilled]: (state, action: PayloadAction<{token: string}>) => {
            state.status = 'resolved';
            state.accessToken = action.payload.token;
            state.isAuth = true;
            state.error =  {message: ''}
            localStorage.setItem("accessToken", action.payload.token);
            window.location.replace('/app');
        },
        [registrate.rejected]: (state,action) => {
            state.status = 'rejected';
            state.error = action.payload.response.data;
        },      
    }
})

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;