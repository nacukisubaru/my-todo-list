import { FC } from "react";

interface IToolButtonProps {
    children: any,
    onClick: () => void
}

const ToolButton: FC<IToolButtonProps> = ({children, onClick}) => {
    return (
        <button className="px-[1px] py-[1px] rounded-[2px] mr-[4px]" onClick={onClick}>{children}</button>
    );
}

export default ToolButton;