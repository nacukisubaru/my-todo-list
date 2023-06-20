import { FC, useState } from "react";
import Modal from "../../../../ui/Modal/Modal";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import DictionaryExamples from "./DictionaryExamples";
import { useDictionaryExample } from "../../hooks/useDictionaryExample";
import Divider from "../../../../ui/Dividers/Divider";
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";
import BookButton from "../../ui/Buttons/BookButton";
import RetryButton from "../../ui/Buttons/RetryButton";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useAction";
import StudyButton from "../../ui/Buttons/StudyButton";
import { useFilter } from "../../hooks/useFilter";
import SwapButton from "../../../../ui/Buttons/SwapButton";
import { useDictionary } from "../../hooks/useDictionary";

interface IDictionaryCardProps {
    props: IDictionary;
    closeCard: () => void;
}

const DictionaryCard: FC<IDictionaryCardProps> = ({ props, closeCard }) => {
    const {
        id,
        originalWord,
        translatedWord,
        languageOriginal,
        languageTranslation,
        studyStage,
    } = props;

    const { dictionary } = useAppSelector((state) => state.dictionaryReducer);
    const { speak } = useSpeechSynthesis();
    const { translate, showTranslte, translateExampleLang, examples } =
        useDictionaryExample(props);
    const [updStudyStage] = dictionaryApi.useUpdateSudyStageMutation();
    const [studyStageState, setStudyStage] = useState(studyStage);
    const { setDictionary } = useActions();
    const { filtrate } = useFilter();
    const { addNewWord } = useDictionary();

    const changeStudyStage = async (studyStage: studyStageType) => {
        setStudyStage(studyStage);
        changeDictionaryWord("studyStage", studyStage);
        await updStudyStage({ id, studyStage });
        filtrate();
    };

    const changeDictionaryWord = (field: string, value: string) => {
        const cloneDictionary = dictionary.map((word) => {
            return { ...word };
        });

        cloneDictionary.map((clone, key) => {
            if (clone.id === id) {
                const changableWord: any = cloneDictionary;
                changableWord[key][field] = value;
            }
        });

        setDictionary(cloneDictionary);
    };

    const createReverseWord = () => {
        addNewWord({
            originalWord: translatedWord,
            translatedWord: originalWord,
            languageOriginal: languageTranslation,
            languageTranslation: languageOriginal,
            id: "",
            studyStage: "NOT_STUDIED",
            dictionaryExamples: [],
        });
    };

    return (
        <Modal
            modalSettings={{
                title: originalWord,
                oppositeTitle: (
                    <>
                        {languageOriginal === "en" ? (
                            <>
                                <div className="display flex">
                                    <div className="display flex">
                                        <div className="font-bold">uk</div>
                                        <PlayButton
                                            onClick={() => {
                                                speak(originalWord, "en-GB");
                                            }}
                                        />
                                    </div>
                                    <div className="display flex">
                                        <span className="font-bold">us</span>
                                        <PlayButton
                                            onClick={() => {
                                                speak(originalWord, "en-US");
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <PlayButton
                                onClick={() => {
                                    speak(originalWord, languageOriginal);
                                }}
                            />
                        )}
                    </>
                ),
                primaryBtnName: "",
                secondaryBtnName: "",
                showButtons: false,
                isVisible: true,
                showUpperButtons: true,
            }}
            callbacks={{
                primaryBtnClick: () => {},
                secondaryBtnClick: () => {
                    closeCard();
                },
            }}
            maxWidth="sm:max-w-[32rem]"
        >
            <div className="display flex justify-between">
                <div className="font-bold">{translatedWord}</div>

                <>
                    {languageTranslation === "en" ? (
                        <>
                            <div className="display flex">
                                <div className="display flex">
                                    <div className="font-bold">uk</div>
                                    <PlayButton
                                        onClick={() => {
                                            speak(translatedWord, "en-GB");
                                        }}
                                    />
                                </div>
                                <div className="display flex">
                                    <span className="font-bold">us</span>
                                    <PlayButton
                                        onClick={() => {
                                            speak(translatedWord, "en-US");
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <PlayButton
                            onClick={() => {
                                speak(translatedWord, languageTranslation);
                            }}
                        />
                    )}
                </>
            </div>
            <div className="display flex justify-between mt-[5px]">
                {languageOriginal}&#8594;
                {languageTranslation}
                <SwapButton onClick={createReverseWord}></SwapButton>
            </div>
            <Divider />
            <div className="text-left mb-[15px]">
                <div className="font-bold">Примеры</div>
                <DictionaryExamples
                    examplesList={examples.filter((example) => {
                        if (example.exampleType === "example") {
                            return example;
                        }
                    })}
                    showTranslate={showTranslte}
                    translate={translate}
                    translateExampleLang={translateExampleLang}
                />
                <div className="font-bold">синонимы</div>
                <DictionaryExamples
                    examplesList={examples.filter((example) => {
                        if (example.exampleType === "synonym") {
                            return example;
                        }
                    })}
                    showTranslate={showTranslte}
                    translate={translate}
                    translateExampleLang={translateExampleLang}
                    quantityExamplesOnPage={2}
                />
                <div className="font-bold">антонимы</div>
                <DictionaryExamples
                    examplesList={examples.filter((example) => {
                        if (example.exampleType === "antonym") {
                            return example;
                        }
                    })}
                    showTranslate={showTranslte}
                    translate={translate}
                    translateExampleLang={translateExampleLang}
                    quantityExamplesOnPage={2}
                />
            </div>
            <div className="display flex justify-end">
                {studyStageState === "BEING_STUDIED" && (
                    <StudyButton
                        onClick={() => {
                            changeStudyStage("STUDIED");
                        }}
                    ></StudyButton>
                )}
                {studyStageState === "NOT_STUDIED" && (
                    <BookButton
                        onClick={() => {
                            changeStudyStage("BEING_STUDIED");
                        }}
                    ></BookButton>
                )}
                {studyStageState === "STUDIED" && (
                    <RetryButton
                        onClick={() => {
                            changeStudyStage("NOT_STUDIED");
                        }}
                    ></RetryButton>
                )}
            </div>
        </Modal>
    );
};

export default DictionaryCard;
