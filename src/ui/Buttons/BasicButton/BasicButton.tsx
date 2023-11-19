import { FC } from "react";

type color = "primary" | "secondary";

interface IBasicButton {
    name: string;
    color: color;
    isDisabled?: boolean;
    onClick: () => void;
}

const BasicButton: FC<IBasicButton> = ({
    name,
    color,
    isDisabled,
    onClick,
}) => {
    return (
        <button
            type="button"
            className={`px-[3px] py-[3px] rounded-[4px] ${
                isDisabled
                    ? color === "primary"
                        ? "bg-teal-500"
                        : "bg-gray-200"
                    : color === "primary"
                    ? "bg-teal-600"
                    : "bg-gray-200"
            }  `}
            onClick={onClick}
        >
            <span
                className={`text-sm ${
                    color === "secondary" ? "text-black" : "text-white"
                }`}
            >
                {name}
            </span>
        </button>
    );
};

export default BasicButton;
