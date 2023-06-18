import { FC } from "react";
import PassedTraining from "./PassedTraining";
import TrainingCard from "./TrainingCard";
import ArrowRight from "../../../../ui/Buttons/ArrowButton/ArrowRigth";

interface ITrainerWordsProps {
    words: IDictionary[];
    start: number;
    limit: number;
    trainingIsPassed: boolean;
    wrongWord: string;
    correctWord: string;
    inputWord: string;
    checkWord: (word: string) => void;
    setInputWord: (value: string) => void;
    switchWord: () => void;
    isVisible: boolean;
}

const TrainerWords: FC<ITrainerWordsProps> = ({
    words,
    start,
    limit,
    trainingIsPassed,
    checkWord,
    inputWord,
    wrongWord,
    correctWord,
    setInputWord,
    switchWord,
    isVisible = false
}) => {
    return (
        <>
            {isVisible && words.slice(start, limit).map((word) => {
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
                );
            })}
        </>
    );
};

export default TrainerWords;
