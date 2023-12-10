import { FC, useEffect } from "react";
import HTMLReactParser from "html-react-parser";
import { useDictionaryExample } from "../../hooks/useDictionaryExample";
import DictionaryExamples from "../DictionaryWords/DictionaryExamples";
import Divider from "../../../../ui/Dividers/Divider";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import DictionaryLingvoExamples from "../DictionaryWords/DictionaryLingvoExamples";
import ArrowWithText from "../../../../ui/Buttons/ArrowButton/ArrowWithText";
import WordTag from "../WordsTagsPanel/WordTag";

interface IPassedTrainingProps {
    isPassed: boolean;
    wrongWord: string;
    correctWord: string;
    word: IDictionary;
}

const PassedTraining: FC<IPassedTrainingProps> = ({
    wrongWord,
    correctWord,
    word,
    isPassed,
}) => {
    const {translate, showTranslte, getExamples, examples} = useDictionaryExample(word);
    const { speak } = useSpeechSynthesis();

    useEffect(() => {
        if (isPassed) {
            getExamples();
        }
    }, [isPassed]);

    return (
        <>
            {isPassed && (
                <>
                    {wrongWord ? (
                        <>
                            <div className="display flex justify-center">
                                <div>
                                    <div className="font-bold">Не верно! Сравни</div>
                                    <div className="font-bold"> {HTMLReactParser(wrongWord)}&#8594;{HTMLReactParser(correctWord)}</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>все верно ура :D</>
                    )}
                    <Divider />
                    <div className="display flex justify-between">
                        <div className="font-bold">{word.translatedWord}</div>
                        <PlayButton
                            onClick={() => {
                                speak(word.translatedWord, word.languageTranslation);
                            }}
                        />
                    </div>

                    <div className="display flex justify-between">
                        <div>{word.originalWord}</div>
                        <PlayButton
                            onClick={() => {
                                speak(word.originalWord, word.languageOriginal);
                            }}
                        />
                    </div>
                    
                    <Divider />
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
                    <DictionaryLingvoExamples 
                        translatedWord={word.translatedWord} 
                        languageOriginal={word.languageOriginal} 
                        languageTranslation={word.languageTranslation}
                        alwaysChangeExamples={true}
                    />
                    <ArrowWithText
                        content={
                            <DictionaryExamples
                                examplesList={examples}
                                languageOriginal={word.languageOriginal}
                                languageTranslation={word.languageTranslation}
                                showTranslate={showTranslte}
                                translate={translate}
                            />
                        }
                    >
                        Другие примеры
                    </ArrowWithText>
                </>
            )}
        </>
    );
};

export default PassedTraining;
