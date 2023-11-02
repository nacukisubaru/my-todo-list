import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FC, useEffect, useState } from "react";

interface IBasicSelect {
    options: IOption[],
    selectedOption?: any,
    label: string,
    onChange: (value: string) => void
}

const BasicSelect: FC<IBasicSelect> = ({options, selectedOption, label, onChange}) => {
    const [selectOption, setSelectOption] = useState("");

    const handleChange = (event: SelectChangeEvent) => {
        setSelectOption(event.target.value as string);
        onChange(event.target.value);
    };

    useEffect(() => {
        if (selectedOption) {
            setSelectOption(selectedOption);
        }
    }, [selectedOption]);

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="basic-select-label">{label}</InputLabel>
                <Select
                    labelId="basic-select-label"
                    id="basic-select"
                    value={selectOption}
                    label={label}
                    onChange={handleChange}
                >
                    {options.map(option => <MenuItem value={option.id}>{option.name}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    );
};

export default BasicSelect;
