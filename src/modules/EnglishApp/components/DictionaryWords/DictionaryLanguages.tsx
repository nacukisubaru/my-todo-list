import { FC, useEffect } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface IDictionaryLanguages {
    selectLang: (value: ILanguage[]) => void;
    exclusionLangs?: string[];
    defaultLang?: string;
    placeholder?: string;
    label?: string;
    multi?: boolean;
    style?: any;
    defaultValue?: any[] | any;
}

const DictionaryLanguages: FC<IDictionaryLanguages> = ({
    selectLang,
    exclusionLangs = [],
    defaultValue = "",
    placeholder = "Выберите язык",
    label
}) => {
    const languages = useAppSelector(
        (state) => state.dictionaryReducer.languages
    );
  
    const setLanguage = (e: any, values: any) => {
        selectLang(values);
    };

    return (
        <Autocomplete
            multiple
            id="languages-tags"
            options={languages.filter(lang => !exclusionLangs.includes(lang.code))}
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
