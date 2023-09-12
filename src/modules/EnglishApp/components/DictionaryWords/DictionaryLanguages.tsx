import { AutoComplete } from "@progress/kendo-react-dropdowns";
import { FC, useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface IDictionaryLanguages {
    selectLang: (value: ILanguage[]) => void;
    defaultLang?: string;
    placeholder?: string;
    label?: string;
    multi?: boolean;
    style?: any;
    defaultValue?: any[] | any;
}

const DictionaryLanguages: FC<IDictionaryLanguages> = ({
    selectLang,
    defaultLang,
    defaultValue = "",
    multi = false,
    style = {},
    placeholder = "Выберите язык",
    label
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

    const setLanguage = (e: any, values: any) => {
        selectLang(values);
        // if (value) {
        //     if (Array.isArray(value)) {
        //         let values: string[] = value;
        //         const languagesCodesList: ILanguage[] = [];
        //         values.map((value) => {
        //             languages.filter((lang) => {
        //                 if (lang.isoName === value) {
        //                     languagesCodesList.push(lang);
        //                 }
        //             });
        //         });
        //         console.log('fdf');
        //         selectLang(values);
        //     } else {
        //         const selectedLang = languages.filter((lang) => {
        //             if (lang.isoName === value) {
        //                 return lang;
        //             }
        //         });

        //         if (selectedLang.length) {
        //             selectLang(selectedLang);
        //         }
        //     }
        // }
    };
 
    
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    return (
        <>
            {multi ? (
                <Autocomplete
                    multiple
                    id="languages-tags"
                    options={languages}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.isoName}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option.isoName}
                        </li>
                    )}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            placeholder={placeholder}
                        />
                    )}
                    defaultValue={defaultValue}
                    onChange={setLanguage}
                />
                //     <MultiSelect
                //     data={languages.map((lang) => {
                //         return lang.isoName;
                //     })}
                //     onChange={setLanguage}
                //    // defaultValue={defaultValue}
                //     placeholder={placeholder}
                //     style={{...style}}
                // />
            ) : (
                <></>
                // <AutoComplete
                //     data={languages.map((lang) => {
                //         return lang.isoName;
                //     })}
                //     placeholder={placeholder}
                //     onChange={setLanguage}
                //     defaultValue={defaultTargetLang}
                //     style={{ ...style }}
                // />
            )}
        </>
    );
};

export default DictionaryLanguages;
