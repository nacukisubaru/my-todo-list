import { FC, useEffect, useState } from "react";
import PassedTraining from "./PassedTraining";
import TrainingCard from "./TrainingCard";
import ArrowRight from "../../../../ui/Buttons/ArrowButton/ArrowRigth";
import { setTitle } from "../../../../helpers/domHelper";

interface ITrainerWordsProps {
    word: IDictionary | null,
    trainingIsPassed: boolean;
    wrongWord: string;
    correctWord: string;
    inputWord: string;
    checkWord: (word: IDictionary) => void;
    setInputWord: (value: string) => void;
    switchWord: () => void;
    isVisible: boolean;
}

const TrainerWords: FC<ITrainerWordsProps> = ({
    word, 
    trainingIsPassed,
    checkWord,
    inputWord,
    wrongWord,
    correctWord,
    setInputWord,
    switchWord,
    isVisible = false,
}) => {
    useEffect(() => {
        setTitle("Тренажер слов");
    }, []);

    return (
        <>
            {isVisible && word && (
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
                        setInput={(value: string) => {
                            setInputWord(value.toLowerCase());
                        }}
                        isVisible={trainingIsPassed ? false : true}
                        disableButton={!inputWord ? true : false}
                    />
                    {trainingIsPassed && (
                        <ArrowRight onClick={switchWord}></ArrowRight>
                    )}
                </>
            )}
        </>
    );
};

export default TrainerWords;
