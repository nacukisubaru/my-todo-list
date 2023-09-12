import { FC, useState } from "react";
import Modal from "../../../../ui/Modal/Modal";
import DictionaryLanguages from "../DictionaryWords/DictionaryLanguages";
import { useAppSelector } from "../../hooks/useAppSelector";
import { settingsApi } from "../../store/services/settings/settings.api";

interface ISettings {
    close: () => void;
}

const Settings: FC<ISettings> = ({ close }) => {
    const { dictionarySettings } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const [addLanguageSettings] = settingsApi.useAddLanguageSettingsMutation();
    const [studyLanguages, setStudyLanguages] = useState<string[]>([]);
    const [languagesForStudy, setLanguagesForStudy] = useState<string[]>([]);

    const saveSettings = () => {
        addLanguageSettings({sourceLangCodes: languagesForStudy, targetLangCodes: studyLanguages});
    }

    return (
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
                    <div className=" mb-[20px]">
                        <DictionaryLanguages
                            selectLang={(langs: ILanguage[]) => {setLanguagesForStudy(langs.map(lang => lang.code))}}
                            placeholder="Выберите язык на котором изучаете"
                            multi={true}
                            label="Языки на которых изучается"
                            defaultValue={dictionarySettings.langsForStudy}
                            // defaultValue={
                            //     filterDictionary.languageOriginal &&
                            //     filterDictionary.languageOriginal.map(
                            //         (lang: ILanguage) => lang.isoName
                            //     )
                            // }
                        />
                    </div>
                    <div className=" mb-[20px]">
                        <DictionaryLanguages
                            selectLang={(langs: ILanguage[]) => {setStudyLanguages(langs.map(lang => lang.code))}}
                            placeholder="Выберете изучаемый язык"
                            label="Изучаемые языки"
                            multi={true}
                            defaultValue={dictionarySettings.studyLangs}
                            // defaultValue={
                            //     filterDictionary.languageTranslation &&
                            //     filterDictionary.languageTranslation.map(
                            //         (lang: ILanguage) => lang.isoName
                            //     )
                            // }
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Settings;
