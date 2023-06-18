import { FC } from "react";

interface ISpeedDialButtonProps {
    onClick: () => void
}

const SpeedDialButton:FC<ISpeedDialButtonProps> = ({onClick}) => {
    return (
        <div data-dial-init className="fixed right-6 bottom-6 group">
            <button
                type="button"
                data-dial-toggle="speed-dial-menu-default"
                aria-controls="speed-dial-menu-default"
                aria-expanded="false"
                className="flex items-center justify-center text-white bg-red-500 rounded-full w-14 h-14 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-700 focus:outline-none dark:focus:bg-red-700"
                onClick={onClick}
            >
                <svg
                    aria-hidden="true"
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                </svg>
            </button>
        </div>
    );
};

export default SpeedDialButton;
