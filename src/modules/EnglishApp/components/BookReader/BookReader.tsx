import { FC, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import BookDrawer from "./BookDrawer";
import { bookReaderApi } from "../../store/services/book-reader/book-reader.api";
import HTMLReactParser from "html-react-parser";
import { fullTranslate } from "../../store/services/dictionary/dictionary.slice";
import { useAppDispatch } from "../../hooks/useAppSelector";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import BookPages from "./BookPages";
import { AppBar } from "../../../../ui/AppBar/AppBar";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import "./style.css";

const drawerWidth = 320;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
}>(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginRight: -drawerWidth,
    position: "relative",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
}));

const BookReader: FC = () => {
    const [open, setOpen] = useState(false);
    const { id } = useParams();
    const [currentPage, setPage] = useState(1);
    const [currentWord, setCurrentWord] = useState("");
    const [isOpenPages, setOpenPages] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isExecuteYandexTranslate, setYandexTranslateExecute] =
        useState(false);
    const navigate = useNavigate();
    const [isSetBookMarkerOnPage, setBookMarkerOnPage] = useState(false);
    const [isRead, setRead] = useState(false);
  
    const [updBookmarker] = bookReaderApi.useUpdateBookmarkerMutation();
    const [updRead] = bookReaderApi.useUpdateReadMutation();
    const { data, refetch } = bookReaderApi.useGetBookQuery({
        id: id ? +id : 0,
        page: currentPage,
        limitOnPage: 500,
    });

    useEffect(() => {
        const page = searchParams.get("page");

        if (page) {
            setPage(+page);
        }
    }, [searchParams]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
   
    const removeHiglights = () => {
        const classes = document.getElementsByClassName("translateMyWord");
        for (let inc = 0; inc < classes.length; inc++) {
            classes[inc].classList.remove("highlight");
        }
    };

    const setNextPage = () => {
        removeHiglights();
        setSearchParams({ page: new String(currentPage + 1).toString() });
    };

    const setPrevPage = () => {
        removeHiglights();
        setSearchParams({ page: new String(currentPage - 1).toString() });
    };

    const openPages = () => {
        setOpenPages(true);
    };

    const closePages = () => {
        setOpenPages(false);
    };

    const switchPage = async (page: number) => {
        setSearchParams({ page: new String(page).toString() });
        removeHiglights();
        refetch();
    };

    const updateBookMarker = () => {
        if (id) {
            updBookmarker({id: +id, bookmarker: currentPage});
            setBookMarkerOnPage(true);
        }
    }

    const updateRead = (isRead: boolean) => {
        if (id) {
            updRead({id: +id, isRead});
            console.log({isRead})
            setRead(isRead);
        }
    }

    useEffect(() => {
        refetch();
    }, [currentPage]);

    const dispatch = useAppDispatch();

    const translateWord = (
        word: string,
        getYandexTranslate: boolean = false
    ) => {
        setCurrentWord(word);
        handleDrawerOpen();
        dispatch(
            fullTranslate({
                word,
                sourceLang: data && data.book.langOriginal ? data.book.langOriginal : 'en',
                targetLang: data && data.book.langTranslation ? data.book.langTranslation : 'ru',
                getTranscription: true,
                getYandexTranslate,
            })
        );
        if (getYandexTranslate) {
            setYandexTranslateExecute(true);
        } else {
            setYandexTranslateExecute(false);
        }
    };

    useEffect(() => {
        if (data) {
            const classes = document.getElementsByClassName("translateMyWord");
            for (let inc = 0; inc < classes.length; inc++) {
                function translateAndHighlight(id: string) {
                    const word = document.getElementById(id);
                    for (let inc = 0; inc < classes.length; inc++) {
                        classes[inc].classList.remove("highlight");
                    }
                    if (word) {
                        word.classList.add("highlight");
                        translateWord(word.innerText);
                    }
                }
                if (!classes[inc].hasAttribute("onclick")) {
                    const element: any = classes[inc];
                    element.onclick = function () {
                        translateAndHighlight(classes[inc].id);
                    };
                }
            }
            setBookMarkerOnPage(false);
            setRead(data?.book.isRead);
        }
    }, [data]);

    return (
        <>
            {data && (
                <BookPages
                    countPages={data.countPages}
                    isOpen={isOpenPages}
                    close={closePages}
                    onClick={switchPage}
                />
            )}

            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar position="fixed" open={open} drawerWidth={drawerWidth}>
                    <Toolbar>
                        <div className="cursor-pointer" onClick={setPrevPage}>
                            <ArrowBackIosNewIcon />
                        </div>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            onClick={openPages}
                            className="cursor-pointer"
                        >
                            {currentPage}
                        </Typography>
                        <div className="cursor-pointer" onClick={setNextPage}>
                            <ArrowForwardIosIcon />
                        </div>

                        {data?.book.bookmarker == currentPage || isSetBookMarkerOnPage ? (
                            <div className="cursor-pointer">
                                <BookmarkIcon />
                            </div>
                        ): (
                            <div className="cursor-pointer" onClick={updateBookMarker}>
                                <BookmarkBorderIcon />
                            </div>
                        )}

                        {isRead ? (
                            <div className="cursor-pointer" onClick={() => {updateRead(false)}}>
                                <StarIcon  />
                            </div>
                        ): (
                            <div className="cursor-pointer" onClick={() => {updateRead(true)}}>
                                <StarBorderIcon />
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
                <Main open={open}>
                    <DrawerHeader />
                    <div className="mb-[15px] cursor-pointer" onClick={()=>{navigate('/englishApp/books')}}>
                        <KeyboardReturnIcon />
                    </div>

                    <div className="w-[82%] flex justify-center">
                        <Typography paragraph>
                            {data && HTMLReactParser(data.text)}
                        </Typography>
                    </div>
                </Main>
               
                <BookDrawer
                    isOpen={true}
                    className="ml-[200px] hidden lg:block"
                    word={currentWord}
                    width={450}
                    lang={data && data.book.langOriginal ? data.book.langOriginal : 'en'}
                    yandexTranslate={() => {
                        translateWord(currentWord, true);
                    }}
                    setYandexData={isExecuteYandexTranslate}
                    selectTag={() => {
                        setYandexTranslateExecute(false);
                    }}
                />
        
                <BookDrawer
                    isOpen={open}
                    className="block lg:hidden"
                    word={currentWord}
                    showChevron={true}
                    close={handleDrawerClose}
                    width={drawerWidth}
                    lang={data && data.book.langOriginal ? data.book.langOriginal : 'en'}
                    yandexTranslate={() => {
                        translateWord(currentWord, true);
                    }}
                    setYandexData={isExecuteYandexTranslate}
                    selectTag={() => {
                        setYandexTranslateExecute(false);
                    }}
                />
            </Box>
        </>
    );
};

export default BookReader;
