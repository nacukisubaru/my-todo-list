import { FC } from "react";
import ItemMenu from "./ItemMenu";
import { IMenuItem } from "../../types/ui.types";

interface IItemMenu {
    id: number;
    name: string;
}

interface ILeftMenu {
    items: IItemMenu[];
    menuItems: IMenuItem[];
    itemClick: (item: IItemMenu) => void;
}

const LeftMenu: FC<ILeftMenu> = ({ items, menuItems, itemClick }) => {
    return (
        <ul className=" w-[180px] h-[470px] overflow-scroll">
            {items.map((item: any) => {
                return (
                    <ItemMenu item={item} menuItems={menuItems} itemClick={itemClick} />
                );
            })}
        </ul>
    );
};

export default LeftMenu;
