import useLocalStorageState from "use-local-storage-state";
import { useActions } from "./useAction";
import { useAppDispatch, useAppSelector } from "./useAppSelector";
import { getBooksList } from "../store/services/book-reader/book-reader.slice";

export const useFilterBooks = () => {
    const {booksFilter, books, pages} = useAppSelector(state => state.bookReaderReducer);
    const { resetBooks, setBooksFilter } = useActions();
    const dispatch = useAppDispatch();
    const [filterStorage, setFilterToStorage] = useLocalStorageState<any>('books-filter', {
        defaultValue: [booksFilter]
    })

    const filtrate = async (page: number = 1, resetState: boolean = true) => {
        const filter: IBooksFilter = booksFilter;
        setFilterToStorage(filter);

        if (resetState) {
            await resetBooks();
        }

        return dispatch(getBooksList({
            ...filter,
            page,
            limitPage: 12
        }));
    }

    return { filtrate, setFilterToStorage, setBooksFilter, booksFilter, books, pages, filterStorage };
}