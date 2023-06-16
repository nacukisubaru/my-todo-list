import { FC, useEffect, useState } from "react";
import Modal from "../../../../ui/Modal/Modal";
import { getExamplesByWord } from "../../api/dictionaryapi";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import DictionaryExamples from "./DictionaryExamples";
import { useActions } from "../../hooks/useAction";
import { useAppSelector } from "../../hooks/useAppSelector";
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";

interface IDictionaryCardProps {
    props: IDictionary;
    closeCard: () => void;
}

const DictionaryCard: FC<IDictionaryCardProps> = ({ props, closeCard }) => {
    const {
        id,
        originalWord,
        translatedWord,
        languageOriginal,
        languageTranslation,
        dictionaryExamples,
    } = props;

    const [examples, setExamples] = useState<IDictionaryExample[]>([]);
    const { speak } = useSpeechSynthesis();
    const {setDictionary} = useActions();
    const {dictionary} = useAppSelector(state => state.dictionaryReducer);
    const [translateAndAdd] = dictionaryApi.useCreateExampleAndTranslateMutation();

    useEffect(() => {
        const getExamples = async () => {
            let result = await getExamplesByWord(originalWord);
            if (!result.length) {
                result = await getExamplesByWord(translatedWord);
            }

            const examplesList = dictionaryExamples.map((example) => {
                return example.originalText;
            });
           
            const resultList = result.filter((res) => {
                if (!examplesList.includes(res.originalText)) {
                    return res;
                }
            });
            
            setExamples(dictionaryExamples.concat(resultList));
        };

        getExamples();
    }, []);

    const mutateExample = (originalText: string, field: string, value: any) => {
        const cloneExamples = examples.map((example) => {
            return {...example};
        });

        cloneExamples.map((clone, key) => {
            if (clone.originalText === originalText) {
                const changableExample: any = cloneExamples;
                changableExample[key][field] = value;
            }
        });

        setExamples(cloneExamples);
    }

    const showTranslte = (example: IDictionaryExample, isShow: boolean) => {
        mutateExample(example.originalText, 'showTranslate', isShow);
    }

    const translate = async (example: IDictionaryExample) => {
        const newExample:IDictionaryExample = {
            originalText: example.originalText, translatedText: '', exampleType: example.exampleType,
            showTranslate: false
        };

        let targetLanguageCode = '';
        if (languageTranslation !== 'en') {
            targetLanguageCode = languageTranslation;
        } else {
            targetLanguageCode = languageOriginal;
        }

        let translateResult: any = await translateAndAdd({
            dictionaryId: id,
            text: example.originalText,
            targetLanguageCode,
            type: example.exampleType
        });
       
        if (translateResult && translateResult.data) {
           newExample.translatedText = translateResult.data.translatedWord;
        }

        if (newExample.translatedText) {
            const cloneDictionary = dictionary.map((word) => {
                return {...word};
            });

            cloneDictionary.map((clone, key) => {
                if (clone.id === id) {
                    cloneDictionary[key].dictionaryExamples = clone.dictionaryExamples.concat(newExample);
                }
            });

            mutateExample(example.originalText, 'translatedText', newExample.translatedText);
            setDictionary(cloneDictionary);
        }
    }

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
            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-[10px] mt-[10px]" />
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
                />
            </div>
        </Modal>
    );
};

export default DictionaryCard;
