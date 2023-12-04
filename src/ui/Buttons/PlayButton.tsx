import { FC } from "react";

interface IPlayButton {
    onClick: () => void
}

const PlayButton:FC<IPlayButton> = ({onClick}) => {
    return (
        <button className={`p-0  'bg-white' hover:bg-gray-200 h-[28px] active:outline-0 focus:outline-0`} onClick={onClick} onTouchStart={onClick}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                />
            </svg>
        </button>
    );
};

export default PlayButton;
