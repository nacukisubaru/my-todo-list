import { FC, useRef } from "react";
import Modal from "../../../../ui/Modal/Modal";
import InputField from "../../../../ui/Inputs/InputField";

interface IDictionaryAddWordProps {
    isVisible: boolean;
    closeAddWord: () => void;
}

const DictionaryAddWord: FC<IDictionaryAddWordProps> = ({
    isVisible,
    closeAddWord,
}) => {
    const ref = useRef();
    const translateWord = () => {};

    return (
        <Modal
            modalSettings={{
                title: "Новое слово",
                primaryBtnName: "Перевести",
                secondaryBtnName: "Отмена",
                isVisible,
            }}
            callbacks={{
                primaryBtnClick: translateWord,
                secondaryBtnClick: closeAddWord,
            }}
        >
            <InputField id="addWord" name="addWord" type="text" ref={ref}/>
        </Modal>
    );
};

export default DictionaryAddWord;
