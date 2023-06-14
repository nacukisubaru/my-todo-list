import { AutoComplete } from "@progress/kendo-react-dropdowns";
import { FC, useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";

interface IDictionaryLanguages {
    selectLang: (value: string) => void,
    defaultLang: string
}

const DictionaryLanguages: FC<IDictionaryLanguages> = ({selectLang, defaultLang}) => {
    const languages = useAppSelector(state => state.dictionaryReducer.languages);
    const [defaultTargetLang, setDefaultTargetLang] = useState("");

    useEffect(() => {
        const defaultLanguages = languages.filter((lang) => {
            if (lang.code === defaultLang) {
                return lang;
            }
        });
    
        setDefaultTargetLang(defaultLanguages[0].isoName);
    }, []);

    const setLanguage = (e: any) => {
        if (e.value) {
            const selectedLang = languages.filter((lang) => {
                if (lang.isoName === e.value) {
                    return lang;
                }
            });
            
            if (selectedLang.length) {
                selectLang(selectedLang[0].code);
            }
        }
    }

    return (
        <AutoComplete
            data={languages.map((lang) => {return lang.isoName})}
            placeholder="Выберите язык"
            onChange={setLanguage}
            defaultValue={defaultTargetLang}
        />
    );
}

export default DictionaryLanguages;