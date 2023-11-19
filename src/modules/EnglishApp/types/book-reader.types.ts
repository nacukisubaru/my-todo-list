interface IBook {
    text: string,
    page: number,
    countPages: number
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
}

interface IBooksFilter {
    searchByName: string,
    videoOnly: boolean,
    booksOnly: boolean,
    readOnly: boolean,
    page: number,
}