import { FC } from "react";
import BasicButton from "../../../../ui/Buttons/BasicButton/BasicButton";
import WordTag from "../WordsTagsPanel/WordTag";
import ArrowWithText from "../../../../ui/Buttons/ArrowButton/ArrowWithText";

interface ITrainingCardProps {
    word: IDictionary;
    checkWord: (word: string) => void;
    setInput: (value: string) => void;
    isVisible: boolean;
    disableButton?: boolean
}

const TrainingCard: FC<ITrainingCardProps> = ({
    word,
    checkWord,
    setInput,
    isVisible,
    disableButton = false
}) => {
    return (
        <div className="display flex justify-center">
            {isVisible && (
                <div className="w-[52vh]">
                    <div className="font-bold">{word.originalWord}</div>
                    {word.dictionaryLinkedWords && word.dictionaryLinkedWords.length > 0 && (
                        <ArrowWithText 
                            content={
                                <>
                                    {word.dictionaryLinkedWords.map(word => {
                                        return <WordTag>{word.word}</WordTag>;
                                    })}
                                </>
                            }
                        >
                            Теги
                        </ArrowWithText>
                    )}
                    {word.notes && (
                        <ArrowWithText 
                            content={word.notes}
                        >
                            Заметки
                        </ArrowWithText>
                    )}

                    <input
                        id="trainerInput"
                        name="trainerInput"
                        type="text"
                        onChange={(e) => {
                            setInput(e.target.value)
                        }}
                        className="col-sm block w-full px-[11px] rounded-md border-0 py-1.5 
                    text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                    focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-[12px]"
                    />
                    <div className="display flex justify-center">
                        <BasicButton
                            name="Проверить"
                            color="primary"
                            onClick={() => {
                                checkWord(word.translatedWord);
                            }}
                            isDisabled={disableButton}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingCard;
