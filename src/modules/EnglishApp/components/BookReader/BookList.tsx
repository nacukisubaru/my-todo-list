import { FC, useEffect, useState } from "react";
import { useFilterBooks } from "../../hooks/useFilterBooks";
import {
    Box,
    Grid,
    List,
    ListItem,
    ListItemButton,
    Toolbar,
} from "@mui/material";
import { AppBar } from "../../../../ui/AppBar/AppBar";
import PaginationButtons from "../../../../ui/Pagination/PaginationButtons";
import BooksFilter from "../Filter/BooksFilter";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchInput from "../../../../ui/Inputs/SearchInput";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import AddBook from "./AddBook";

interface IBookList {}

const BookList: FC<IBookList> = () => {
    const { filtrate, books, pages, booksFilter, setBooksFilter, filterStorage } =
        useFilterBooks();
    const [isOpenFilter, openFilter] = useState(false);
    const navigate = useNavigate();
    const [isInitFilter, setInitFilter] = useState(false);
    const [isOpenAddBook, setOpenAddBook] = useState(false);

    useEffect(() => {
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
    };

    const closeFilter = () => {
        openFilter(false);
    };

    const closeAddBook = () => {
        setOpenAddBook(false);
    }

    return (
        <>
            <div className="flex justify-center mt-[25px]">
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
                        drawerWidth={0}
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
                    <List>
                        {books.map((book) => {
                            return (
                                <ListItem>
                                    <ListItemButton
                                        component="a"
                                        onClick={() => {
                                            navigate(
                                                `/englishApp/books/${book.id}${
                                                    book.bookmarker ?
                                                    "?page=" + book.bookmarker : ''
                                                }`
                                            );
                                        }}
                                    >
                                        {book.name}
                                    </ListItemButton>
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

