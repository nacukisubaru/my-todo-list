import { useEffect, useState } from "react";
import {
    getLanguages,
} from "../../store/services/dictionary/dictionary.slice";
import { useActions } from "../../hooks/useAction";
import Card from "../../../../ui/Cards/Card";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import TrainerWords from "./TrainerWords";
import { useNavigate } from "react-router-dom";
import { useFilter } from "../../hooks/useFilter";

const Trainer = () => {
    const dispatch = useAppDispatch();
    const { setDictionary } = useActions();
    const { dictionary } = useAppSelector(
        (state) => state.dictionaryReducer
    );
    const {filtrate} = useFilter();

    const [wrongWord, setWrongWord] = useState("");
    const [correctWord, setCorrectWord] = useState("");
    const [trainingIsPassed, setPassTraining] = useState(false);
    const [inputWord, setInputWord] = useState<any>("");
    const [currentWord, setCurrentWord] = useState<IDictionary | null>(null);
    const [initTrainer, setInitTrainer] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getLanguages());
    }, []);

    const switchWord = () => {
        if (!dictionary.length) {
            filtrate();
            navigate('/englishApp');
        }

        const randIndex = Math.floor(Math.random() * dictionary.length);
        let word = dictionary[randIndex];
        if (currentWord && word.id === currentWord.id && dictionary.length > 1) {
            const newWord = dictionary[randIndex + 1];
            if (newWord) {
                word = dictionary[randIndex + 1];
            }
        }
        setCurrentWord(word);

        setPassTraining(false);
        setCorrectWord("");
        setWrongWord("");
        setInputWord("");
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
                    setWrongWord(
                        `<span style="color:red;">${worngWord}</span>`
                    );
                } else {
                    setWrongWord(worngWord);
                }
            } else {
                setDictionary(dictionary.filter((dictionaryWord => dictionaryWord.id !== word.id)));
            }
            
            setPassTraining(true);
            setInputWord("");
        }
    };

    useEffect(() => {
        if (!initTrainer) {
            if (dictionary.length) {
                setCurrentWord(dictionary[0]);
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
                    <TrainerWords
                        word={currentWord}
                        trainingIsPassed={trainingIsPassed}
                        wrongWord={wrongWord}
                        correctWord={correctWord}
                        inputWord={inputWord}
                        checkWord={checkWord}
                        setInputWord={setInputWord}
                        switchWord={switchWord}
                        isVisible={true}
                    />
                </Card>
            </div>
        </div>
    );
};

export default Trainer;
