import { FC, useState } from "react";

interface IArrowButton {
    isArrowOpen: boolean;
}

const ArrowButton: FC<IArrowButton> = ({ isArrowOpen }) => {
    const [isOpen, setOpen] = useState(isArrowOpen);

    return (
        <>
            {isOpen ? (
                <div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-3 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                </svg>
                </div>
            ) : (
                <div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-3 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                </svg>
                </div>
            )}
        </>
    );
};

export default ArrowButton;
