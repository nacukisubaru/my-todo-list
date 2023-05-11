import { FC } from "react";
import { ISection } from "../../types/todo.types";
import BurgerMenuItems from "./BurgerMenuItems";
import { IMenuItem } from "../../types/ui.types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";

interface IBurgerMenu {
    items: ISection[];
    menu: IMenuItem[];
    setId: (id: string) => void;
    toggleArrow: (id: string, value: boolean) => void;
}

const BurgerMenu: FC<IBurgerMenu> = ({ items, menu, setId, toggleArrow }) => {
    const {showMenu} = useAppSelector(state => state.uiReducer);
    const {toggleMenu} = useActions();

    return (
        <>
        {showMenu && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={toggleMenu}></div>
        )}
        <div className={`px-[15px] py-[60px] xl:w-[280px] h-[100%] w-[360px] md:w-[500px] fixed bg-gray-100 ${showMenu ? 'translate-x-[0px]' : '-translate-x-[1000px]'} duration-300`}>
            <div className="display flex justify-center">
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
        
        </>
    );
};

export default BurgerMenu;
