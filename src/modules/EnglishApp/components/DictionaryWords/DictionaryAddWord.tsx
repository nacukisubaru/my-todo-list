import { FC, useEffect, useState } from "react";
import Modal from "../../../../ui/Modal/Modal";
import { useDispatch } from "react-redux";
import { translateWord } from "../../store/services/dictionary/dictionary.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useAction";
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";
import { generateCryptId } from "../../../../helpers/stringHelper";

interface IDictionaryAddWordProps {
    isVisible: boolean;
    closeAddWord: () => void;
}

const DictionaryAddWord: FC<IDictionaryAddWordProps> = ({
    isVisible,
    closeAddWord,
}) => {
    const [word, setWord] = useState("");
    const dispatch = useDispatch();
    const { resetTranslateResult, addWord } = useActions();
    const [createWord] = dictionaryApi.useAddMutation();

    const { translateResult } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const translate = () => {
        if (translateResult.translatedWord) {
            const wordObj: IDictionary = {
                originalWord: translateResult.originalWord,
                translatedWord: translateResult.translatedWord,
                languageOriginal: "ru",
                languageTranslation: "en",
                isStudy: true,
                id: ""
            };

            wordObj.id = generateCryptId(wordObj);
            createWord(wordObj);
            addWord(wordObj);
        } else {
            if (word) {
               dispatch(translateWord({ word, targetLang: "en" }));
            }
        }
    };

    const closeModalAddWord = () => {
        resetTranslateResult();
        setWord("");
        closeAddWord();
    };

    useEffect(() => {
        if (translateResult.translatedWord) {
            setWord(translateResult.translatedWord);
        }
    }, [translateResult.translatedWord])

    return (
        <Modal
            modalSettings={{
                title: translateResult.originalWord ? translateResult.originalWord : "Новое слово",
                primaryBtnName: translateResult.translatedWord ? "Выучить" : "Перевести",
                secondaryBtnName: "Отмена",
                isVisible,
            }}
            callbacks={{
                primaryBtnClick: translate,
                secondaryBtnClick: closeModalAddWord,
            }}
        >
            <input
                id="addWord"
                name="addWord"
                type="text"
                value={word}
                onChange={(e) => {
                    setWord(e.target.value);
                }}
                className="block w-full px-[11px] rounded-md border-0 py-1.5 
            text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
            focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
        </Modal>
    );
};

export default DictionaryAddWord;
