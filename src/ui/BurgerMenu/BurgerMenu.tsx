import { FC } from "react";

interface IMenuItem {
    id: number
    name: string
}

interface IBurgerMenu {
    items: IMenuItem[]
}

const BurgerMenu: FC<IBurgerMenu> = ({items}) => {
    return (
        <div className="w-[340px] h-[100%] fixed bg-gray-100">
            <div className="display flex justify-center mt-[20px]">
                <ul className="w-[89%]">
                    {items.map((item) => {
                        return <li className="hover:bg-gray-200">{item.name}</li>
                    })}
                </ul>
            </div>
        </div>
    );
};

export default BurgerMenu;
