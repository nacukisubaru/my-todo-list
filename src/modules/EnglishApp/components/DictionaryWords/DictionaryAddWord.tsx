import { FC, useEffect, useState } from "react";
import Modal from "../../../../ui/Modal/Modal";
import { useDispatch } from "react-redux";
import { translateWord } from "../../store/services/dictionary/dictionary.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useAction";
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";
import { generateCryptId } from "../../../../helpers/stringHelper";
import DictionaryLanguages from "./DictionaryLanguages";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import PlayButton from "../../../../ui/Buttons/PlayButton";

interface IDictionaryAddWordProps {
    isVisible: boolean;
    closeAddWord: () => void;
}

const DictionaryAddWord: FC<IDictionaryAddWordProps> = ({
    isVisible,
    closeAddWord,
}) => {
    const {dictionarySettings} = useAppSelector(state=>state.dictionaryReducer);

    const [word, setWord] = useState("");
    const [targetLang, setTargetLang] = useState("");

    const dispatch = useDispatch();
    const { resetTranslateResult, addWord } = useActions();
    const [createWord] = dictionaryApi.useAddMutation();

    const { translateResult } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const {speak} = useSpeechSynthesis();

    const translateOrAddWord = () => {
        if (translateResult.translatedWord) {
            const wordObj: IDictionary = {
                originalWord: translateResult.originalWord,
                translatedWord: translateResult.translatedWord,
                languageOriginal: translateResult.textLang,
                languageTranslation: targetLang,
                isStudy: true,
                id: "",
                dictionaryExamples: []
            };

            wordObj.id = generateCryptId(wordObj);
            createWord(wordObj);
            addWord(wordObj);
        } else {
            translate(word, targetLang);
        }
    };

    const translate = (word: string, targetLang: string) => {
        if (word && targetLang) {
            dispatch(translateWord({ word, targetLang }));
        }
    }
    
    const closeModalAddWord = () => {
        resetTranslateResult();
        setWord("");
        closeAddWord();
    };

    useEffect(() => {
        if (translateResult.translatedWord) {
            setWord(translateResult.translatedWord);
        }
    }, [translateResult.translatedWord]);

    useEffect(() => {
        if (dictionarySettings.targetLanguage !== '') {
            setTargetLang(dictionarySettings.targetLanguage);
        }
    }, [dictionarySettings.targetLanguage])

    const selectTargetLang = async (lang: string) => {
        if (targetLang !== lang) {
            setTargetLang(lang);
        }

        if(targetLang !== "") {
            translate(translateResult.originalWord, lang);
        }      
    }

    return (
        <Modal
            modalSettings={{
                title: translateResult.originalWord ? translateResult.originalWord : "Новое слово",
                primaryBtnName: translateResult.translatedWord ? "Выучить" : "Перевести",
                secondaryBtnName: "Отмена",
                isVisible,
            }}
            callbacks={{
                primaryBtnClick: translateOrAddWord,
                secondaryBtnClick: closeModalAddWord,
            }}
            maxWidth="sm:max-w-[32rem]"
        >
            <div className="display flex">
                <input
                    id="addWord"
                    name="addWord"
                    type="text"
                    value={word}
                    onChange={(e) => {
                        setWord(e.target.value);
                    }}
                    className="col-sm block w-full px-[11px] rounded-md border-0 py-1.5 
                    text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
                    focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-[12px]"
                    disabled={translateResult.translatedWord ? true : false}
                />
                <>
                    {targetLang === "en" ? (
                        <div className="display flex ml-[11px]">
                            <span>uk</span>
                            <PlayButton onClick={() => {speak(word, 'en-GB')}}/>
                            <span>us</span>
                            <PlayButton onClick={() => {speak(word, 'en-US')}}/>
                        </div>
                    ) : (
                        <div className="ml-[11px]">
                            <PlayButton onClick={() => {speak(word, targetLang)}}/>
                        </div>
                    )}
                </>
            </div>
          
            <DictionaryLanguages selectLang={selectTargetLang} defaultLang={dictionarySettings.targetLanguage}/>
        </Modal>
    );
};

export default DictionaryAddWord;
