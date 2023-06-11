import { FC } from "react";

interface InputFieldProps {
    id: string,
    name: string,
    type: string,
    ref?: any
}

const InputField: FC<InputFieldProps> = ({
    id,
    name,
    type,
    ref
}) => {
    return (
        <input               
            id={id}
            name={name}
            type={type}
            ref={ref}
            className="block w-full px-[11px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
             placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        /> 
    );
}

export default InputField;