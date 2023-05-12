import { FC } from "react";
import BurgerButton from "../BurgerMenu/BurgerButton";

interface IHeaderProps {
}

const Header: FC<IHeaderProps> = () => {
    return (
        <div className="bg-red-500 h-[40px] sticky top-0 z-10">
            <div className="px-[8px] py-[8px]">
                <BurgerButton />
            </div>
        </div>
    );
};

export default Header;
