import { FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
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
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import "./css/style.css";
import YoutubeVideoReader from "./YoutubeVideoReader";
import { useActions } from "../../hooks/useAction";
import { useFilterBooks } from "../../hooks/useFilterBooks";
import { setTitle } from "../../../../helpers/domHelper";
import { CircularProgress, IconButton } from "@mui/material";
import { AppBar } from "@mui/material";

const drawerWidth = 320;

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
    const { setCanUpdateBookPage, setSwitchBackBookPage } = useActions();

    const { filtrate } = useFilterBooks();

    const { data, isFetching, refetch } = bookReaderApi.useGetBookQuery({
        id: id ? +id : 0,
        page: currentPage,
        limitOnPage: searchParams.get("getVideo") ? 100 : 700,
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
                setSwitchBackBookPage({ isBack: false });
                break;
            case "prev":
                curPage--;
                break;
        }
        setCanUpdateBookPage({ update: true });
        setTimecode("");
        searchParams.set("page", new String(curPage).toString());
        setSearchParams(searchParams);
    };

    const setNextPage = () => {
        removeHiglights();
        changePage(currentPage, "next");
    };

    const setPrevPage = () => {
        setSwitchBackBookPage({ isBack: true });
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
            setSwitchBackBookPage({ isBack: false });
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
        setSwitchBackBookPage({ isBack: false });
    }

    const changePageByTimecode = async (timecode: string) => {
        await setTimecode(timecode);
        updateBookData();
    };

    useEffect(() => {
        if (data && !isFetching) {
            setTitle(data.book.name);
            const classes = document.getElementsByClassName("translateMyWord");
            for (let inc = 0; inc < classes.length; inc++) {
                classes[inc].classList.remove("highlight");
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
                    const func = function () {
                        translateAndHighlight(classes[inc].id);
                    };

                    element.onclick = func;
                    element.ontouchstart = func;
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
    }, [data, isFetching]);

    const progressVideo = (action: string) => {
        if (action === "next") {
            setNextPage();
        } else {
            setPrevPage();
        }
    }

    const nav = async () => {
        await filtrate(1, false);
        navigate("/englishApp/books");
    }

    return (
        <>
            {data && (
                <BookPages
                    currentPage={currentPage}
                    countPages={data.countPages}
                    isOpen={isOpenPages}
                    close={closePages}
                    onClick={switchPage}
                />
            )}

            <AppBar position="fixed">
                <Toolbar>
                    <div className="lg:block hidden">
                        <IconButton
                            onClick={setPrevPage}
                            sx={{ color: "white" }}
                        >
                            <ArrowBackIosNewIcon />
                        </IconButton>
                    </div>

                    <div className="lg:hidden block">
                        <IconButton
                            onTouchStart={setPrevPage}
                            sx={{ color: "white" }}
                        >
                            <ArrowBackIosNewIcon />
                        </IconButton>
                    </div>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        onClick={openPages}
                        onTouchStart={openPages}
                        className="cursor-pointer"
                    >
                        {currentPage}
                    </Typography>
                    <div className="lg:block hidden"> 
                        <IconButton
                            onClick={setNextPage}
                            sx={{ color: "white" }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </div>

                    <div className="lg:hidden block"> 
                        <IconButton
                            onTouchStart={setNextPage}
                            sx={{ color: "white" }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
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
                            onTouchStart={updateBookMarker}
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
                            onTouchStart={() => {
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
                            onTouchStart={() => {
                                updateRead(true);
                            }}
                        >
                            <StarBorderIcon />
                        </div>
                    )}
                </Toolbar>
                
            </AppBar>
            <div className="flex justify-center pt-[75px]">
                <Box sx={{ width: "100%", paddingLeft: "50px", paddingRight: "50px" }}>
                    <IconButton
                        onClick={nav}
                        onTouchStart={nav}
                        sx={{
                            marginBottom: "15px",
                        }}
                    >
                        <KeyboardReturnIcon />
                    </IconButton>

                    <div className="lg:w-[82%]">
                        {data && data.book.videoUrl && data.timecodes && (
                            <YoutubeVideoReader
                                videoId={data.book.videoUrl}
                                width={drawerWidth ? -drawerWidth : 0}
                                timecodes={data.timecodes}
                                onProgressVideo={progressVideo}
                                onSeek={changePageByTimecode}
                                timecodesByString={data.timecodesByString}
                            />
                        )}
                    </div>

                    {data && !isFetching ? (
                        <div
                            id="scroll-box"
                            className={`lg:w-[82%] flex justify-center 
                                ${
                                    data?.book.isVideo &&
                                    "h-[220px] overflow-auto lg:h-[265px]"
                                }`}
                        >
                            <Typography paragraph>
                                {HTMLReactParser(data.text)}
                            </Typography>
                        </div>
                    ) : (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <CircularProgress />
                        </Box>
                    )}
                </Box>

                <BookDrawer
                    isOpen={open}
                    word={currentWord}
                    height={data?.book.isVideo ? 900 : 1000}
                    close={handleDrawerClose}
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
            </div>
        </>
    );
};

export default BookReader;
