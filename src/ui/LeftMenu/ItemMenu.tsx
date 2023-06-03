import { FC, useState } from "react";
import ToolMenu from "../Tools/ToolMenu";
import { IMenuItem } from "../../types/ui.types";
import MenuButton from "../Buttons/MenuButton";

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
                        <MenuButton onClick={showMenu}/>
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
