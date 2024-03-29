import { FC, useEffect, useState } from "react";
import { useFilterBooks } from "../../hooks/useFilterBooks";
import {
    AppBar,
    Box,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    Toolbar,
} from "@mui/material";
import PaginationButtons from "../../../../ui/Pagination/PaginationButtons";
import BooksFilter from "../Filter/BooksFilter";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchInput from "../../../../ui/Inputs/SearchInput";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import AddBook from "./AddBook";
import { queryBuilder } from "../../../../helpers/queryHelper";
import { setTitle } from "../../../../helpers/domHelper";
import DeleteIcon from '@mui/icons-material/Delete';
import { bookReaderApi } from "../../store/services/book-reader/book-reader.api";
import ConfirmModal from "../../../../ui/Modal/ConfirmModal";

const BookList: FC = () => {
    const { filtrate, books, pages, booksFilter, setBooksFilter, filterStorage } =
        useFilterBooks();
    const [isOpenFilter, openFilter] = useState(false);
    const navigate = useNavigate();
    const [isInitFilter, setInitFilter] = useState(false);
    const [isOpenAddBook, setOpenAddBook] = useState(false);
    const [remove] = bookReaderApi.useRemoveBookMutation();
    const [currentPage, setCurrentPage] = useState(1);
    const [bookToRemove, setToRemove] = useState(0);
    const [isOpenConfirm, setOpenConfirm] = useState(false);

    useEffect(() => {
        setTitle('Книги список');
        setBooksFilter(filterStorage);
    }, []);

    useEffect(() => {
        if (!isInitFilter) {
            filtrate(1, false);
            setInitFilter(true);
        }
    }, [booksFilter]);


    const changePage = (page: number) => {
        filtrate(page, false);
        setCurrentPage(page);
    };

    const closeFilter = () => {
        openFilter(false);
    };

    const closeAddBook = () => {
        setOpenAddBook(false);
    }

    const redirectByLink = (book: IBookList) => {
        let link = `/englishApp/books/${book.id}`;
       
        const arrayParams: any = {};
        if (book.bookmarker) {
            arrayParams.page = book.bookmarker;
            arrayParams.bookmarker = book.bookmarker;
        }
        if (book.isVideo) {
            arrayParams.getVideo = true;
        }

        return navigate(queryBuilder(link, arrayParams, true));    
    }

    const removeBook = async () => {
        if (bookToRemove) {
            await remove({id: bookToRemove});
            filtrate(currentPage, false);
            setOpenConfirm(false);
        }
    }

    const setBookToRemove = (bookId: number) => {
        setToRemove(bookId)
    }

    const closeConfirm = () => {
        setOpenConfirm(false);
    }

    return (
        <>
            <div className="flex justify-center mt-[25px]">
                <ConfirmModal text={"Удалить книгу?"} primaryBtnClick={removeBook} secondaryBtnClick={closeConfirm} isVisible={isOpenConfirm} />
                <BooksFilter isVisible={isOpenFilter} close={closeFilter} />
                <AddBook isOpen={isOpenAddBook} close={closeAddBook}/>
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 700,
                        bgcolor: "background.paper",
                        boxShadow: 2,
                        height: "800px",
                    }}
                >
                    <AppBar
                        className="py-[10px]"
                        position="static"
                    >
                        <Toolbar>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <PaginationButtons
                                        count={pages}
                                        colorNumbers="white"
                                        onClick={changePage}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <div className="flex">
                                        <div className="mt-[-6px]">
                                            <SearchInput
                                                onChange={(val) => {
                                                    setBooksFilter({
                                                        ...booksFilter,
                                                        searchByName: val,
                                                    });
                                                }}
                                                search={() => {
                                                    filtrate(1, false);
                                                }}
                                                value={booksFilter.searchByName ? booksFilter.searchByName : ''}
                                            />
                                        </div>
                                        <div
                                            className="text-white cursor-pointer mt-[7px] ml-[14px]"
                                            onClick={() => {
                                                openFilter(true);
                                            }}
                                        >
                                            <FilterAltIcon />
                                        </div>
                                        <div
                                            className="text-white cursor-pointer mt-[7px] ml-[14px]"
                                            onClick={() => {
                                                setOpenAddBook(true)
                                            }}
                                        >
                                            <AddIcon />
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                    <List className="h-[85%] overflow-auto">
                            {books.map((book) => {
                                return (
                                    <ListItem>
                                        <ListItemButton
                                            component="a"
                                            onClick={() => {
                                                redirectByLink(book);
                                            }}
                                        >
                                            {book.name}
                                        </ListItemButton>
                                        <IconButton onClick={() => {
                                            setBookToRemove(book.id);
                                            setOpenConfirm(true);
                                        }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                );
                            })}
                        
                    </List>
                </Box>
            </div>
        </>
    );
};

export default BookList;

