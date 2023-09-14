import { FC, useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface IDictionaryLanguages {
    selectLang: (value: ILanguage[]) => void;
    options?: ILanguageSettings[];
    defaultLang?: string;
    placeholder?: string;
    label?: string;
    multi?: boolean;
    style?: any;
    defaultValue?: any[] | any;
}

const DictionaryLanguages: FC<IDictionaryLanguages> = ({
    selectLang,
    options,
    defaultValue = "",
    placeholder = "Выберите язык",
    label
}) => {
    const languages = useAppSelector(
        (state) => state.dictionaryReducer.languages
    );
  
    const [langOptions, setLangOptions] = useState<ILanguageSettings[]>([]);

    const setLanguage = (e: any, values: any) => {
        selectLang(values);
    };

    useEffect(() => {
        if (options) {
            setLangOptions(options.filter(lang => !defaultValue.map((value:any) => value.code).includes(lang.code)));
        } else if (languages) {
            setLangOptions(languages.filter(lang => !defaultValue.map((value:any) => value.code).includes(lang.code)));
        }
    }, [options, languages]);

    return (
        <Autocomplete
            multiple
            id="languages-tags"
            options={langOptions}
            disableCloseOnSelect
            getOptionLabel={(option) => option.isoName}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
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
    );
};

export default DictionaryLanguages;
