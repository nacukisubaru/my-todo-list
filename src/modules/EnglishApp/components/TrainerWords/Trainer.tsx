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

const Trainer = () => {
    const dispatch = useAppDispatch();
    const { resetDictionary } = useActions();
    const { dictionary, error, dictionaryActiveSettings } = useAppSelector(
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

    useEffect(() => {
        dispatch(getLanguages());
        setTrainingEnd(false);
    }, []);

    const switchWord = () => {
        setPagination({
            start: pagination.start + 1,
            limit: pagination.limit + 1,
        });
        setPassTraining(false);
        setCorrectWord("");
        setWrongWord("");
        setInputWord("");
    };

    useEffect(() => {
        if (pagination.start > 0 && pagination.limit > 1) {
            if (!dictionary.slice(pagination.start, pagination.limit).length) {
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
    }, [pagination]);

    useEffect(() => {
        if (error && error.statusCode === 404) {
            setTrainingEnd(true);
        }
    }, [error]);

    const trainingAgain = async () => {
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

    const checkWord = (word: string) => {
        let checkWord: any = word.toLowerCase();
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
                    setWrongWord(
                        `<span style="color:red;">${worngWord}</span>`
                    );
                } else {
                    setWrongWord(worngWord);
                }
            } else {
                setScore(score + 1);
            }
            setPassTraining(true);
            setInputWord("");
        }
    };

    const startTraining = async () => {
        setTrainingStart(true);
        const params: IGetDictionaryListParams = {
            page,
            languageOriginal: dictionaryActiveSettings.sourceLanguage,
            languageTranslation: dictionaryActiveSettings.targetLanguage,
            studyStage: ['BEING_STUDIED']
        };
        await resetDictionary();
        dispatch(getDictionaryByUser(params));
    };

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
                                        name="Начать заново"
                                        color="primary"
                                        onClick={trainingAgain}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <TrainerWords
                                words={dictionary}
                                start={pagination.start}
                                limit={pagination.limit}
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
