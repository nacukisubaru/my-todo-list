import { FC } from "react";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import ArrowButton from "../../../../ui/Buttons/ArrowButton/ArrowButton";
import TranslateButton from "../../ui/Buttons/TranslateButton";

interface IDictionaryExamplesProps {
    examplesList: IDictionaryExample[];
    showTranslate: (example: IDictionaryExample, isShow: boolean) => void;
    translate: (example: IDictionaryExample) => void;
}

const DictionaryExamples: FC<IDictionaryExamplesProps> = ({
    examplesList,
    showTranslate,
    translate
}) => {
    const { speak } = useSpeechSynthesis();

    return (
        <>
            {examplesList &&
                examplesList.map((example) => {
                    return (
                        <div className="display flex justify-between">
                            <div>
                                <div className="break-words w-[37vh]">
                                    {example.translatedText && (
                                        <ArrowButton
                                            onClick={(isShow) => {
                                                showTranslate(example, isShow);
                                            }}
                                        />
                                    )}
                                    
                                    {example.originalText}
                                    {!example.translatedText && (
                                        <TranslateButton onClick={() => {translate(example)}}/>
                                    )}
                                    
                                    
                                </div>
                                {example.translatedText &&
                                    example.showTranslate && (
                                        <div>{example.translatedText}</div>
                                    )}
                            </div>
                            <div className="display flex">
                                <span className="font-bold">uk</span>
                                <PlayButton
                                    onClick={() => {
                                        speak(example.originalText, "en-GB");
                                    }}
                                />
                                <span className="font-bold">us</span>
                                <PlayButton
                                    onClick={() => {
                                        speak(example.originalText, "en-US");
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
        </>
    );
};

export default DictionaryExamples;
