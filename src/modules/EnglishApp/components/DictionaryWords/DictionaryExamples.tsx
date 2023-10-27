import { FC, useEffect, useState } from "react";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import ArrowButton from "../../../../ui/Buttons/ArrowButton/ArrowButton";
import TranslateButton from "../../ui/Buttons/TranslateButton";

interface IDictionaryExamplesProps {
    examplesList: IDictionaryExample[];
    translateExampleLang: string;
    quantityExamplesOnPage?: number;
    showTranslate: (example: IDictionaryExample, isShow: boolean) => void;
    translate: (example: IDictionaryExample) => void;
}

const DictionaryExamples: FC<IDictionaryExamplesProps> = ({
    examplesList,
    translateExampleLang,
    quantityExamplesOnPage = 5,
    showTranslate,
    translate,
}) => {
    const { speak } = useSpeechSynthesis();
    const [showMoreInc, setShowMoreInc] = useState(quantityExamplesOnPage);
    const [exampleListLength, setExampleListLength] = useState(0);
    const [isEndExampleList, setEndExampleList] = useState(false);

    const showMore = () => {
        setShowMoreInc(showMoreInc + quantityExamplesOnPage);
        const listLength = examplesList.slice(0, showMoreInc + quantityExamplesOnPage).length;
        setExampleListLength(listLength);
        if (listLength === exampleListLength) {
            setEndExampleList(true);
        }
    }

    useEffect(() => {
        console.log({examplesList});
    },[]);

    return (
        <div>
            {examplesList &&
                examplesList.slice(0, showMoreInc).map((example) => {
                    return (
                        <div className="display flex justify-between">
                            <div>
                                <div className="break-words w-[33vh]">
                                    <div className="display flex">
                                        <div>
                                            {example.translatedText && (
                                                <ArrowButton
                                                    onClick={(isShow) => {
                                                        showTranslate(
                                                            example,
                                                            isShow
                                                        );
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div
                                            className={`w-[33vh] ${
                                                !example.translatedText &&
                                                "ml-[5px]"
                                            }`}
                                        >
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
                                                <div className="ml-[12px]">
                                                    {example.translatedText}
                                                </div>
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
                {!isEndExampleList && (
                    <a className="cursor-pointer" onClick={showMore}>показать еще</a>
                )}
        </div>
    );
};

export default DictionaryExamples;
