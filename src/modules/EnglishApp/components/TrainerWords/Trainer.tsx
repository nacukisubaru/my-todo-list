import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    getDictionaryByUser,
    getLanguages,
} from "../../store/services/dictionary/dictionary.slice";
import { useActions } from "../../hooks/useAction";
import Card from "../../../../ui/Cards/Card";
import { useAppSelector } from "../../hooks/useAppSelector";
import BasicButton from "../../../../ui/Buttons/BasicButton/BasicButton";
import TrainerWords from "./TrainerWords";
import DictionaryLanguages from "../DictionaryWords/DictionaryLanguages";

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
    const [isTrainingStart, setTrainingStart] = useState(false);
    const [wrongWord, setWrongWord] = useState("");
    const [correctWord, setCorrectWord] = useState("");
    const [trainingIsPassed, setPassTraining] = useState(false);
    const [inputWord, setInputWord] = useState<any>("");
    const [score, setScore] = useState(0);
    const [trainingFirstLang, setTrainingFirstLang] = useState("");
    const [trainingSecoundLang, setTrainingSecoundLang] = useState("");

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
                    languageOriginal: trainingFirstLang,
                    languageTranslation: trainingSecoundLang,
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
            languageOriginal: trainingFirstLang,
            languageTranslation: trainingSecoundLang,
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

    const selectFirstLang = (lang: ILanguage[]) => {
        const langCode: string = lang[0].code;
        setTrainingFirstLang(langCode);
    };

    const selectSecoundLang = (lang: ILanguage[]) => {
        const langCode: string = lang[0].code;
        setTrainingSecoundLang(langCode);
    };

    const startTraining = async () => {
        if (trainingFirstLang && trainingSecoundLang) {
            setTrainingStart(true);
            const params: IGetDictionaryListParams = {
                page,
                languageOriginal: trainingFirstLang,
                languageTranslation: trainingSecoundLang,
                studyStage: ['BEING_STUDIED']
            };
            await resetDictionary();
            dispatch(getDictionaryByUser(params));
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
                    {!isTrainingStart && (
                        <>
                            <div className="mb-[10px]">
                                <DictionaryLanguages
                                    selectLang={selectFirstLang}
                                    placeholder="Выберите язык оригинала"
                                ></DictionaryLanguages>
                            </div>
                            <div className="mb-[15px]">
                                <DictionaryLanguages
                                    selectLang={selectSecoundLang}
                                    placeholder="Выберите язык перевода"
                                ></DictionaryLanguages>
                            </div>
                            <div className="display flex justify-center">
                                <BasicButton
                                    name="Начать тренировку"
                                    color="primary"
                                    onClick={startTraining}
                                    isDisabled={
                                        !trainingFirstLang &&
                                        !trainingSecoundLang
                                            ? true
                                            : false
                                    }
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
