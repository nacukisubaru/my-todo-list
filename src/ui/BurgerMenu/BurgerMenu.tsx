import { FC } from "react";
import { ISection } from "../../types/todo.types";
import BurgerMenuItems from "./BurgerMenuItems";

interface IBurgerMenu {
    items: ISection[];
    setId: (id: string) => void;
}

const BurgerMenu: FC<IBurgerMenu> = ({ items, setId }) => {

    return (
        <div className="w-[340px] h-[100%] fixed bg-gray-100">
            <div className="display flex justify-center mt-[20px]">
                <ul className="w-[89%]">
                    <BurgerMenuItems items={items} setId={setId} count={15}/>
                </ul>
            </div>
        </div>
    );
};

export default BurgerMenu;
