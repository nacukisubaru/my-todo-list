import { useEffect, useState } from "react";
import {
    getDictionaryByUser,
    getLanguages,
} from "../../store/services/dictionary/dictionary.slice";
import { useActions } from "../../hooks/useAction";
import Card from "../../../../ui/Cards/Card";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import BasicButton from "../../../../ui/Buttons/BasicButton/BasicButton";
import TrainerWords from "./TrainerWords";
import { useNavigate } from "react-router-dom";
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";
import { shuffle } from "../../../../helpers/arrayHelper";

const Trainer = () => {
    const dispatch = useAppDispatch();
    const { resetDictionary } = useActions();
    const { dictionary, dictionaryActiveSettings, trainingDictionaryWords } = useAppSelector(
        (state) => state.dictionaryReducer
    );
    const [pagination, setPagination] = useState<{
        start: number;
        limit: number;
    }>({ start: 0, limit: 1 });

    const [page, setPage] = useState(0);
    const [isTrainingEnd, setTrainingEnd] = useState(false);
    const [isTrainingStart, setTrainingStart] = useState(false);
    const [wrongWord, setWrongWord] = useState("");
    const [correctWord, setCorrectWord] = useState("");
    const [trainingIsPassed, setPassTraining] = useState(false);
    const [inputWord, setInputWord] = useState<any>("");
    const [score, setScore] = useState(0);
    const [incorrectWords, setIncorrectWord] = useState<IDictionary[]>([]);
    const [countWords, setCountWords] = useState(0);
    const [currentWord, setCurrentWord] = useState<IDictionary | null>(null);
    const [initTrainer, setInitTrainer] = useState(false);
    const [isExistWrongWord, setExistWrongWord] = useState(false);
    const [updStudyStage] = dictionaryApi.useUpdateSudyStageMutation();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getLanguages());
        setTrainingEnd(false);
    }, []);

    const switchWord = () => {
        const changeCurrentWord = () => {
            setCountWords(countWords + 1);
            const start = pagination.start + 1;
            const limit = pagination.limit + 1;

            setPagination({
                start,
                limit
            });

            const words = dictionary.slice(start, limit);
            if (words.length) {
                setCurrentWord(words[0]);
            } else {
                if (incorrectWords.length) {
                    setCurrentWord(incorrectWords[0]);
                } else {
                    setTrainingEnd(true);
                }
            }
        }

        if (!isExistWrongWord || (isExistWrongWord && countWords < 2)) {
            changeCurrentWord();
        } else {
            if (incorrectWords.length) {
                setCurrentWord(incorrectWords[0]);
            } else {
                changeCurrentWord();
            }
        }

        setPassTraining(false);
        setCorrectWord("");
        setWrongWord("");
        setInputWord("");
    };

    useEffect(() => {
        if (!incorrectWords.length) {
            setCountWords(0);
            setExistWrongWord(false);
        }
    }, [incorrectWords]);

    useEffect(() => {
        if (pagination.start > 0 && pagination.limit > 1) {
            if (!dictionary.slice(pagination.start, pagination.limit).length) {
                if (!trainingDictionaryWords) {
                    setPage(page + 1);
                    const params: IGetDictionaryListParams = {
                        page: page + 1,
                        languageOriginal: dictionaryActiveSettings.sourceLanguage,
                        languageTranslation: dictionaryActiveSettings.targetLanguage,
                        studyStage: ['BEING_STUDIED']
                    };
                    dispatch(getDictionaryByUser(params));
                }
            }
        }
    }, [pagination]);

    const trainingAgain = async () => {
        if (trainingDictionaryWords) {
            navigate('/englishApp');
        }
        const params: IGetDictionaryListParams = {
            page: 0,
            languageOriginal: dictionaryActiveSettings.sourceLanguage,
            languageTranslation: dictionaryActiveSettings.targetLanguage,
            studyStage: ['BEING_STUDIED']
        };
        await resetDictionary();
        setTrainingEnd(false);
        setPage(0);
        setPagination({ start: 0, limit: 1 });
        dispatch(getDictionaryByUser(params));
        setScore(0);
        setTrainingStart(true);
    };

    const checkWord = (word: IDictionary) => {
        const translatedWord:any = word.translatedWord;
        let checkWord: any = translatedWord.toLowerCase();
        let worngWord = "";
        let correctWord = "";
        if (inputWord) {
            for (let incWord in inputWord) {
                if (inputWord[incWord] !== checkWord[incWord]) {
                    worngWord += `<span style="color:red;">${inputWord[incWord]}</span>`;
                    if (checkWord[incWord]) {
                        correctWord += `<span style="color:green;">${checkWord[incWord]}</span>`;
                    }
                } else {
                    worngWord += inputWord[incWord];
                    if (checkWord[incWord]) {
                        correctWord += checkWord[incWord];
                    }
                }
            }

            if (inputWord.length < checkWord.length) {
                setCorrectWord(checkWord);
            } else {
                setCorrectWord(correctWord);
            }

            if (checkWord !== inputWord) {
                if (inputWord.length < checkWord.length) {
                    setExistWrongWord(true);
                    setCountWords(0);
                    setWrongWord(
                        `<span style="color:red;">${worngWord}</span>`
                    );
                    if (incorrectWords.includes(word)) {
                        setIncorrectWord(shuffle(incorrectWords.filter((incorrectWord) => incorrectWord.id !== word.id)));
                    } else {
                        setIncorrectWord(shuffle([...incorrectWords, word]));
                    }
                } else {
                    setWrongWord(worngWord);
                }
            } else {
                updStudyStage({id: word.id, studyStage: 'STUDIED'});
                setIncorrectWord(incorrectWords.filter((incorrectWord) => incorrectWord.id !== word.id));
                setScore(score + 1);
            }
            
            setPassTraining(true);
            setInputWord("");
        }
    };

    const startTraining = async () => {
        setTrainingStart(true);
        if (!trainingDictionaryWords) {
            const params: IGetDictionaryListParams = {
                page,
                languageOriginal: dictionaryActiveSettings.sourceLanguage,
                languageTranslation: dictionaryActiveSettings.targetLanguage,
                studyStage: ['BEING_STUDIED']
            };
            await resetDictionary();
            dispatch(getDictionaryByUser(params));
        }
    };

    useEffect(() => {
        if (!initTrainer) {
            let words = dictionary.slice(pagination.start, pagination.limit);
            if (words.length) {
                setCurrentWord(words[0]);
            }
            setInitTrainer(true);
        }
    }, [dictionary]);
    
    return (
        <div className="display flex justify-center">
            <div className="mt-[90px]">
                <Card
                    width={"w-[200vh]"}
                    maxWidth="max-w-[52vh]"
                    height="h-auto"
                >
                    {!isTrainingStart && (
                        <>
                            <div className="display flex justify-center">
                                <BasicButton
                                    name="Начать тренировку"
                                    color="primary"
                                    onClick={startTraining}
                                />
                            </div>
                        </>
                    )}
                    
                    {isTrainingEnd ? (
                        <div className="display flex justify-center">
                            <div>
                                <div>Тренировка завершена</div>
                                <div className="text-center">
                                    {score} / {dictionary.length}
                                </div>
                                <div className="display flex justify-center">
                                    <BasicButton
                                        name={!trainingDictionaryWords ?  "Начать заново" : "Вернутся в словарь"}
                                        color="primary"
                                        onClick={trainingAgain}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <TrainerWords
                                word={currentWord}
                                trainingIsPassed={trainingIsPassed}
                                wrongWord={wrongWord}
                                correctWord={correctWord}
                                inputWord={inputWord}
                                checkWord={checkWord}
                                setInputWord={setInputWord}
                                switchWord={switchWord}
                                isVisible={isTrainingStart}
                            />
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Trainer;
