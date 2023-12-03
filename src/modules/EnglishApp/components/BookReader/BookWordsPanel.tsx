import { FC } from "react";
import WordsTagsPanel from "../WordsTagsPanel/WordsTagsPanel";
import { useAppSelector } from "../../hooks/useAppSelector";
import { Typography, styled } from "@mui/material";

import PlayButton from "../../../../ui/Buttons/PlayButton";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";

const WordsWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(2, 2, 2, 2),
}));

interface IBookWordsPanelProps {
    word: string;
    lang: string;
    yandexTranslate?: () => void;
    setYandexData?: boolean;
    selectTag: () => void;
}

const BookWordsPanel: FC<IBookWordsPanelProps> = ({
    word,
    lang,
    yandexTranslate,
    setYandexData,
    selectTag,
}) => {
    const { fullTranslateList } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const { speak } = useSpeechSynthesis();

    return (
        <>
            <div>
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
                                        speak(
                                            word,
                                            lang === "en" ? "en-US" : lang
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <Typography>
                                {
                                    fullTranslateList.find(
                                        (item) => item.type === "transcription"
                                    )?.word
                                }
                            </Typography>
                        </div>
                    </WordsWrapper>
                )}
            </div>

            <div className={` mt-[-20px]`}>
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
            </div>
        </>
    );
};

export default BookWordsPanel;
