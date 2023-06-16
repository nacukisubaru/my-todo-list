import { FC } from "react";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import ArrowButton from "../../../../ui/Buttons/ArrowButton/ArrowButton";
import TranslateButton from "../../ui/Buttons/TranslateButton";

interface IDictionaryExamplesProps {
    examplesList: IDictionaryExample[];
    translateExampleLang: string;
    showTranslate: (example: IDictionaryExample, isShow: boolean) => void;
    translate: (example: IDictionaryExample) => void;
}

const DictionaryExamples: FC<IDictionaryExamplesProps> = ({
    examplesList,
    translateExampleLang,
    showTranslate,
    translate,
}) => {
    const { speak } = useSpeechSynthesis();

    return (
        <>
            {examplesList &&
                examplesList.map((example) => {
                    return (
                        <div className="display flex justify-between">
                            <div>
                                <div className="break-words w-[33vh]">
                                    <div className="display flex">
                                        <div>
                                            {example.translatedText && (
                                                <ArrowButton
                                                    onClick={(isShow) => {
                                                        showTranslate(example, isShow);
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className={`w-[33vh] ${!example.translatedText && 'ml-[5px]'}`}>
                                            {example.originalText}
                                            {!example.translatedText && (
                                                <TranslateButton
                                                    onClick={() => {
                                                        translate(example);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {example.translatedText &&
                                    example.showTranslate && (
                                        <>
                                            <div className="display flex">
                                                <div className="ml-[12px]">{example.translatedText}</div>
                                                <PlayButton
                                                    onClick={() => {
                                                        speak(
                                                            example.translatedText,
                                                            translateExampleLang
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </>
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
