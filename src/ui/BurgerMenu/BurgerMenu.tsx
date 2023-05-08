import { FC } from "react";
import { ISection } from "../../types/todo.types";
import BurgerMenuItems from "./BurgerMenuItems";
import { IMenuItem } from "../../types/ui.types";

interface IBurgerMenu {
    items: ISection[];
    menu: IMenuItem[];
    setId: (id: string) => void;
    toggleArrow: (id: string, value: boolean) => void;
}

const BurgerMenu: FC<IBurgerMenu> = ({ items, menu, setId, toggleArrow }) => {
    return (
        <div className="w-[340px] h-[100%] fixed bg-gray-100">
            <div className="display flex justify-center mt-[20px]">
                <ul className="w-[89%]">
                    <BurgerMenuItems
                        items={items}
                        setId={setId}
                        menu={menu}
                        count={15}
                        toggleArrow={toggleArrow}
                    />
                </ul>
            </div>
        </div>
    );
};

export default BurgerMenu;
