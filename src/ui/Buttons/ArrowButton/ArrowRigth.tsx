import { FC } from "react";

interface IArrowRightProps {
    onClick: () => void
}

const ArrowRight: FC<IArrowRightProps> = ({onClick}) => {
    return (
        <button className={`p-0 'bg-white'hover:bg-gray-200 h-[28px] active:outline-0 focus:outline-0`} onClick={onClick}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
            </svg>
        </button>
    );
};

export default ArrowRight;
