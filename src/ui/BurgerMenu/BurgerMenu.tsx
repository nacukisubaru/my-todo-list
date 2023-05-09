import { FC } from "react";
import { ISection } from "../../types/todo.types";
import BurgerMenuItems from "./BurgerMenuItems";
import { IMenuItem } from "../../types/ui.types";
import { useAppSelector } from "../../hooks/useAppSelector";

interface IBurgerMenu {
    items: ISection[];
    menu: IMenuItem[];
    setId: (id: string) => void;
    toggleArrow: (id: string, value: boolean) => void;
}

const BurgerMenu: FC<IBurgerMenu> = ({ items, menu, setId, toggleArrow }) => {
    const {showMenu} = useAppSelector(state => state.uiReducer);
    
    return (
        <div className={`w-[340px] h-[100%] fixed bg-gray-100 ${showMenu && '-translate-x-[353px]'} duration-300`}>
            <div className="display flex justify-center px-[15px] py-[15px]">
                <ul className="w-[89%]">
                    <BurgerMenuItems
                        items={items}
                        setId={setId}
                        menu={menu}
                        count={3}
                        toggleArrow={toggleArrow}
                    />
                </ul>
            </div>
        </div>
    );
};

export default BurgerMenu;
