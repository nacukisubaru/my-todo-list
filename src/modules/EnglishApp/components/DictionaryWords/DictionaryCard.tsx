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
import StudyButton from "../../ui/Buttons/StudyButton";
import { useFilter } from "../../hooks/useFilter";
import ArrowWithText from "../../../../ui/Buttons/ArrowButton/ArrowWithText";
import { fullTranslate, getAnalogs, getExamplesForWord } from "../../store/services/dictionary/dictionary.slice";
import WordsPanel from "../../ui/WordsPanel/WordsPanel";
import { availableLanguages } from "../../helpers/languageHelper";
import { Button } from "@mui/material";
import WordTag from "../../ui/WordsPanel/WordTag";
import CreateIcon from '@mui/icons-material/Create';
import DictionaryNotes from "./DictionaryNotes";

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
        dictionaryLinkedWords,
        transcription, 
        notes
    } = props;

    const { dictionary, fullTranslateList, analogsWord, lingvoExamples } = useAppSelector((state) => state.dictionaryReducer);
    const { speak } = useSpeechSynthesis();
    const { 
        translate, 
        showTranslte, 
        getExamples,
        examples
    } = useDictionaryExample(props);

    const [updStudyStage] = dictionaryApi.useUpdateSudyStageMutation();
    const [createLinkedWords] = dictionaryApi.useCreateLinkedWordMutation();
    const [studyStageState, setStudyStage] = useState(studyStage);
    const [linkedWordsList, addToLinkedWordsList] = useState<string[]>(dictionaryLinkedWords ? dictionaryLinkedWords.map(item => item.word) : []);
    const [lingvoExamplesList, setLingvoExample] = useState<ILingvoExample[]>([]);

    const { setDictionary, resetFullTranslateList } = useActions();
    const { filtrate } = useFilter();
    
    useEffect(() => {
        getExamples();
    }, []);

    useEffect(() => {
        setLingvoExample(lingvoExamples);
    }, [lingvoExamples]);

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

    const getWordsFromLingvo = () => {
        dispatch(fullTranslate({
            word: translatedWord,
            sourceLang: languageTranslation,
            targetLang: 'ru'
        }));
    }

    const getAnalogsWord = () => {
        dispatch(getAnalogs({
            word: originalWord,
            sourceLang: 'ru',
            targetLang: languageTranslation
        }));
    }

    const getExamplesFromLingvo = () => {
        dispatch(getExamplesForWord({
            word: translatedWord,
            sourceLang: languageTranslation,
            targetLang: 'ru',
            pageSize: 200
        }));
    }

    const showLingvoExample = (example: IDictionaryExample, isShow: boolean) => {
        const examples = lingvoExamplesList.map(lingvoExample => {
            if (lingvoExample.originalText === example.originalText) {
                return {...lingvoExample, showTranslate: isShow};
            } else {
                return {...lingvoExample, showTranslate: false};
            }
        });

        setLingvoExample(examples);
    }

    const addLinkedWords = () => {
        changeDictionaryWord("dictionaryLinkedWords", linkedWordsList.map(word => {return {word}}));
        createLinkedWords({
            dictionaryId: id,
            words: linkedWordsList,
        })
    }

    const addToLinkedWords = (word: string, isRemove: boolean) => {
        let words: string[] = linkedWordsList;
        if (isRemove) {
            words = linkedWordsList.filter(linkedWord => linkedWord !== word);
            addToLinkedWordsList(words);
        } else {
            addToLinkedWordsList([...words, word]);
        }
    }

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
                            return  <WordTag onClick={()=>{}} checkTags={false}>{word}</WordTag>;
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
                            <>
                                <WordsPanel 
                                    wordsList={fullTranslateList.map(translate => {
                                        if (linkedWordsList.length && linkedWordsList.includes(translate.word)) {
                                            return {...translate, isActive: true}
                                        }
                                        return {...translate, isActive: false}
                                    })}
                                    addWord={addToLinkedWords}
                                /> 
                                <div className="flex justify-end">
                                    <Button variant="contained" size="small" onClick={addLinkedWords}>Сохранить</Button>
                                </div>
                            </> : false}>
                            Получить значения слова {translatedWord}
                        </ArrowWithText>
                        <ArrowWithText 
                            onClick={getAnalogsWord} 
                            content={analogsWord.length ? <WordsPanel wordsList={analogsWord} checkWords={false}/> : false}>
                            Альтернативы слову {translatedWord}
                        </ArrowWithText>
                        <ArrowWithText 
                            onClick={getExamplesFromLingvo} 
                            content={lingvoExamples.length ? 
                            <DictionaryExamples
                                examplesList={lingvoExamplesList}
                                showTranslate={showLingvoExample}
                                translate={translate}
                                languageOriginal={languageOriginal}
                                languageTranslation={languageTranslation}
                            />  : false}>
                            Примеры из lingvo
                        </ArrowWithText>
                    </>
                )}
                <ArrowWithText 
                    onClick={()=>{}}
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
