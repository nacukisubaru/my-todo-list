import { FC, useEffect, useState } from "react";
import Modal from "../../../../ui/Modal/Modal";
import DictionaryLanguages from "../DictionaryWords/DictionaryLanguages";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import { settingsApi } from "../../store/services/settings/settings.api";
import BasicSelect from "../../../../ui/Selects/BasicSelect";
import {
    getDictionaryActiveSettings,
    getDictionarySettings,
    getLanguages,
} from "../../store/services/dictionary/dictionary.slice";

interface ISettings {
    close: () => void;
    isOpen: boolean;
}

const Settings: FC<ISettings> = ({ close, isOpen }) => {
    const { dictionarySettings, dictionaryActiveSettings } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const [addLanguageSettings] = settingsApi.useAddLanguageSettingsMutation();
    const [setActiveLanguageSetting] =
        settingsApi.useSetActiveLanguageSettingMutation();

    const [languageSetting, setLanguageSetting] =
        useState<IDictionaryLangsCodes>({
            sourceLanguage: "",
            targetLanguage: "",
        });

    const [studyLanguages, setStudyLanguages] = useState<string[]>([]);
    const [languagesForStudy, setLanguagesForStudy] = useState<string[]>([]);

    const [isChangeLangsForStudy, setIsChangeLangsForStudy] = useState(false);
    const [isChangeStudyLangs, setIsChangeStudyLangs] = useState(false);

    const dispatch = useAppDispatch();
    const saveSettings = async () => {
        let sourceLangCodes = languagesForStudy;
        let targetLangCodes = studyLanguages;

        if (!sourceLangCodes.length) {
            sourceLangCodes = dictionarySettings.langsForStudy.map((lang) => {
                return lang.code;
            });
        }

        if (!targetLangCodes.length) {
            targetLangCodes = dictionarySettings.studyLangs.map((lang) => {
                return lang.code;
            });
        }

        if (isChangeLangsForStudy || isChangeStudyLangs) {
            await addLanguageSettings({
                sourceLangCodes,
                targetLangCodes,
            });
        }

        if (languageSetting.sourceLanguage && languageSetting.targetLanguage) {
            await setActiveLanguageSetting(languageSetting);
        }

        dispatch(getDictionaryActiveSettings());
        dispatch(getLanguages());
        dispatch(getDictionarySettings());

        setIsChangeStudyLangs(false);
        setIsChangeLangsForStudy(false);
    };

    const addLanguageSetting = (id: any) => {
        const setting = dictionarySettings.settings.find(
            (setting) => setting.id === id
        );
        if (setting) {
            setLanguageSetting({
                sourceLanguage: setting.sourceLanguage,
                targetLanguage: setting.targetLanguage,
            });
        }
    };

    useEffect(() => {
        setIsChangeStudyLangs(true);
    }, [studyLanguages]);

    useEffect(() => {
        setIsChangeLangsForStudy(true);
    }, [languagesForStudy]);

    useEffect(() => {
        if (!dictionarySettings.settings.length) {
            dispatch(getDictionarySettings());
        }
        if (!dictionaryActiveSettings.id) {
            dispatch(getDictionaryActiveSettings());
        }
    }, [dictionarySettings, dictionaryActiveSettings]);

    return (
        <>
            {isOpen && (
                <Modal
                    modalSettings={{
                        title: "Настройки",
                        oppositeTitle: "",
                        primaryBtnName: "Применить",
                        secondaryBtnName: "Отмена",
                        showButtons: true,
                        isVisible: true,
                        showUpperButtons: true,
                    }}
                    callbacks={{
                        primaryBtnClick: saveSettings,
                        secondaryBtnClick: () => {
                            close();
                        },
                    }}
                >
                    <div className="display flex justify-center">
                        <div className="mt-[15px]">
                            <div className="mb-[20px]">
                                <BasicSelect
                                    options={
                                        dictionarySettings.settingsForSelector
                                    }
                                    label="Установить языковой профиль"
                                    onChange={addLanguageSetting}
                                    selectedOption={dictionaryActiveSettings.id}
                                />
                            </div>
                            <div className="mb-[20px]">
                                <DictionaryLanguages
                                    selectLang={(langs: ILanguage[]) => {
                                        setLanguagesForStudy(
                                            langs.map((lang) => lang.code)
                                        );
                                    }}
                                    placeholder="Выберите язык на котором изучаете"
                                    multi={true}
                                    label="Языки на которых изучается"
                                    defaultValue={
                                        dictionarySettings.langsForStudy
                                    }
                                />
                            </div>
                            <div className=" mb-[20px]">
                                <DictionaryLanguages
                                    selectLang={(langs: ILanguage[]) => {
                                        setStudyLanguages(
                                            langs.map((lang) => lang.code)
                                        );
                                    }}
                                    placeholder="Выберете изучаемый язык"
                                    label="Изучаемые языки"
                                    multi={true}
                                    defaultValue={dictionarySettings.studyLangs}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default Settings;
