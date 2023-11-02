import { useState } from "react";
import { getExamplesByWord } from "../api/dictionaryapi";
import { dictionaryApi } from "../store/services/dictionary/dictionary.api";
import { useActions } from "./useAction";
import { useAppSelector } from "./useAppSelector";

export const useDictionaryExample = (dictionary: IDictionary) => {
    const dictionaryList: IDictionary[] = useAppSelector(state => state.dictionaryReducer.dictionary);
    const {setDictionary} = useActions();
    const [translateAndAdd] = dictionaryApi.useCreateExampleAndTranslateMutation();
    const {id, originalWord, translatedWord, dictionaryExamples, languageTranslation, languageOriginal} = dictionary;
    const [examples, setExamples] = useState<IDictionaryExample[]>([]);
    const [translateExampleLang, setLanguageTranslateExample] = useState("");

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

        let targetLanguageCode = '';
        if (languageTranslation !== 'en') {
            targetLanguageCode = languageTranslation;
        } else {
            targetLanguageCode = languageOriginal;
        }

        setLanguageTranslateExample(targetLanguageCode);
    };

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

        let translateResult: any = await translateAndAdd({
            dictionaryId: id,
            text: example.originalText,
            targetLanguageCode: translateExampleLang,
            type: example.exampleType ? example.exampleType : ''
        });
       
        if (translateResult && translateResult.data) {
           newExample.translatedText = translateResult.data.translatedWord;
        }

        if (newExample.translatedText) {
            const cloneDictionary = dictionaryList.map((word) => {
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

    return {mutateExample, translate, showTranslte, getExamples, translateExampleLang, examples}
}
