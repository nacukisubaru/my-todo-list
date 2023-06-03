import { FC } from "react";
import { IMenuItem } from "../../types/ui.types";

interface IToolMenu {
    position?: string;
    menuItems: IMenuItem[];
    translateY?: string;
    translateX?: string;
    parent?: any;
    onMouseLeave?: () => void
}

const ToolMenu: FC<IToolMenu> = ({ menuItems, translateX, translateY, parent, position, onMouseLeave }) => {
    return (
        <div
            onMouseLeave={onMouseLeave}
            className={`${position ? position : 'absolute'} ${translateX ? translateX : '-translate-x-[67px]'} ${translateY && translateY} px-[20px] py-[20px] bg-white h-auto w-[200px] rounded-[6px] shadow-xl`}
        >
            <ul>
                {menuItems.map((item) => {
                    if (item.isDeactive !== true) {
                        return (
                            <li
                                id={item.name}
                                key={item.name}
                                className="cursor-pointer hover:bg-gray-50 text-md text-start"
                                onClick={() => {
                                    item.onClick(parent);
                                }}
                            >
                                {item.name}
                            </li>
                        );
                    }
                })}
            </ul>
        </div>
    );
};

export default ToolMenu;
