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