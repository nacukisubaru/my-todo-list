import { FC } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import BookWordsPanel from "./BookWordsPanel";

interface IBookDrawer {
    word: string;
    isOpen: boolean;
    headerBody?: any;
    className?: string;
    lang: string;
    showChevron?: boolean;
    close?: () => void;
    yandexTranslate?: () => void;
    setYandexData?: boolean;
    selectTag: () => void;
}

const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
    borderRadius: 3,
    position: "absolute",
    bottom: 8,
    left: "calc(50% - 15px)",
    cursor: 'pointer'
}));

const BookDrawer: FC<IBookDrawer> = ({
    word,
    lang,
    close,
    yandexTranslate = () => {},
    selectTag,
    isOpen,
    setYandexData = false,
}) => {

    return (
        <>
            <div className="hidden lg:block shadow-md h-[900px]">
                <div className="px-[15px] py-[15px] w-[500px]">
                    <BookWordsPanel
                        lang={lang}
                        yandexTranslate={yandexTranslate}
                        setYandexData={setYandexData}
                        selectTag={selectTag}
                        word={word}
                    />
                </div>
            </div>

            <div
                className={`block lg:hidden px-[15px] z-[1] h-[330px] w-[100%] md:w-[500px] fixed bg-white ${
                    isOpen ? "translate-y-[0px]" : "-translate-y-[1000px]"
                } ease-in-out duration-300 ...`}
            >
                <BookWordsPanel
                    lang={lang}
                    yandexTranslate={yandexTranslate}
                    setYandexData={setYandexData}
                    selectTag={selectTag}
                    word={word}
                />
                <div className="w-[100%] h-[16px]" onTouchStart={close}>
                    <Puller />
                </div>
            </div>
        </>
    );
};

export default BookDrawer;
