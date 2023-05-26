import { FC } from "react";

interface IMenuItem {
    id: number,
    name: string
}

interface ILeftMenu {
    items: IMenuItem[],
    itemClick: (id: number) => void
}

const LeftMenu: FC<ILeftMenu> = ({ items, itemClick }) => {
    return (
        <ul>
            {items.map((item: any) =>{ 
                return <li onClick={() => {itemClick(item.id)}}>{item.name}</li>
            })}
        </ul>
    );
};

export default LeftMenu;
