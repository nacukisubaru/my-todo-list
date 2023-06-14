import { FC, useEffect, useState } from "react";
import Modal from "../../../../ui/Modal/Modal";
import { getExamplesByWord } from "../../api/dictionaryapi";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import DictionaryExamples from "./DictionaryExamples";

interface IDictionaryCardProps {
    props: IDictionaryCard;
    closeCard: () => void;
}

const DictionaryCard: FC<IDictionaryCardProps> = ({ props, closeCard }) => {
    const { originalWord, translatedWord, orginalLang, translationLang } =
        props;

    const [examples, setExamples] = useState<IExample>({
        examples: [],
        synonyms: [],
        antonyms: [],
    });
    const { speak } = useSpeechSynthesis();

    useEffect(() => {
        const getExamples = async () => {
            let result = await getExamplesByWord(originalWord);
            if (!result.examples.length) {
                result = await getExamplesByWord(translatedWord);
            }

            setExamples(result);
        };

        getExamples();
    }, []);

    return (
        <Modal
            modalSettings={{
                title: originalWord,
                oppositeTitle: (
                    <PlayButton
                        onClick={() => {
                            speak(originalWord, orginalLang);
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
                        speak(translatedWord, translationLang);
                    }}
                />
            </div>
            <div className="display flex">
                {orginalLang}&#8594;
                {translationLang}
            </div>
            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-[10px] mt-[10px]" />
            <div className="text-left">
                <div className="font-bold">Примеры</div>
                <DictionaryExamples examplesList={examples.examples}/>
                <div className="font-bold">синонимы</div>
                <DictionaryExamples examplesList={examples.synonyms}/>
                <div className="font-bold">антонимы</div>
                <DictionaryExamples examplesList={examples.antonyms}/>
            </div>
        </Modal>
    );
};

export default DictionaryCard;
