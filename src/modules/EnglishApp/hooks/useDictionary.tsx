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
    const { translateResult, dictionarySettings } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const {
        addWord,
        resetDictionaryFilter,
        resetDictionary,
    } = useActions();
    
    const dispatch = useDispatch();
    const { checkApplyFilter } = useFilter();
    const [createWord] = dictionaryApi.useAddMutation();

    const [word, setWord] = useState("");
    const [targetLang, setTargetLang] = useState("");
    const [isAddWord, setAddWord] = useState(false);
    const [inputTranslation, setInputTranslation] = useState("");
    const [inputOriginal, setInputOriginal] = useState("");
    const [originalLang, setOriginalLang] = useState("");
    const [translateLang, setTranslatelLang] = useState("");

    const addNewWord = async (wordObj?: IDictionary) => {
        if (!wordObj) {
            wordObj = {
                originalWord: isAddWord
                    ? inputOriginal
                    : translateResult.originalWord,
                translatedWord: isAddWord
                    ? inputTranslation
                    : translateResult.translatedWord,
                languageOriginal: isAddWord
                    ? originalLang
                    : translateResult.textLang,
                languageTranslation: isAddWord ? translateLang : targetLang,
                studyStage: "NOT_STUDIED",
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
            translate(word, targetLang);
        }
    };

    const translate = (word: string, targetLang: string) => {
        if (word && targetLang) {
            dispatch(translateWord({ word, targetLang }));
        }
    };

    const selectTargetLang = async (lang: ILanguage[]) => {
        if (lang.length) {
            const langCode: string = lang[0].code;
            if (langCode && targetLang !== langCode) {
                setTargetLang(langCode);
            }

            if (targetLang !== "") {
                translate(translateResult.originalWord, langCode);
            }
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

    useEffect(() => {
        if (dictionarySettings.targetLanguage !== "") {
            setTargetLang(dictionarySettings.targetLanguage);
        }
    }, [dictionarySettings.targetLanguage]);

    return {
        addNewWord,
        translateOrAddWord,
        translate,
        setAddWordWithoutTranslate,
        selectOriginalLang,
        selectTargetLang,
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
        targetLang,
        isAddWord,
        originalLang,
        translateLang
    };
};
