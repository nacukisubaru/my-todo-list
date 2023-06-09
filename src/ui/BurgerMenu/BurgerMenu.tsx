import { FC } from "react";
import { ITodoItem } from "../../types/todo.types";
import BurgerMenuItems from "./BurgerMenuItems";
import { IMenuItem } from "../../types/ui.types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import { Link } from "react-router-dom";
import Divider from "../Dividers/Divider";

interface IMyApp {
    name: string,
    link: string
}
interface IBurgerMenu {
    items: ITodoItem[];
    menu: IMenuItem[];
    myapps?: IMyApp[];
    setItem: (item: ITodoItem) => void;
    toggleArrow: (id: string, value: boolean) => void;
}

const BurgerMenu: FC<IBurgerMenu> = ({ items, menu, myapps, setItem, toggleArrow }) => {
    const {showMenu} = useAppSelector(state => state.uiReducer);
    const {toggleMenu} = useActions();

    return (
        <>
        {showMenu && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[1]" onClick={() => {toggleMenu({isShow: false})}}></div>
        )}
        
        <div className={`px-[15px] z-[1] py-[60px] xl:w-[280px] h-[100%] w-[360px] md:w-[500px] fixed bg-gray-100 ${showMenu ? 'translate-x-[0px]' : '-translate-x-[1000px]'} duration-300`}>
            <div className="display flex justify-center">
                <ul className="w-[89%]">
                    <BurgerMenuItems
                        items={items}
                        setItem={setItem}
                        menu={menu}
                        count={3}
                        toggleArrow={toggleArrow}
                    />

                    <Divider />
                    <div>Мои приложения</div>
                    <>
                        {myapps && myapps.map((app) => {
                            return <Link to={app.link}><li className="cursor-pointer" >{app.name}</li></Link>
                        })}
                    </>
                </ul>
                
            </div>
            
           
        </div>
        
        </>
    );
};

export default BurgerMenu;
