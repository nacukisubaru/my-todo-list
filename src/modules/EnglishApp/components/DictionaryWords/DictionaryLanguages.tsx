import { AutoComplete } from "@progress/kendo-react-dropdowns";
import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getLanguages } from "../../store/services/dictionary/dictionary.slice";
import { useAppSelector } from "../../hooks/useAppSelector";

interface IDictionaryLanguages {
    selectLang: (value: string) => void
}

const DictionaryLanguages: FC<IDictionaryLanguages> = ({selectLang}) => {
    const languages = useAppSelector(state => state.dictionaryReducer.languages);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getLanguages());
    }, []);

    const setLanguage = (e: any) => {
        if (e.value) {
            const selectedLang = languages.filter((lang) => {
                if (lang.name === e.value) {
                    return lang;
                }
            });
            selectLang(selectedLang[0].code);
        }
    }

    return (
        <AutoComplete
            data={languages.map((lang) => {return lang.name})}
            placeholder="Выберите язык"
            onChange={setLanguage}
        />
    );
}

export default DictionaryLanguages;