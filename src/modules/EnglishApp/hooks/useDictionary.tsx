import {
    getDictionaryByUser,
    translateWord,
} from "../store/services/dictionary/dictionary.slice";
import { useActions } from "./useAction";
import { useFilter } from "./useFilter";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./useAppSelector";
import { dictionaryApi } from "../store/services/dictionary/dictionary.api";
import { generateCryptId } from "../../../helpers/stringHelper";

export const useDictionary = () => {
    const { translateResult, translateLanguages, translateMethod } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const {
        addWord,
        resetDictionaryFilter,
        resetDictionary
    } = useActions();
    
    const dispatch = useAppDispatch();
    const { checkApplyFilter } = useFilter();
    const [createWord] = dictionaryApi.useAddMutation();

    const [word, setWord] = useState("");
    const [isAddWord, setAddWord] = useState(false);
    const [inputTranslation, setInputTranslation] = useState("");
    const [inputOriginal, setInputOriginal] = useState("");
    const [originalLang, setOriginalLang] = useState("");
    const [translateLang, setTranslatelLang] = useState("");
    const [voiceWordSettings, setVoiceWordSettings] = useState({voiceWord: '', voiceLang: ''});
    const { dictionaryActiveSettings } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const [translationWord, setTransltionWord] = useState("");

    useEffect(() => {
        if (translateResult.translatedWord) {
            setTransltionWord(translateResult.translatedWord);
        }
    }, [translateResult.translatedWord])

    const [createLinkedWords] = dictionaryApi.useCreateLinkedWordMutation();

    useEffect(() => {
        
        if (translateResult.translateLang && translateResult.originalLang) {
            let voiceWord = translateResult.translatedWord;
            let voiceLang = translateResult.translateLang;

            if (dictionaryActiveSettings.sourceLanguage !== translateResult.originalLang) {
                voiceWord = translateResult.originalWord;       
                voiceLang = translateResult.originalLang;
            }
            
            setVoiceWordSettings({voiceWord, voiceLang});
        }
    }, [translateResult]);

    const addNewWord = async () => {
        let sourceWord = translateResult.originalWord;
        let targetWord = word;

        if (dictionaryActiveSettings.sourceLanguage !== translateResult.originalLang) {
            sourceWord = word;
            targetWord = translateResult.originalWord;
        }
        
        const wordObj: IDictionary = {
            originalWord: isAddWord
                ? inputOriginal
                : sourceWord,
            translatedWord: isAddWord
                ? inputTranslation
                : targetWord,
            languageOriginal: dictionaryActiveSettings.sourceLanguage,
            languageTranslation: dictionaryActiveSettings.targetLanguage,
            studyStage: "BEING_STUDIED",
            id: "",
            dictionaryExamples: [],
            transcription: translateResult.transcription
        };

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
            if (translationWord) {
                wordObj.dictionaryLinkedWords = [{word: translationWord}];
            }

            await addWord(wordObj);
            await createWord(wordObj);
            
            if (translationWord) {
                createLinkedWords({
                    dictionaryId: wordObj.id,
                    words: [translationWord],
                })
            }
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
            dispatch(translateWord({ 
                word, 
                sourceLang: translateLanguages[0], 
                targetLang: translateLanguages[1], 
                translateMethod 
            }));
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
        setVoiceWordSettings,
        setTransltionWord,
        translationWord,
        inputOriginal,
        inputTranslation,
        word,
        voiceWordSettings,
        isAddWord,
        originalLang,
        translateLang
    };
};
