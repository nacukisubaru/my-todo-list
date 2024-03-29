import { FC } from "react";
import Modal from "../../../../ui/Modal/Modal";
import DictionaryLanguages from "../DictionaryWords/DictionaryLanguages";
import CheckBoxDefault from "../../../../ui/CheckBox/CheckBoxDefault";
import BasicButton from "../../../../ui/Buttons/BasicButton/BasicButton";
import { useFilter } from "../../hooks/useFilter";
import { useAppSelector } from "../../hooks/useAppSelector";

interface IFilterProps {
    isVisible: boolean;
    close: () => void;
}

const Filter: FC<IFilterProps> = ({ isVisible, close }) => {
    const {
        selectOriginalLang,
        selectTranslationLang,
        filtrate,
        setDictionaryFilter,
        filterDictionary,
    } = useFilter();

    const { dictionarySettings } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const checkBeingStudied = (isChecked: boolean) => {
        let studyStage: studyStageType = "BEING_STUDIED";
        changeStudyStage(studyStage, isChecked);
    };

    const checkStudied = (isChecked: boolean) => {
        let studyStage: studyStageType = "STUDIED";
        changeStudyStage(studyStage, isChecked);
    };

    const changeStudyStage = (
        studyStage: studyStageType,
        isChecked: boolean
    ) => {
        if (filterDictionary.studyStage) {
            const cloneFilter = Object.assign({}, filterDictionary);
            if (cloneFilter.studyStage) {
                let studyStages: studyStageType[] = cloneFilter.studyStage.map(
                    (stage: studyStageType) => stage
                );
                if (isChecked) {
                    studyStages.push(studyStage);
                } else {
                    studyStages = studyStages.filter((stage) => {
                        if (stage !== studyStage) {
                            return stage;
                        }
                    });
                }

                console.log({ studyStages });
                setDictionaryFilter({
                    ...filterDictionary,
                    studyStage: studyStages,
                });
            }
        }
    };

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
                    <div className="mt-[15px] mb-[15px]">
                        <div className=" mb-[20px]">
                            <DictionaryLanguages
                                selectLang={selectOriginalLang}
                                placeholder="Выберите язык оригинала"
                                multi={true}
                                defaultValue={filterDictionary.languageOriginal}
                                options={dictionarySettings.langsForStudy}
                            ></DictionaryLanguages>
                        </div>
                        <div className="w-[20vh]">
                            <DictionaryLanguages
                                selectLang={selectTranslationLang}
                                placeholder="Выберите язык перевода"
                                multi={true}
                                defaultValue={filterDictionary.languageTranslation}
                                options={dictionarySettings.studyLangs}
                            ></DictionaryLanguages>
                        </div>
                    </div>
                    <CheckBoxDefault
                        label="На изучении"
                        onChange={checkBeingStudied}
                        checked={filterDictionary.studyStage?.includes(
                            "BEING_STUDIED"
                        )}
                    />
                    <CheckBoxDefault
                        label="Изучено"
                        onChange={checkStudied}
                        checked={filterDictionary.studyStage?.includes(
                            "STUDIED"
                        )}
                    />
                    <div className="display flex justify-end">
                        <BasicButton
                            name="Применить"
                            color="primary"
                            onClick={() => {
                                filtrate();
                            }}
                        />
                    </div>
                </Modal>
            )}
        </>
    );
};

export default Filter;
