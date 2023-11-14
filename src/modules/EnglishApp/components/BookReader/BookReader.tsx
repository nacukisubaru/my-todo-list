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
    const [isEventsInit, setEventsInit] = useState(false);
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

    const setNextPage = () => {
        setPage(page + 1);
    };

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
        if (data && !isEventsInit) {
            const classes = document.getElementsByClassName("translateMyWord");
            for (let inc = 0; inc < classes.length; inc++) {
                classes[inc].addEventListener("click", function (this: any) {
                    translateWord(this.innerText);
                });
            }
            setEventsInit(true);
        }
    }, [data]);

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{ flexGrow: 1 }}
                            component="div"
                        >
                            Persistent drawer
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
                    <Button
                        variant="contained"
                        size="small"
                        onClick={setNextPage}
                    >
                        next page
                    </Button>
                    <div className="w-[83%] flex justify-center">
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
