import { FC } from "react";
import Modal from "../../../../ui/Modal/Modal";
import DictionaryLanguages from "../DictionaryWords/DictionaryLanguages";
import CheckBoxDefault from "../../../../ui/CheckBox/CheckBoxDefault";
import BasicButton from "../../../../ui/Buttons/BasicButton/BasicButton";
import { useFilter } from "../../hooks/useFilter";

interface IFilterProps {
    isVisible: boolean;
    close: () => void;
}

const Filter: FC<IFilterProps> = ({ isVisible, close }) => {
    const {selectOriginalLang, selectTranslationLang, filtrate, filterDictionary} = useFilter();

    return (
        <>
            {isVisible && (
                <Modal
                    modalSettings={{
                        title: "Фильтр",
                        primaryBtnName: "",
                        secondaryBtnName: "",
                        showButtons: false,
                        isVisible: true,
                        showUpperButtons: true,
                    }}
                    callbacks={{
                        primaryBtnClick: () => {},
                        secondaryBtnClick: close,
                    }}
                    maxWidth="sm:max-w-[32rem]"
                >
                    <div className="display flex justify-between mb-[20px]">
                        <div className="w-[20vh]">
                            <DictionaryLanguages
                                selectLang={selectOriginalLang}
                                placeholder="Выберите язык оригинала"
                                multi={true}
                                defaultValue={filterDictionary.languageOriginal && filterDictionary.languageOriginal.map(lang => lang.isoName)}
                            ></DictionaryLanguages>
                        </div>
                        <div className="w-[20vh]">
                            <DictionaryLanguages
                                selectLang={selectTranslationLang}
                                placeholder="Выберите язык перевода"
                                multi={true}
                                defaultValue={filterDictionary.languageTranslation && filterDictionary.languageTranslation.map(lang => lang.isoName)}
                            ></DictionaryLanguages>
                        </div>
                    </div>
                    <CheckBoxDefault label="Не изучается"/>
                    <CheckBoxDefault label="На изучении"/>
                    <CheckBoxDefault label="Изучено"/>
                    <div className="display flex justify-end">
                        <BasicButton
                            name="Применить"
                            color="primary"
                            onClick={() => {filtrate()}}
                        />
                    </div>
                </Modal>
            )}
        </>
    );
};

export default Filter;
