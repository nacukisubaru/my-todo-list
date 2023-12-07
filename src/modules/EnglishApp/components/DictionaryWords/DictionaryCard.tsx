import { FC, useEffect, useState } from "react";
import Modal from "../../../../ui/Modal/Modal";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import DictionaryExamples from "./DictionaryExamples";
import { useDictionaryExample } from "../../hooks/useDictionaryExample";
import Divider from "../../../../ui/Dividers/Divider";
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";
import BookButton from "../../ui/Buttons/BookButton";
import RetryButton from "../../ui/Buttons/RetryButton";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useAction";
import { useFilter } from "../../hooks/useFilter";
import ArrowWithText from "../../../../ui/Buttons/ArrowButton/ArrowWithText";
import { fullTranslate, getAnalogs } from "../../store/services/dictionary/dictionary.slice";
import WordsPanel from "../WordsTagsPanel/WordsPanel";
import { availableLanguages } from "../../helpers/languageHelper";
import WordTag from "../WordsTagsPanel/WordTag";
import DictionaryNotes from "./DictionaryNotes";
import DictionaryLingvoExamples from "./DictionaryLingvoExamples";
import { uniqueList } from "../../../../helpers/arrayHelper";
import WordsTagsPanel from "../WordsTagsPanel/WordsTagsPanel";
import { useDictionary } from "../../hooks/useDictionary";

interface IDictionaryCardProps {
    props: IDictionary;
    closeCard: () => void;
    onChangeStudyStage: (wordId: string, studyStage: studyStageType) => void;
}

const DictionaryCard: FC<IDictionaryCardProps> = ({ props, closeCard, onChangeStudyStage }) => {
    const {
        id,
        originalWord,
        translatedWord,
        languageOriginal,
        languageTranslation,
        studyStage,
        dictionaryLinkedWords,
        transcription, 
        notes
    } = props;

    const { dictionary, fullTranslateList, analogsWord } = useAppSelector((state) => state.dictionaryReducer);
    const { speak } = useSpeechSynthesis();
    const { 
        translate, 
        showTranslte, 
        getExamples,
        examples
    } = useDictionaryExample(props);
    
    const {isExecuteYandexTranslate, setYandexTranslateExecute} = useDictionary();

    const [updStudyStage] = dictionaryApi.useUpdateSudyStageMutation();
    const [studyStageState, setStudyStage] = useState(studyStage);
    const [linkedWordsList, addToLinkedWordsList] = useState<string[]>([]);

    const { setDictionary, resetFullTranslateList } = useActions();
    const { filtrate } = useFilter();
    
    useEffect(() => {
        getExamples();
    }, []);

    const dispatch = useAppDispatch();
    
    const changeStudyStage = async (studyStage: studyStageType) => {
        setStudyStage(studyStage);
        changeDictionaryWord("studyStage", studyStage);
        await updStudyStage({ id, studyStage });
        filtrate();
    };

    const changeDictionaryWord = (field: string, value: any) => {
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

    const getWordsFromLingvo = (getYandexTranslate: boolean = false) => {
        dispatch(fullTranslate({
            word: translatedWord,
            sourceLang: languageTranslation,
            targetLang: 'ru',
            getYandexTranslate
        }));

        if (getYandexTranslate) {
            setYandexTranslateExecute(true);
        } else {
            setYandexTranslateExecute(false);
        }
    }

    const getAnalogsWord = () => {
        dispatch(getAnalogs({
            word: originalWord,
            sourceLang: 'ru',
            targetLang: languageTranslation
        }));
    }

    const addLinkedWords = (words: string[]) => {
        addToLinkedWordsList(words);
        changeDictionaryWord("dictionaryLinkedWords", words.map(word => {return {word}}));
    }

    useEffect(() => {
        if (dictionaryLinkedWords.length) {
            addToLinkedWordsList(dictionaryLinkedWords.map(item => item.word));
        }
    }, [dictionaryLinkedWords]);

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
                    resetFullTranslateList();
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
            <div className="text-left">
                <div className="display flex justify-between mt-[5px] mb-[5px]">
                    {languageOriginal}&#8594;
                    {languageTranslation}
                </div>

                {transcription && (
                    <>
                        <div className="font-bold mb-[5px]">Транскрипция</div>
                        {transcription}
                    </>
                )}

                {linkedWordsList.length && (
                    <>
                        <div className="font-bold mb-[5px]">Значения</div>
                        {linkedWordsList.map(word => {
                            return  <WordTag>{word}</WordTag>;
                        })}
                    </>
                )}
                <DictionaryNotes notes={notes} dictionaryId={id}/>
            </div>
            <Divider />
            <div className="text-left mb-[15px]">
                {availableLanguages.includes(languageOriginal) && availableLanguages.includes(languageTranslation) 
                && (languageTranslation === 'ru' || languageOriginal === 'ru')  && (
                    <>
                        <ArrowWithText 
                            onClick={getWordsFromLingvo} 
                            content={fullTranslateList.length ?
                                <WordsTagsPanel
                                    saveTagsCallback={addLinkedWords}
                                    saveTags={true}
                                    yandexTranslate={() => {getWordsFromLingvo(true)}}                
                                    setYandexData={isExecuteYandexTranslate}
                                    selectTag={()=>{setYandexTranslateExecute(false)}}
                                />
                             : false}>
                            Получить значения слова {translatedWord}
                        </ArrowWithText>
                        <ArrowWithText 
                            onClick={getAnalogsWord} 
                            content={analogsWord.length ?
                            <WordsPanel 
                                wordsList={analogsWord} 
                                tabs={uniqueList(analogsWord.map((word) => word.type))}
                            /> : false}>
                            Альтернативы слову {translatedWord}
                        </ArrowWithText>
                        <DictionaryLingvoExamples 
                            translatedWord={translatedWord} 
                            languageOriginal={languageOriginal} 
                            languageTranslation={languageTranslation}
                        />
                    </>
                )}
                <ArrowWithText                    
                    content={
                        <>
                            <DictionaryExamples
                                examplesList={examples.filter((example) => {
                                    if (example.exampleType === "example") {
                                        return example;
                                    }
                                })}
                                showTranslate={showTranslte}
                                translate={translate}
                                languageOriginal={languageOriginal}
                                languageTranslation={languageTranslation}
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
                                languageOriginal={languageOriginal}
                                languageTranslation={languageTranslation}
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
                                languageOriginal={languageOriginal}
                                languageTranslation={languageTranslation}
                                quantityExamplesOnPage={2}
                            />
                        </>
                    }>
                        Другие примеры
                </ArrowWithText>
            </div>
            <div className="display flex justify-end">
                {studyStageState === "BEING_STUDIED" && (
                    <BookButton
                        onClick={() => {
                            onChangeStudyStage(id, "STUDIED");
                            changeStudyStage("STUDIED");
                        }}
                    ></BookButton>
                )}
                {studyStageState === "STUDIED" && (
                    <RetryButton
                        onClick={() => {
                            onChangeStudyStage(id, "BEING_STUDIED");
                            changeStudyStage("BEING_STUDIED");
                        }}
                    ></RetryButton>
                )}
            </div>
        </Modal>
    );
};

export default DictionaryCard;
