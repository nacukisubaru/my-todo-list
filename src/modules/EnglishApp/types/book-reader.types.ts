interface IBook {
    text: string,
    page: number,
    countPages: number,
    book: IBookList
}

interface IBookParams {
    id: number,
    page: number,
    limitOnPage: number
}

interface IBookListParams {
    searchByName: string,
    videoOnly: boolean,
    booksOnly: boolean,
    readOnly: boolean,
    page: number,
    limitPage: number
}

interface IBookList {
    id: number;
    name: string;
    videoUrl: string;
    bookmarker: number;
    isVideo: boolean;
    isRead: boolean;
}

interface IBooksFilter {
    searchByName: string,
    videoOnly: boolean,
    booksOnly: boolean,
    readOnly: boolean,
    page: number,
}

interface IUpdateBookmarkerParams {
    id: number,
    bookmarker: number
}

interface IUpdateReadParams {
    id: number,
    isRead: boolean
}

interface ICreateBook {
    name: string;
    videoUrl: string;
    file: any;
    isVideo: boolean;
}