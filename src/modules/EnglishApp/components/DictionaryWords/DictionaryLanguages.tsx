import { AutoComplete } from "@progress/kendo-react-dropdowns";
import { FC, useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { MultiSelect } from "@progress/kendo-react-dropdowns";

interface IDictionaryLanguages {
    selectLang: (value: ILanguage[]) => void;
    defaultLang?: string;
    placeholder?: string;
    multi?: boolean;
    defaultValue?: any[] | any;
}

const DictionaryLanguages: FC<IDictionaryLanguages> = ({
    selectLang,
    defaultLang,
    defaultValue = '',
    multi = false,
    placeholder = "Выберите язык",
}) => {
    const languages = useAppSelector(
        (state) => state.dictionaryReducer.languages
    );
    const [defaultTargetLang, setDefaultTargetLang] = useState("");

    useEffect(() => {
        if (defaultLang) {
            const defaultLanguages = languages.filter((lang) => {
                if (lang.code === defaultLang) {
                    return lang;
                }
            });

            setDefaultTargetLang(defaultLanguages[0].isoName);
        }
    }, []);

    const setLanguage = (e: any) => {
        if (e.value) {
            if (Array.isArray(e.value)) {
                let values: string[] = e.value;
                const languagesCodesList: ILanguage[] = [];
                values.map((value) => {
                    languages.filter((lang) => {
                        if (lang.isoName === value) {
                            languagesCodesList.push(lang);
                        }
                    });
                });
                selectLang(languagesCodesList);
            } else {
                const selectedLang = languages.filter((lang) => {
                    if (lang.isoName === e.value) {
                        return lang;
                    }
                });

                if (selectedLang.length) {
                    selectLang(selectedLang);
                }
            }
        }
    };

    return (
        <>
            {multi ? (
                <MultiSelect
                    data={languages.map((lang) => {
                        return lang.isoName;
                    })}
                    onChange={setLanguage}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                />
            ) : (
                <AutoComplete
                    data={languages.map((lang) => {
                        return lang.isoName;
                    })}
                    placeholder={placeholder}
                    onChange={setLanguage}
                    defaultValue={defaultTargetLang}
                />
            )}
        </>
    );
};

export default DictionaryLanguages;
