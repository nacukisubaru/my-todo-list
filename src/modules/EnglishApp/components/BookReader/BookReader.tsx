import { FC, useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BookDrawer from "./BookDrawer";
import { Button } from "@mui/material";
import { bookReaderApi } from "../../store/services/book-reader/book-reader.api";
import HTMLReactParser from "html-react-parser";
import { fullTranslate } from "../../store/services/dictionary/dictionary.slice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import { useParams } from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './style.css';
import BookPages from "./BookPages";

const drawerWidth = 320;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
}>(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginRight: -drawerWidth,
    position: "relative",
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
}));

const BookReader: FC = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [isOpenPages, setOpenPages] = useState(false);
    const { id } = useParams();
    
    const { data, isLoading, refetch } = bookReaderApi.useGetBookQuery({
        id: id ? +id : 0,
        page,
        limitOnPage: 500,
    });

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const removeHiglights = () => {
        const classes = document.getElementsByClassName("translateMyWord");
        for (let inc = 0; inc < classes.length; inc++) {
            classes[inc].classList.remove('highlight');
        }
    }

    const setNextPage = () => {
        removeHiglights();
        setPage(page + 1);
    };

    const setPrevPage = () => {
        removeHiglights();
        setPage(page - 1);
    };

    const openPages = () => {
        setOpenPages(true);
    }

    const closePages = () => {
        setOpenPages(false);
    }

    const switchPage = async (page: number) => {
        await setPage(page);
        removeHiglights();
        refetch();
    }

    useEffect(() => {
        refetch();
    }, [page]);

    const dispatch = useAppDispatch();
    const { fullTranslateList } = useAppSelector((state) => state.dictionaryReducer);

    const translateWord = (word: string) => {
        dispatch(fullTranslate({
            word,
            sourceLang: 'en',
            targetLang: 'ru'
        }));
    }

    useEffect(() => {
        if (data) {
            const classes = document.getElementsByClassName("translateMyWord");
            for (let inc = 0; inc < classes.length; inc++) {
                function translateAndHighlight (id: string) {
                    const word = document.getElementById(id);
                    for (let inc = 0; inc < classes.length; inc++) {
                        classes[inc].classList.remove('highlight');
                    }
                    if (word) {
                        console.log('test')
                        word.classList.add('highlight');
                        translateWord(word.innerText);
                    }
                }
                if (!classes[inc].hasAttribute('onclick')) {
                    const element: any = classes[inc];
                    element.onclick = function () {translateAndHighlight(classes[inc].id)};
                }
            }
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
                <AppBar position="fixed" open={open}>
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
                            {page}
                        </Typography>
                        <div className="cursor-pointer" onClick={setNextPage}>
                            <ArrowForwardIosIcon />
                        </div>
                        
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{ flexGrow: 1 }}
                            component="div"
                        >
                           
                            
                        </Typography>
                       
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={handleDrawerOpen}
                            sx={{ ...(open && { display: "none" }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Main open={open}>
                    <DrawerHeader />
                    <div className="w-[82%] flex justify-center">
                        <Typography paragraph>
                            {data && HTMLReactParser(data.text)}
                        </Typography>
                    </div>
                </Main>
                <BookDrawer
                    isOpen={true}
                    className="hidden lg:block"
                    headerBody={
                        <Button variant="contained" size="small">
                            Добавить в словарь
                        </Button>
                    }
                    width={450}
                    translateList={fullTranslateList}
                />
                <BookDrawer
                    isOpen={open}
                    className="block lg:hidden"
                    headerBody={
                        <div>
                            <div>
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === "rtl" ? (
                                        <ChevronLeftIcon />
                                    ) : (
                                        <ChevronRightIcon />
                                    )}
                                </IconButton>
                            </div>
                            <div>
                                <Button variant="contained" size="small">
                                    Добавить в словарь
                                </Button>
                            </div>
                        </div>
                    }
                    width={drawerWidth}
                    translateList={fullTranslateList}
                />
            </Box>
        </>
    );
};

export default BookReader;
