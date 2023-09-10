import { useDispatch } from "react-redux";
import {
    getDictionaryByUser,
    translateWord,
} from "../store/services/dictionary/dictionary.slice";
import { useActions } from "./useAction";
import { useFilter } from "./useFilter";
import { useEffect, useState } from "react";
import { useAppSelector } from "./useAppSelector";
import { dictionaryApi } from "../store/services/dictionary/dictionary.api";
import { generateCryptId } from "../../../helpers/stringHelper";

export const useDictionary = () => {
    const { translateResult } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const {
        addWord,
        resetDictionaryFilter,
        resetDictionary
    } = useActions();

    const dispatch = useDispatch();
    const { checkApplyFilter } = useFilter();
    const [createWord] = dictionaryApi.useAddMutation();

    const [word, setWord] = useState("");
    const [isAddWord, setAddWord] = useState(false);
    const [inputTranslation, setInputTranslation] = useState("");
    const [inputOriginal, setInputOriginal] = useState("");
    const [originalLang, setOriginalLang] = useState("");
    const [translateLang, setTranslatelLang] = useState("");
    const [translateSettings, setTranslateSettings] = useState({sourceWord: '', targetWord: '', sourceLang: '', targetLang: ''});
    const { dictionarySettings } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    useEffect(() => {
        let sourceWord = translateResult.originalWord;
        let targetWord = translateResult.translatedWord;

        let targetLang = translateResult.translateLang;
        let sourceLang = translateResult.originalLang;

        if (dictionarySettings.sourceLanguage !== translateResult.originalLang) {
          sourceWord = translateResult.translatedWord;
          targetWord = translateResult.originalWord;

          sourceLang = translateResult.translateLang;  
          targetLang = translateResult.originalLang;
        }
        
        setTranslateSettings({sourceWord, targetWord, sourceLang, targetLang});
    }, [translateResult]);

    const addNewWord = async (wordObj?: IDictionary) => {

        if (!wordObj) {
            wordObj = {
                originalWord: isAddWord
                    ? inputOriginal
                    : translateSettings.sourceWord,
                translatedWord: isAddWord
                    ? inputTranslation
                    : translateSettings.targetWord,
                languageOriginal: isAddWord
                    ? originalLang
                    : dictionarySettings.sourceLanguage,
                languageTranslation: isAddWord ? translateLang : dictionarySettings.targetLanguage,
                studyStage: "BEING_STUDIED",
                id: "",
                dictionaryExamples: [],
            };
        } 

        const filterIsApply = checkApplyFilter();
        if (filterIsApply) {
            await resetDictionary();
            await resetDictionaryFilter();
            await dispatch(getDictionaryByUser({ page: 0 }));
        }

        const {
            originalWord,
            translatedWord,
            languageOriginal,
            languageTranslation,
        } = wordObj;

        if (
            originalWord &&
            translatedWord &&
            languageOriginal &&
            languageTranslation
        ) {
            wordObj.id = generateCryptId(wordObj);
            createWord(wordObj);
            addWord(wordObj);
        }
    };

    const translateOrAddWord = async () => {
        if (translateResult.translatedWord) {
            addNewWord();
        } else {
            translate(word);
        }
    };

    const translate = (word: string) => {
        if (word) {
            dispatch(translateWord({ word }));
        }
    };

    const selectOriginalLang = (lang: ILanguage[]) => {
        if (lang.length) {
            const langCode: string = lang[0].code;
            if (langCode) {
                setOriginalLang(langCode);
            }
        }
    };

    const selectTranslateLang = (lang: ILanguage[]) => {
        if (lang.length) {
            const langCode: string = lang[0].code;
            if (langCode) {
                setTranslatelLang(langCode);
            }
        }
    };

    const setAddWordWithoutTranslate = () => {
        if (isAddWord) {
            setAddWord(false);
        } else {
            setAddWord(true);
        }
    };

    useEffect(() => {
        if (translateResult.translatedWord) {
            setWord(translateResult.translatedWord);
        }
    }, [translateResult.translatedWord]);

    return {
        addNewWord,
        translateOrAddWord,
        translate,
        setAddWordWithoutTranslate,
        selectOriginalLang,
        selectTranslateLang,
        setInputOriginal,
        setInputTranslation,
        setWord,
        setAddWord,
        setOriginalLang,
        setTranslatelLang,
        inputOriginal,
        inputTranslation,
        word,
        translateSettings,
        isAddWord,
        originalLang,
        translateLang
    };
};
