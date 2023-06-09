import { FC, useState } from "react";

interface IArrowButton {
    isArrowOpen?: boolean;
    color?: string;
    tailwindstyles?: string;
    onClick: (param: any) => void;
}

const ArrowButton: FC<IArrowButton> = ({ isArrowOpen = false, color, tailwindstyles = '', onClick }) => {
    const [isOpen, setOpen] = useState(isArrowOpen);

    const toggleArrow = () => {
        let arrowIsOpen = true;
        if (isOpen) {
            arrowIsOpen = false;
        }
        setOpen(arrowIsOpen);
        onClick(arrowIsOpen);
    }

    return (
        <>
            {isOpen ? (
                <button className={`p-0  ${color ? color : 'bg-white'} ${tailwindstyles && tailwindstyles} hover:bg-gray-200 h-[12px] active:outline-0 focus:outline-0`} onClick={toggleArrow}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-3 h-[12px]`"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                    </svg>
                </button>
            ) : (
                <button className={`p-0  ${color ? color : 'bg-white'} ${tailwindstyles && tailwindstyles} hover:bg-gray-200 h-[12px] active:outline-0 focus:outline-0`} onClick={toggleArrow}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-3 h-[12px]"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>
            )}
        </>
    );
};

export default ArrowButton;
