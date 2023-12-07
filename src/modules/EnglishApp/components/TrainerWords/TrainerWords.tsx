import { FC, useEffect } from "react";
import PassedTraining from "./PassedTraining";
import TrainingCard from "./TrainingCard";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import MoodIcon from '@mui/icons-material/Mood';
import { setTitle } from "../../../../helpers/domHelper";
import { IconButton } from "@mui/material";
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";

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
    const [updStudyStage] = dictionaryApi.useUpdateSudyStageMutation();
    
    useEffect(() => {
        setTitle("Тренажер слов");
    }, []);

    const nextWord = (isGoodAnswer: boolean = false) => {
        if (word && isGoodAnswer) {
            updStudyStage({id: word.id, studyStage: 'STUDIED'});
        }
        switchWord();
    }

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
                        <div className="flex justify-center">
                            <IconButton onClick={() => {nextWord(false)}}>
                                <SentimentVeryDissatisfiedIcon />
                            </IconButton>
                            
                            {!wrongWord && (
                                <IconButton onClick={() => {nextWord(true)}}>
                                    <MoodIcon />
                                </IconButton>     
                            )} 
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default TrainerWords;
