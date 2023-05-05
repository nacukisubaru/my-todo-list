import { FC } from "react";
import { IMenuItem } from "../../types/ui.types";

interface IToolMenu {
    menuItems: IMenuItem[];
}

const ToolMenu: FC<IToolMenu> = ({ menuItems }) => {
    return (
        <div className="absolute -translate-x-[67px] -translate-y-[80px] px-[20px] py-[20px] bg-white h-auto w-[200px] rounded-[6px] shadow-xl">
            <ul>
                {menuItems.map((item) => {
                    return <li id={item.name} key={item.name} className="cursor-pointer hover:bg-gray-50" onClick={item.onClick}>{item.name}</li>;
                })}
            </ul>
        </div>
    );
};

export default ToolMenu;
