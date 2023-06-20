import { FC } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useAction";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import DictionaryLanguages from "./DictionaryLanguages";
import Modal from "../../../../ui/Modal/Modal";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import SmallOutlineButton from "../../../../ui/Buttons/SmallOutlineButton";
import InputField from "../../../../ui/Inputs/InputField";

import { useDictionary } from "../../hooks/useDictionary";

interface IDictionaryAddWordProps {
    isVisible: boolean;
    closeAddWord: () => void;
}

const DictionaryAddWord: FC<IDictionaryAddWordProps> = ({
    isVisible,
    closeAddWord,
}) => {

    const {
        addNewWord,
        translateOrAddWord,
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
    } = useDictionary();
    
    const { dictionarySettings } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const { translateResult } = useAppSelector(
        (state) => state.dictionaryReducer
    );


    const {
        resetTranslateResult,
    } = useActions();
    const { speak } = useSpeechSynthesis();


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
