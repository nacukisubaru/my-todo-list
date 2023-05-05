import { FC } from "react";
import { ISection } from "../../types/todo.types";

interface IMenuItem {
    id: number;
    name: string;
}

interface IBurgerMenu {
    items: ISection[];
    setId: (id: string) => void;
}

const BurgerMenu: FC<IBurgerMenu> = ({ items, setId }) => {
    return (
        <div className="w-[340px] h-[100%] fixed bg-gray-100">
            <div className="display flex justify-center mt-[20px]">
                <ul className="w-[89%]">
                    {items.map((item) => {
                        return (
                            <li
                                className="hover:bg-gray-200"
                                key={item.id}
                                onClick={() => {
                                    setId(item.id);
                                }}
                            >
                                {item.name}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default BurgerMenu;
