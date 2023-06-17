import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getDictionaryByUser } from "../../store/services/dictionary/dictionary.slice";
import { useActions } from "../../hooks/useAction";
import Card from "../../../../ui/Cards/Card";
import { useAppSelector } from "../../hooks/useAppSelector";
import ArrowRight from "../../../../ui/Buttons/ArrowButton/ArrowRigth";
import BasicButton from "../../../../ui/Buttons/BasicButton/BasicButton";
import PassedTraining from "./PassedTraining";
import TrainingCard from "./TrainingCard";

const Trainer = () => {
    const dispatch = useDispatch();
    const { resetDictionary } = useActions();
    const { dictionary, error } = useAppSelector(
        (state) => state.dictionaryReducer
    );
    const [pagination, setPagination] = useState<{
        start: number;
        limit: number;
    }>({ start: 0, limit: 1 });

    const [page, setPage] = useState(0);
    const [isTrainingEnd, setTrainingEnd] = useState(false);
    const [wrongWord, setWrongWord] = useState("");
    const [correctWord, setCorrectWord] = useState("");
    const [trainingIsPassed, setPassTraining] = useState(false);
    const [inputWord, setInputWord] = useState<any>("");
    const [score, setScore] = useState(0);

    useEffect(() => {
        const getWords = async () => {
            const params: IGetDictionaryListParams = {
                page,
                languageOriginal: "ru",
                languageTranslation: "en",
            };
            await resetDictionary();
            dispatch(getDictionaryByUser(params));
        };

        getWords();
    }, []);

    const switchWord = () => {
        setPagination({
            start: pagination.start + 1,
            limit: pagination.limit + 1,
        });
        setPassTraining(false);
        setCorrectWord('');
        setWrongWord('');
        setInputWord("");
    };

    useEffect(() => {
        if (pagination.start > 0 && pagination.limit > 1) {
            if (!dictionary.slice(pagination.start, pagination.limit).length) {
                setPage(page + 1);
                const params: IGetDictionaryListParams = {
                    page: page + 1,
                    languageOriginal: "en",
                    languageTranslation: "ru",
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
            languageOriginal: "ru",
            languageTranslation: "en",
        };
        await resetDictionary();
        setTrainingEnd(false);
        setPage(0);
        setPagination({ start: 0, limit: 1 });
        dispatch(getDictionaryByUser(params));
        setScore(0);
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
                    setWrongWord(`<span style="color:red;">${worngWord}</span>`);
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

    return (
        <div className="display flex justify-center">
            <div className="mt-[90px]">
                <Card
                    width={"w-[200vh]"}
                    maxWidth="max-w-[52vh]"
                    height="h-auto"
                >
                    {isTrainingEnd ? (
                        <div className="display flex justify-center">
                            <div>
                                <div>
                                    Тренировка завершена
                                </div>
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
                            {dictionary
                                .slice(pagination.start, pagination.limit)
                                .map((word) => {
                                    return (
                                        <>
                                            <PassedTraining
                                                isPassed={trainingIsPassed}
                                                wrongWord={wrongWord}
                                                word={word}
                                                correctWord={correctWord}
                                            />
                                            <TrainingCard
                                                word={word}
                                                checkWord={checkWord}
                                                setInput={(value: string) => {setInputWord(value.toLowerCase())}}
                                                isVisible={
                                                    trainingIsPassed
                                                        ? false
                                                        : true
                                                }
                                                disableButton={!inputWord ? true : false}
                                            />
                                        </>
                                    );
                                })}
                            {trainingIsPassed && (
                                <ArrowRight onClick={switchWord}></ArrowRight>
                            )}
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Trainer;
