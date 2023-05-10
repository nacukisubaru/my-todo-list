import { FC, useState } from "react";

interface ICheckBox {
    label: string,
    onClick: () => void
}

const CheckBox:FC<ICheckBox> = ({label, onClick}) => {
    const [isChecked, setChecked] = useState(false);
    const check = (event: any) => {
        setChecked(event.target.checked);
    };

    return (
        <>
            <input
                className={`appearance-none w-[18px] h-[18px] rounded-xl border border-gray-950 border-solid ${
                    isChecked ? "bg-[#e3e3e3]" : ""
                }`}
                onChange={check}
                type="checkbox"
            />
            <label className="-mt-[3px] ml-2 cursor-pointer" onClick={onClick}>{label}</label>
        </>
    );
};

export default CheckBox;
