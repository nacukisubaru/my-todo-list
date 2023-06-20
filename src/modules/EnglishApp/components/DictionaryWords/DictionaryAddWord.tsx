import { FC, useEffect, useState } from "react";
import Modal from "../../../../ui/Modal/Modal";
import { useDispatch } from "react-redux";
import {
    getDictionaryByUser,
    translateWord,
} from "../../store/services/dictionary/dictionary.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useAction";
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";
import { generateCryptId } from "../../../../helpers/stringHelper";
import DictionaryLanguages from "./DictionaryLanguages";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import SmallOutlineButton from "../../../../ui/Buttons/SmallOutlineButton";
import InputField from "../../../../ui/Inputs/InputField";
import { useFilter } from "../../hooks/useFilter";

interface IDictionaryAddWordProps {
    isVisible: boolean;
    closeAddWord: () => void;
}

const DictionaryAddWord: FC<IDictionaryAddWordProps> = ({
    isVisible,
    closeAddWord,
}) => {
    const { dictionarySettings } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const [word, setWord] = useState("");
    const [targetLang, setTargetLang] = useState("");
    const [isAddWord, setAddWord] = useState(false);
    const [inputTranslation, setInputTranslation] = useState("");
    const [inputOriginal, setInputOriginal] = useState("");
    const [originalLang, setOriginalLang] =  useState("");
    const [translateLang, setTranslatelLang] =  useState("");

    const dispatch = useDispatch();
    const {
        resetTranslateResult,
        addWord,
        resetDictionaryFilter,
        resetDictionary,
    } = useActions();
    const [createWord] = dictionaryApi.useAddMutation();

    const { translateResult } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const { speak } = useSpeechSynthesis();
    const {checkApplyFilter} = useFilter();

    const translateOrAddWord = async () => {
        if (translateResult.translatedWord) {
            addNewWord();
        } else {
            translate(word, targetLang);
        }
    };

    const addNewWord = async () => {
        const wordObj: IDictionary = {
            originalWord: isAddWord
                ? inputOriginal
                : translateResult.originalWord,
            translatedWord: isAddWord
                ? inputTranslation
                : translateResult.translatedWord,
            languageOriginal: isAddWord ? originalLang : translateResult.textLang,
            languageTranslation: isAddWord ? translateLang : targetLang,
            studyStage: "NOT_STUDIED",
            id: "",
            dictionaryExamples: [],
        };

        const filterIsApply = checkApplyFilter();
        if (filterIsApply) {
            await resetDictionary();
            await resetDictionaryFilter();
            await dispatch(getDictionaryByUser({ page: 0 }));
        }

        const {originalWord, translatedWord, languageOriginal, languageTranslation} = wordObj;

        if (originalWord && translatedWord && languageOriginal && languageTranslation) {
            wordObj.id = generateCryptId(wordObj);
            createWord(wordObj);
            addWord(wordObj);
        }
    };

    const translate = (word: string, targetLang: string) => {
        if (word && targetLang) {
            dispatch(translateWord({ word, targetLang }));
        }
    };

    const closeModalAddWord = () => {
        resetTranslateResult();
        setWord("");
        closeAddWord();
        setAddWord(false);
        setInputOriginal("");
        setInputTranslation("");
        setOriginalLang("");
        setTranslatelLang("");
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
    }

    const selectTranslateLang = (lang: ILanguage[]) => {
        if (lang.length) {
            const langCode: string = lang[0].code;
            if (langCode) {
                setTranslatelLang(langCode);
            }
        }
    }

    const setAddWordWithoutTranslate = () => {
        if (isAddWord) {
            setAddWord(false);
        } else {
            setAddWord(true);
        }
    };

    return (
        <Modal
            modalSettings={{
                title: isAddWord ? 'Добавить новое слово' : translateResult.originalWord
                    ? translateResult.originalWord
                    : "Новое слово",
                primaryBtnName: isAddWord
                    ? "Добавить"
                    : translateResult.translatedWord
                    ? "Выучить"
                    : "Перевести",
                secondaryBtnName: "Отмена",
                isVisible,
            }}
            callbacks={{
                primaryBtnClick: isAddWord ? addNewWord : translateOrAddWord,
                secondaryBtnClick: closeModalAddWord,
            }}
            maxWidth="sm:max-w-[32rem]"
        >
            <div className="display flex">
                {isAddWord ? (
                    <>
                        <InputField
                            id="addWordOriginal"
                            onChange={(e) => {
                                setInputOriginal(e.target.value);
                            }}
                            value={inputOriginal}
                            placeholder="Введите слово в оригинале"
                        />
                        <div className="w-[125px] ml-[5px]">
                            <DictionaryLanguages
                                selectLang={selectOriginalLang}
                                placeholder="Оригинал"
                                style={{ height: "36px" }}
                            />
                        </div>
                    </>
                ) : (
                    <InputField
                        id="addWord"
                        onChange={(e) => {
                            setWord(e.target.value);
                        }}
                        value={word}
                        placeholder="Введите слово в оригинале"
                    />
                )}

                <>
                    {!isAddWord && (
                        <>
                            {targetLang === "en" ? (
                                <div className="display flex ml-[11px]">
                                    <span>uk</span>
                                    <PlayButton
                                        onClick={() => {
                                            speak(word, "en-GB");
                                        }}
                                    />
                                    <span>us</span>
                                    <PlayButton
                                        onClick={() => {
                                            speak(word, "en-US");
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="ml-[11px]">
                                    <PlayButton
                                        onClick={() => {
                                            speak(word, targetLang);
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </>
            </div>
            {isAddWord && (
                <>
                    <div className="display flex">
                        <InputField
                            id="addSelfWord"
                            onChange={(e) => {
                                setInputTranslation(e.target.value);
                            }}
                            value={inputTranslation}
                            placeholder="Введите слово перевода"
                        />
                        <div className="w-[125px] ml-[5px]">
                            <DictionaryLanguages
                                selectLang={selectTranslateLang}
                                placeholder="Перевод"
                                style={{ height: "36px" }}
                            />
                        </div>
                    </div>
                </>
            )}

            {!isAddWord && (
                <DictionaryLanguages
                    selectLang={selectTargetLang}
                    defaultLang={dictionarySettings.targetLanguage}
                />
            )}

            <div className="mt-[11px] text-left">
                <SmallOutlineButton onClick={setAddWordWithoutTranslate}>
                    {isAddWord ? "Вернутся к переводу" : "Добавить слово"}
                </SmallOutlineButton>
            </div>
        </Modal>
    );
};

export default DictionaryAddWord;
