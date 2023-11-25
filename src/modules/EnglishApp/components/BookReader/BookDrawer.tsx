import Drawer from "@mui/material/Drawer";
import { FC } from "react";
import WordsTagsPanel from "../WordsTagsPanel/WordsTagsPanel";
import { useAppSelector } from "../../hooks/useAppSelector";
import { IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled, useTheme } from "@mui/material/styles";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
}));

const WordsWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(2, 2, 2, 2),
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
    yandexTranslate?: () => void;
    setYandexData?: boolean;
    selectTag:() => void 
}

const BookDrawer: FC<IBookDrawer> = ({
    word,
    isOpen,
    className = "",
    width = 320,
    lang,
    showChevron = false,
    close,
    yandexTranslate = () => {},
    selectTag,
    setYandexData = false
}) => {
    const { fullTranslateList } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const theme = useTheme();
    const { speak } = useSpeechSynthesis();

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
                <div>
                    {showChevron && (
                        <div>
                            <IconButton
                                onClick={() => {
                                    close && close();
                                }}
                            >
                                {theme.direction === "rtl" ? (
                                    <ChevronLeftIcon />
                                ) : (
                                    <ChevronRightIcon />
                                )}
                            </IconButton>
                        </div>
                    )}
                    {fullTranslateList.length > 0 && (
                        <WordsWrapper>
                            <div className="flex justify-start">
                                <div className="flex">
                                    <Typography
                                        variant="h5"
                                        style={{
                                            fontWeight: "bold",
                                            marginRight: "11px",
                                        }}
                                    >
                                        {word && word}
                                    </Typography>

                                    <PlayButton
                                        onClick={() => {
                                            speak(word, lang === 'en' ? "en-US" : lang);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <Typography>
                                    {
                                        fullTranslateList.find(
                                            (item) =>
                                                item.type === "transcription"
                                        )?.word
                                    }
                                </Typography>
                            </div>
                        </WordsWrapper>
                    )}
                </div>
            </DrawerHeader>
            <WordsWrapper>
                <WordsTagsPanel 
                    saveTags={true} 
                    forBook={true} 
                    lang={lang}
                    yandexTranslate={yandexTranslate}
                    setYandexData={setYandexData}
                    selectTag={selectTag}
                />
            </WordsWrapper>
        </Drawer>
    );
};

export default BookDrawer;
