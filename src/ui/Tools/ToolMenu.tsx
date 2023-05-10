import { FC } from "react";
import { IMenuItem } from "../../types/ui.types";

interface IToolMenu {
    menuItems: IMenuItem[];
    translateY?: string;
    translateX?: string;
    parent?: any;
}

const ToolMenu: FC<IToolMenu> = ({ menuItems, translateX, translateY, parent }) => {
    return (
        <div
            className={`absolute -translate-x-[67px] ${translateX ? translateX : '-translate-x-[67px]'} ${translateY && translateY} px-[20px] py-[20px] bg-white h-auto w-[200px] rounded-[6px] shadow-xl`}
        >
            <ul>
                {menuItems.map((item) => {
                    return (
                        <li
                            id={item.name}
                            key={item.name}
                            className="cursor-pointer hover:bg-gray-50 text-sm text-start"
                            onClick={() => {
                                item.onClick(parent);
                            }}
                        >
                            {item.name}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ToolMenu;
