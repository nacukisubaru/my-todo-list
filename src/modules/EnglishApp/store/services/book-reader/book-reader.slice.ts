import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { thunkAxiosGet } from "../../../../../helpers/queryHelper";

interface IState {
    books: IBookList[],
    booksFilter: IBooksFilter,
    canUpdateBookPage: boolean,
    switchBackBookPage: boolean
    page: number,
    status: string,
    error: IError,
    pages: number
}

const initialState: IState = {
    books: [],
    booksFilter: {
        searchByName: "",
        videoOnly: false,
        booksOnly: false,
        readOnly: false,
        page: 0,
        langOriginal: "en"
    },
    canUpdateBookPage: false,
    switchBackBookPage: false,
    page: 0,
    pages: 0,
    status: "",
    error: { statusCode: 0, message: "", errorCode: "" }
}

export const getBooksList = createAsyncThunk(
    'get-books-list/fetch',
    async (params: IBookListParams, { rejectWithValue }) => {
        return thunkAxiosGet('/book-reader/get-list-by-user/', params, rejectWithValue);
    }
);

export const bookReaderSlice = createSlice({
    name: 'bookReader',
    initialState,
    reducers: {
        setBooksFilter: (state, action: PayloadAction<IBooksFilter>) => {
            state.booksFilter = action.payload;
        },
        resetBooks: (state) => {
            state.books = [];
        },
        setCanUpdateBookPage: (state, action: PayloadAction<{update: boolean}>) => {
            state.canUpdateBookPage = action.payload.update;
        },
        setSwitchBackBookPage: (state, action: PayloadAction<{isBack: boolean}>) => {
            state.switchBackBookPage = action.payload.isBack;
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getBooksList.pending, (state) => {
            state.status = 'loading';
            state.error = { statusCode: 0, message: "", errorCode: "" };
          })
          .addCase(getBooksList.fulfilled, (state, action) => {
            state.status = 'resolved';
            state.books = action.payload.rows;
            state.page = action.payload.nextPage;
            state.pages = action.payload.pages;
          })
          .addCase(getBooksList.rejected, (state, action) => {
            const errorObj: any = action.payload;
            state.status = 'rejected';
            state.error = errorObj;
          })
    }
});

export const bookReaderReducer = bookReaderSlice.reducer;
export const bookReaderActions = bookReaderSlice.actions;