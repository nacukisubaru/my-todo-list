import { FC } from "react";
import ToolButton from "../../Tools/ToolTaskPanel/ToolButton";

interface IArrowButtonLowProps {
    onClick: () => void;
}

const ArrowButtonLow: FC<IArrowButtonLowProps> = ({onClick}) => {
    return (
        <ToolButton onClick={onClick}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
            </svg>
        </ToolButton>
    );
};

export default ArrowButtonLow;
