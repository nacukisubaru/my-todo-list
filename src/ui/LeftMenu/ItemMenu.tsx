import { FC, useState } from "react";
import ToolButton from "../Tools/ToolTaskPanel/ToolButton";
import ToolMenu from "../Tools/ToolMenu";
import { IMenuItem } from "../../types/ui.types";

interface IItemMenu {
    id: number;
    name: string;
}

interface ItemMenuProps {
    item: IItemMenu;
    menuItems: IMenuItem[];
    itemClick: (item: IItemMenu) => void;
}

const ItemMenu: FC<ItemMenuProps> = ({ item, menuItems, itemClick }) => {
    const [isVisibleMenu, setVisibleMenu] = useState(false);
    const [isVisibleMenuBtn, setVisibleMenuBtn] = useState(false);

    const showMenu = () => {
        setVisibleMenu(true);
    };

    const showMenuBtn = () => {
        setVisibleMenuBtn(true);
    };

    const hideMenuBtn = () => {
        setVisibleMenuBtn(false);
    };

    return (
        <span onMouseOver={showMenuBtn} onMouseOut={hideMenuBtn}>
            <div className="display flex justify-between break-all cursor-pointer">
                <li
                    onClick={() => {
                        itemClick(item);
                        setVisibleMenu(false);
                    }}
                >
                    {item.name}
                </li>
                
                {isVisibleMenuBtn && (
                    <div>
                        <ToolButton onClick={showMenu}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                />
                            </svg>
                        </ToolButton>
                    </div>
                )}
                
                {isVisibleMenu && (
                    <ToolMenu
                        translateX="translate-x-[100px]"
                        translateY="-translate-y-[20px]"
                        menuItems={menuItems}
                        parent={item}
                        onMouseLeave={() => {setVisibleMenu(false)}}
                    />
                )}
             
            </div>
        </span>
    );
};

export default ItemMenu;
