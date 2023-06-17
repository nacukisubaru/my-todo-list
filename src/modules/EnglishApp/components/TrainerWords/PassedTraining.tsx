import { FC } from "react";
import HTMLReactParser from "html-react-parser";
import { useDictionaryExample } from "../../hooks/useDictionaryExample";
import DictionaryExamples from "../DictionaryWords/DictionaryExamples";
import Divider from "../../../../ui/Dividers/Divider";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import PlayButton from "../../../../ui/Buttons/PlayButton";

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
    const {translate, showTranslte, translateExampleLang, examples} = useDictionaryExample(word);
    const { speak } = useSpeechSynthesis();

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
                    <DictionaryExamples
                        examplesList={examples}
                        translateExampleLang={translateExampleLang}
                        showTranslate={showTranslte}
                        translate={translate}
                    ></DictionaryExamples>
                </>
            )}
        </>
    );
};

export default PassedTraining;
