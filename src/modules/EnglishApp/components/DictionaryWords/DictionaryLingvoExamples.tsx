import { FC, useEffect, useState } from "react";
import ArrowWithText from "../../../../ui/Buttons/ArrowButton/ArrowWithText";
import DictionaryExamples from "./DictionaryExamples";
import { getExamplesForWord } from "../../store/services/dictionary/dictionary.slice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";

interface IDictionaryLingvoExamplesProps {
    translatedWord: string,
    languageTranslation: string,
    languageOriginal: string,
    alwaysChangeExamples?: boolean
}

const DictionaryLingvoExamples: FC<IDictionaryLingvoExamplesProps> = ({
    translatedWord,
    languageTranslation,
    languageOriginal,
    alwaysChangeExamples = false
}) => {
    const { lingvoExamples } = useAppSelector((state) => state.dictionaryReducer);
    const [lingvoExamplesList, setLingvoExample] = useState<ILingvoExample[]>([]);
    const dispatch = useAppDispatch();
    
    const getExamplesFromLingvo = () => {
        dispatch(getExamplesForWord({
            word: translatedWord,
            sourceLang: languageTranslation,
            targetLang: 'ru',
            pageSize: 200
        }));
    }

    const showLingvoExample = (example: IDictionaryExample, isShow: boolean) => {
        const examples = lingvoExamplesList.map(lingvoExample => {
            if (lingvoExample.originalText === example.originalText) {
                return {...lingvoExample, showTranslate: isShow};
            } else {
                return {...lingvoExample, showTranslate: false};
            }
        });

        setLingvoExample(examples);
    }

    useEffect(() => {
        setLingvoExample(lingvoExamples);
    }, [lingvoExamples]);

    return (
        <ArrowWithText
            onClick={getExamplesFromLingvo}
            alwaysChangeContent={alwaysChangeExamples}
            content={
                lingvoExamples.length ? (
                    <DictionaryExamples
                        examplesList={lingvoExamplesList}
                        showTranslate={showLingvoExample}
                        translate={() =>{}}
                        languageOriginal={languageOriginal}
                        languageTranslation={languageTranslation}
                    />
                ) : (
                    false
                )
            }
        >
            Примеры из lingvo
        </ArrowWithText>
    );
};

export default DictionaryLingvoExamples;
