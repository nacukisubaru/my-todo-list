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
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import "./css/style.css";
import YoutubeVideoReader from "./YoutubeVideoReader";
import { useActions } from "../../hooks/useAction";
import { useFilterBooks } from "../../hooks/useFilterBooks";

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
    const [timecode, setTimecode] = useState("");
    const [isChangePageDisabled, setChangePageDisabled] = useState(false);

    const [updBookmarker] = bookReaderApi.useUpdateBookmarkerMutation();
    const [updRead] = bookReaderApi.useUpdateReadMutation();

    const [isMount, setMount] = useState(false);
    const [isInitBookData, setInitBookData] = useState(false);
    const { setCanUpdateBookPage } = useActions();

    const { filtrate } = useFilterBooks();

    const { data, refetch } = bookReaderApi.useGetBookQuery({
        id: id ? +id : 0,
        page: currentPage,
        limitOnPage: searchParams.get("getVideo") ? 10 : 500,
        getVideo: searchParams.get("getVideo") ? true : false,
        timecode,
    });

    useEffect(() => {
        let page: number | string | null = searchParams.get("page");
        if (page) {
            page = parseInt(page);
            if (
                (data && data.countPages && page <= data.countPages) ||
                !isMount
            ) {
                if (page > 0) {
                    setPage(page);
                }
            } else {
                setPage(1);
            }
        }
        setMount(true);
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

    const changePage = (page: number, action: string = "default") => {
        let curPage = page;
        switch (action) {
            case "next":
                curPage++;
                setCanUpdateBookPage({ update: true });
                break;
            case "prev":
                curPage--;
                setCanUpdateBookPage({ update: true });
                break;
        }
        setTimecode("");
        searchParams.set("page", new String(curPage).toString());
        setSearchParams(searchParams);
    };

    const setNextPage = () => {
        removeHiglights();
        changePage(currentPage, "next");
    };

    const setPrevPage = () => {
        removeHiglights();
        changePage(currentPage, "prev");
    };

    const openPages = () => {
        setOpenPages(true);
    };

    const closePages = () => {
        setOpenPages(false);
    };

    const switchPage = async (page: number) => {
        if (!isChangePageDisabled) {
            changePage(page);
            removeHiglights();
            updateBookData();
        }
    };

    const updateBookMarker = () => {
        if (id) {
            updBookmarker({ id: +id, bookmarker: currentPage });
            setBookMarkerOnPage(true);
        }
    };

    const updateRead = (isRead: boolean) => {
        if (id) {
            updRead({ id: +id, isRead });
            console.log({ isRead });
            setRead(isRead);
        }
    };

    useEffect(() => {
        updateBookData();
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
                sourceLang:
                    data && data.book.langOriginal
                        ? data.book.langOriginal
                        : "en",
                targetLang:
                    data && data.book.langTranslation
                        ? data.book.langTranslation
                        : "ru",
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

    const updateBookData = async () => {
        await setChangePageDisabled(true);
        await refetch();
        await setChangePageDisabled(false);
    }

    const changePageByTimecode = async (timecode: string) => {
        await setTimecode(timecode);
        updateBookData();
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
            if (data) {
                setRead(data.book.isRead);
                if (isInitBookData) {
                    changePage(data.page);
                }
            }
            setInitBookData(true);
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

                        {(data &&
                            data.book.bookmarker &&
                            data.book.bookmarker == currentPage) ||
                        isSetBookMarkerOnPage ? (
                            <div className="cursor-pointer">
                                <BookmarkIcon />
                            </div>
                        ) : (
                            <div
                                className="cursor-pointer"
                                onClick={updateBookMarker}
                            >
                                <BookmarkBorderIcon />
                            </div>
                        )}

                        {isRead ? (
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    updateRead(false);
                                }}
                            >
                                <StarIcon />
                            </div>
                        ) : (
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    updateRead(true);
                                }}
                            >
                                <StarBorderIcon />
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
                <Main open={open}>
                    <DrawerHeader />
                    <div
                        className="mb-[15px] cursor-pointer"
                        onClick={async () => {
                            await filtrate(1, false);
                            navigate("/englishApp/books");
                        }}
                    >
                        <KeyboardReturnIcon />
                    </div>

                    <div className="w-[82%]">
                        {data && data.book.videoUrl && data.timecodes && (
                            <YoutubeVideoReader
                                videoId={data.book.videoUrl}
                                width={drawerWidth ? -drawerWidth : 0}
                                timecodes={data.timecodes}
                                onProgressVideo={setNextPage}
                                onSeek={changePageByTimecode}        
                                timecodesByString={data.timecodesByString}
                            />
                        )}
                    </div>

                    <div className="w-[82%] flex justify-center h-[170px] overflow-auto lg:h-[370px]">
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
                    lang={
                        data && data.book.langOriginal
                            ? data.book.langOriginal
                            : "en"
                    }
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
                    lang={
                        data && data.book.langOriginal
                            ? data.book.langOriginal
                            : "en"
                    }
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
