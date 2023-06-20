import { FC } from "react";

interface ISmallOutlineButton {
    children?: any;
    onClick: () => void;
}

const SmallOutlineButton: FC<ISmallOutlineButton> = ({ children, onClick }) => {
    return (
        <button
            className="outline outline-offset-2 outline-1 ... text-[12px] h-[22px] pt-[1px]"
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default SmallOutlineButton;
