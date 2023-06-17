import { FC } from "react";
import Modal from "../../../../ui/Modal/Modal";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import DictionaryExamples from "./DictionaryExamples";
import { useDictionaryExample } from "../../hooks/useDictionaryExample";
import Divider from "../../../../ui/Dividers/Divider";

interface IDictionaryCardProps {
    props: IDictionary;
    closeCard: () => void;
}

const DictionaryCard: FC<IDictionaryCardProps> = ({ props, closeCard }) => {
    const {
        originalWord,
        translatedWord,
        languageOriginal,
        languageTranslation,
    } = props;

    const { speak } = useSpeechSynthesis();
    const {translate, showTranslte, translateExampleLang, examples} = useDictionaryExample(props);

    return (
        <Modal
            modalSettings={{
                title: originalWord,
                oppositeTitle: (
                    <PlayButton
                        onClick={() => {
                            speak(originalWord, languageOriginal);
                        }}
                    />
                ),
                primaryBtnName: "",
                secondaryBtnName: "",
                showButtons: false,
                isVisible: true,
                showUpperButtons: true,
            }}
            callbacks={{
                primaryBtnClick: () => {},
                secondaryBtnClick: () => {
                    closeCard();
                },
            }}
            maxWidth="sm:max-w-[32rem]"
        >
            <div className="display flex justify-between">
                <div className="font-bold">{translatedWord}</div>
                <PlayButton
                    onClick={() => {
                        speak(translatedWord, languageTranslation);
                    }}
                />
            </div>
            <div className="display flex">
                {languageOriginal}&#8594;
                {languageTranslation}
            </div>
            <Divider />
            <div className="text-left">
                <div className="font-bold">Примеры</div>
                <DictionaryExamples
                    examplesList={examples.filter((example) => {
                        if (example.exampleType === "example") {
                            return example;
                        }
                    })}
                    showTranslate={showTranslte}
                    translate={translate}
                    translateExampleLang={translateExampleLang}
                />
                <div className="font-bold">синонимы</div>
                <DictionaryExamples
                    examplesList={examples.filter((example) => {
                        if (example.exampleType === "synonym") {
                            return example;
                        }
                    })}
                    showTranslate={showTranslte}
                    translate={translate}
                    translateExampleLang={translateExampleLang}
                    quantityExamplesOnPage={2}
                />
                <div className="font-bold">антонимы</div>
                <DictionaryExamples
                    examplesList={examples.filter((example) => {
                        if (example.exampleType === "antonym") {
                            return example;
                        }
                    })}
                    showTranslate={showTranslte}
                    translate={translate}
                    translateExampleLang={translateExampleLang}
                    quantityExamplesOnPage={2}
                />
            </div>
        </Modal>
    );
};

export default DictionaryCard;
