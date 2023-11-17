import Drawer from "@mui/material/Drawer";
import { FC } from "react";
import WordsTagsPanel from "../WordsTagsPanel/WordsTagsPanel";
import { useAppSelector } from "../../hooks/useAppSelector";
import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled, useTheme } from "@mui/material/styles";

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
}));

const WordsWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
}));

interface IBookDrawer {
    word: string;
    isOpen: boolean;
    headerBody?: any;
    className?: string;
    width: number;
    lang: string;
    showChevron?: boolean;
    close?: () => void;
}

const BookDrawer: FC<IBookDrawer> = ({
    word,
    isOpen,
    className = "",
    width = 320,
    lang,
    showChevron = false,
    close
}) => {
    const { fullTranslateList } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const theme = useTheme();

    return (
        <Drawer
            sx={{
                width: width,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: width,
                },
            }}
            variant="persistent"
            anchor="right"
            open={isOpen}
            className={className}
        >
            <DrawerHeader>
                {showChevron && (
                    <div>
                        <IconButton onClick={() => {close && close()}}>
                            {theme.direction === "rtl" ? (
                                <ChevronLeftIcon />
                            ) : (
                                <ChevronRightIcon />
                            )}
                        </IconButton>
                    </div>
                )}
                {word && word}
                {fullTranslateList.find(item => item.type === 'transcription')?.word}
            </DrawerHeader>
            <WordsWrapper>
                <WordsTagsPanel
                    saveTags={true}
                    forBook={true}
                    lang={lang}
                />
            </WordsWrapper>
        </Drawer>
    );
};

export default BookDrawer;
