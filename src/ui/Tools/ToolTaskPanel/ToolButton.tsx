import { FC } from "react";

interface IToolButtonProps {
    children: any,
    onClick: () => void,
    color?: string,
}

const ToolButton: FC<IToolButtonProps> = ({children, color, onClick}) => {
    return (
        <button className={`px-[1px] py-[1px] rounded-[2px] mr-[4px] ${color && color} h-[30px] `} onClick={onClick}>{children}</button>
    );
}

export default ToolButton;