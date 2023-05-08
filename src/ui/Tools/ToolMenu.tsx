import { FC } from "react";
import { IMenuItem } from "../../types/ui.types";

interface IToolMenu {
    menuItems: IMenuItem[];
    translateY?: string;
    parent?: any;
}

const ToolMenu: FC<IToolMenu> = ({ menuItems, translateY, parent }) => {
    return (
        <div
            className={`absolute -translate-x-[67px] -translate-y-[${
                translateY ? translateY : "80px"
            }] px-[20px] py-[20px] bg-white h-auto w-[200px] rounded-[6px] shadow-xl`}
        >
            <ul>
                {menuItems.map((item) => {
                    return (
                        <li
                            id={item.name}
                            key={item.name}
                            className="cursor-pointer hover:bg-gray-50"
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
