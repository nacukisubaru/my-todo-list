import { FC, useEffect, useState } from "react";

interface ICheckBoxDefaultProps {
    label: string,
    checked?: boolean,
    onChange: (isChecked: boolean) => void
}

const CheckBoxDefault: FC<ICheckBoxDefaultProps> = ({label, checked, onChange}) => {
    const [isChecked, setChecked] = useState<boolean>(false);

    const changeCheck = (e: any) => {
        setChecked(e.target.checked);
        onChange(e.target.checked);
    }

    useEffect(() => {
        if (checked !== undefined) {
            setChecked(checked);
        }
    }, [checked]);

    return (
        <>
            <div className="flex items-center mb-4">
                <input
                    id="default-checkbox"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={changeCheck}
                    checked={isChecked}
                />
                <label
                    htmlFor="default-checkbox"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                    {label}
                </label>
            </div>
        </>
    );
};

export default CheckBoxDefault;
