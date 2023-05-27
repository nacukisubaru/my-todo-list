import { FC } from "react";

interface IMenuItem {
    id: number,
    name: string
}

interface ILeftMenu {
    items: IMenuItem[],
    itemClick: (item: IMenuItem) => void
}

const LeftMenu: FC<ILeftMenu> = ({ items, itemClick }) => {
    return (
        <ul className="w-[150px] h-[470px] overflow-scroll">
            {items.map((item: any) =>{ 
                return <li onClick={() => {itemClick(item)}}>{item.name}</li>
            })}
        </ul>
    );
};

export default LeftMenu;
