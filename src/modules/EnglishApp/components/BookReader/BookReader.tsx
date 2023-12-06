import { FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";;
import Typography from "@mui/material/Typography";
import BookDrawer from "./BookDrawer";
import { bookReaderApi } from "../../store/services/book-reader/book-reader.api";
import HTMLReactParser from "html-react-parser";
import { fullTranslate } from "../../store/services/dictionary/dictionary.slice";
import { useAppDispatch } from "../../hooks/useAppSelector";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BookPages from "./BookPages";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import "./css/style.css";
import YoutubeVideoReader from "./YoutubeVideoReader";
import { useActions } from "../../hooks/useAction";
import { useFilterBooks } from "../../hooks/useFilterBooks";
import { setTitle } from "../../../../helpers/domHelper";
import { CircularProgress, IconButton } from "@mui/material";
import { AppBar } from "@mui/material";
import BookToolBar from "./BookToolBar";

const drawerWidth = 320;

const BookReader: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [open, setOpen] = useState(false);
    const { id } = useParams();
    const [currentPage, setPage] = useState<any>(searchParams.get("page") ? searchParams.get("page") : 1);
    const [currentBookmarker, setCurrentBookmarker] = useState(searchParams.get("bookmarker") ? searchParams.get("bookmarker") : 0);
    const [currentWord, setCurrentWord] = useState("");
    const [isOpenPages, setOpenPages] = useState(false);
   
    const [isExecuteYandexTranslate, setYandexTranslateExecute] =
        useState(false);
    const navigate = useNavigate();
    const [isRead, setRead] = useState(false);
    const [timecode, setTimecode] = useState("");

    const [updBookmarker] = bookReaderApi.useUpdateBookmarkerMutation();
    const [updRead] = bookReaderApi.useUpdateReadMutation();

    const [isMount, setMount] = useState(false);
    const { setSwitchBackBookPage, resetFullTranslateList } = useActions();
    const [isSkip, setSkip] = useState(false);
    const [canSeekVideoByTimecodes, setCanSeekVideoByTimecodes] = useState(false);

    const { filtrate } = useFilterBooks();

    const { data, isFetching, refetch } = bookReaderApi.useGetBookQuery({
        id: id ? +id : 0,
        page: currentPage,
        limitOnPage: searchParams.get("getVideo") ? 100 : 700,
        getVideo: searchParams.get("getVideo") ? true : false,
        timecode,
    }, {skip: isSkip});

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
            break;
            case "prev":
                curPage--;
            break;
        }
      
        setTimecode("");
        searchParams.set("page", new String(curPage).toString());
        setSearchParams(searchParams);
    };

    const setNextPage = () => {
        removeHiglights();
        changePage(currentPage, "next");
        setCanSeekVideoByTimecodes(true);
    };

    const setPrevPage = () => {
        setSwitchBackBookPage({ isBack: true });
        removeHiglights();
        changePage(currentPage, "prev");
        setCanSeekVideoByTimecodes(true);
    };

    const openPages = () => {
        setOpenPages(true);
    };

    const closePages = () => {
        setOpenPages(false);
    };

    const switchPage = async (page: number) => {
        changePage(page);
        removeHiglights();
    };

    const updateBookMarker = () => {
        if (id) {
            updBookmarker({ id: +id, bookmarker: currentPage });
            setCurrentBookmarker(currentPage);
        }
    };

    const updateRead = (isRead: boolean) => {
        if (id) {
            updRead({ id: +id, isRead });
            console.log({ isRead });
            setRead(isRead);
        }
    };

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

    const changePageByTimecode = async (timecode: string) => {
        await setSkip(true);
        await setTimecode(timecode);
        await setSkip(false);
        const fetchedData = await refetch();
        if (fetchedData.data) {
            changePage(fetchedData.data.page);
        }
        setCanSeekVideoByTimecodes(false);
    };

    const progressVideo = (action: string) => {
        if (action === "next") {
            setNextPage();
        } else {
            setPrevPage();
        }
    }

    const nav = async () => {
        await filtrate(1, false);
        resetFullTranslateList();
        setOpen(false);
        navigate("/englishApp/books");
    }

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
            if (!currentBookmarker) {
                setCurrentBookmarker(data.book.bookmarker);
            }
            if (data) {
                setRead(data.book.isRead);
            }
        }
    }, [data, isFetching]);

    return (
        <>
            {data && !data.book.isVideo && (
                <BookPages
                    currentPage={currentPage}
                    countPages={data.countPages}
                    isOpen={isOpenPages}
                    close={closePages}
                    onClick={switchPage}
                />
            )}

            <AppBar position="fixed">
                <BookToolBar 
                    setPrevPage={setPrevPage} 
                    openPages={openPages}
                    setNextPage={setNextPage} 
                    updateRead={updateRead} 
                    updateBookMarker={updateBookMarker} 
                    currentPage={currentPage} 
                    isRead={isRead}
                    bookmarker={currentBookmarker}
                />
                
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
                                canSeekVideoByTimecodes={canSeekVideoByTimecodes}
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
