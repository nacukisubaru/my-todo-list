import useLocalStorageState from "use-local-storage-state";
import { useActions } from "./useAction";
import { useAppDispatch, useAppSelector } from "./useAppSelector";
import { getBooksList } from "../store/services/book-reader/book-reader.slice";

export const useFilterBooks = () => {
    const {booksFilter, books, pages} = useAppSelector(state => state.bookReaderReducer);
    const { resetBooks, setBooksFilter } = useActions();
    const dispatch = useAppDispatch();
    const [_filterStorage, setFilterToStorage] = useLocalStorageState('books-filter', {
        defaultValue: [booksFilter]
    })

    const filtrate = async (page: number = 1, resetState: boolean = true) => {
        const filter: IBooksFilter = booksFilter;
        //let searchByName: string = '';

        setFilterToStorage([filter]);

        // if (filter.searchByName) {
        //     searchByName = filter.searchByName;
        // }

        if (filter.videoOnly) {}

        if (resetState) {
            await resetBooks();
        }

        return dispatch(getBooksList({
            ...filter,
            page,
            limitPage: 12
        }));
    }

    

    // const selectOriginalLang = (langs: ILanguage[]) => {
    //     setBooksFilter({ ...booksFilter, languageOriginal: langs });
    // };

    // const selectTranslationLang = (langs: ILanguage[]) => {
    //     setBooksFilter({ ...booksFilter, languageTranslation: langs });
    // };

    

    return { filtrate, setBooksFilter, booksFilter, books, pages };
}