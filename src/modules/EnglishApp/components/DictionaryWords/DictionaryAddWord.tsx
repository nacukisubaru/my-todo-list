import { FC, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useAction";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import Modal from "../../../../ui/Modal/Modal";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import SmallOutlineButton from "../../../../ui/Buttons/SmallOutlineButton";
import InputField from "../../../../ui/Inputs/InputField";
import { useDictionary } from "../../hooks/useDictionary";
import SnackBar from "../../../../ui/SnackBars/SnackBar";
import { Button } from "@mui/material";
import Settings from "../Settings/Settings";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowWithText from "../../../../ui/Buttons/ArrowButton/ArrowWithText";
import WordsPanel from "../WordsTagsPanel/WordsPanel";
import { uniqueList } from "../../../../helpers/arrayHelper";

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
        setInputOriginal,
        setInputTranslation,
        setWord,
        setAddWord,
        setOriginalLang,
        setTranslatelLang,
        setVoiceWordSettings,
        setTransltionWord,
        inputOriginal,
        inputTranslation,
        word,
        isAddWord,
        voiceWordSettings,
    } = useDictionary();

    const { translateResult, translateLanguages, translateMethod, error } =
        useAppSelector((state) => state.dictionaryReducer);
    const {
        resetTranslateResult,
        changeTranslateLanguages,
        changeTranslateMethod,
    } = useActions();
    const { speak } = useSpeechSynthesis();

    const [openModalSettings, setOpenModalSettings] = useState(false);
    const openSettings = () => {
        setOpenModalSettings(true);
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
        setVoiceWordSettings({ voiceLang: "", voiceWord: "" });
    };

    const closeSettings = () => {
        setOpenModalSettings(false);
    };

    const backToTranslate = () => {
        resetTranslateResult();
        setWord("");
        setAddWord(false);
        setInputOriginal("");
        setInputTranslation("");
        setOriginalLang("");
        setTranslatelLang("");
        setVoiceWordSettings({ voiceLang: "", voiceWord: "" });
    };

    const changeLanguage = () => {
        changeTranslateLanguages();
    };

    const changeTranslate = () => {
        changeTranslateMethod();
    };

    const choiceTranslationWord = (word: string) => {
        setWord(word);
        setTransltionWord(word);
    };

    return (
        <>
            <SnackBar isOpen={error.message ? true : false} type={"error"}>
                {error.message}
                {error.errorCode &&
                error.errorCode === "settingsNotSupportLang" ? (
                    <Button variant="outlined" color="error">
                        Перейти к настройкам
                    </Button>
                ) : (
                    ""
                )}
            </SnackBar>
            <Modal
                modalSettings={{
                    title: isAddWord
                        ? "Добавить новое слово"
                        : translateResult.originalWord
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
                    primaryBtnClick: () => {
                        isAddWord ? addNewWord() : translateOrAddWord();
                    },
                    secondaryBtnClick: closeModalAddWord,
                }}
                maxWidth="sm:max-w-[32rem]"
            >
                <div className="text-left">
                    <div className="mb-[15px]">
                    {translateResult.wordsList &&
                        translateResult.wordsList.length && (
                            <>
                                <ArrowWithText
                                    onClick={() => {}}
                                    content={
                                        <>
                                            {translateResult.wordsList.length && (
                                                <WordsPanel 
                                                    wordsList={translateResult.wordsList} 
                                                    tabs={uniqueList(
                                                        translateResult.wordsList
                                                            .map((word) => word.type)
                                                            .filter((type) => type !== "transcription")
                                                    )} 
                                                    selectTag={choiceTranslationWord} 
                                                />
                                            )}
                                       </>
                                    }
                                >
                                    Список значений
                                </ArrowWithText>
                            </>
                        )}
                        </div>
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
                            {!isAddWord && voiceWordSettings.voiceLang && (
                                <>
                                    {voiceWordSettings.voiceLang === "en" ? (
                                        <div className="display flex ml-[11px]">
                                            <span>uk</span>
                                            <PlayButton
                                                onClick={() => {
                                                    speak(
                                                        voiceWordSettings.voiceWord,
                                                        "en-GB"
                                                    );
                                                }}
                                            />
                                            <span>us</span>
                                            <PlayButton
                                                onClick={() => {
                                                    speak(
                                                        voiceWordSettings.voiceWord,
                                                        "en-US"
                                                    );
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="ml-[11px]">
                                            <PlayButton
                                                onClick={() => {
                                                    speak(
                                                        voiceWordSettings.voiceWord,
                                                        voiceWordSettings.voiceLang
                                                    );
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
                            </div>
                        </>
                    )}

                    <div className="mt-[11px] text-left display flex justify-between">
                        <div className="display flex">
                            {translateResult.translatedWord && !isAddWord && (
                                <div className="mr-[14px]">
                                    <SmallOutlineButton
                                        onClick={backToTranslate}
                                    >
                                        Назад
                                    </SmallOutlineButton>
                                </div>
                            )}
                            <div>
                                <SmallOutlineButton
                                    onClick={setAddWordWithoutTranslate}
                                >
                                    {isAddWord
                                        ? "Вернутся к переводу"
                                        : "Добавить"}
                                </SmallOutlineButton>
                            </div>
                        </div>
                        <div className="display flex">
                            <Button
                                variant="text"
                                style={{
                                    marginTop: "-6px",
                                    color: "black",
                                    outline: "none",
                                    maxWidth: "30px",
                                    maxHeight: "30px",
                                    minWidth: "30px",
                                    minHeight: "30px",
                                    marginRight: "8px",
                                }}
                                onClick={changeTranslate}
                            >
                                {translateMethod === "lingvo" ? "L" : "Y"}
                            </Button>
                            <Button
                                variant="text"
                                style={{
                                    marginTop: "-6px",
                                    color: "black",
                                    outline: "none",
                                    maxWidth: "30px",
                                    maxHeight: "30px",
                                    minWidth: "30px",
                                    minHeight: "30px",
                                    marginRight: "8px",
                                }}
                                onClick={changeLanguage}
                            >
                                {translateLanguages[0] +
                                    " " +
                                    translateLanguages[1]}
                            </Button>
                            <div
                                className="-mt-[5px] cursor-pointer"
                                onClick={openSettings}
                            >
                                <SettingsIcon style={{ color: "grey" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Settings close={closeSettings} isOpen={openModalSettings}></Settings>
        </>
    );
};

export default DictionaryAddWord;
