import { FC } from "react";
import BurgerButton from "../BurgerMenu/BurgerButton";
import SiginButton from "../Buttons/SiginButton/SiginButton";
import { useAppSelector } from "../../hooks/useAppSelector";

interface IHeaderProps {}

const Header: FC<IHeaderProps> = () => {
    const { isAuth } = useAppSelector((state) => state.authReducer);

    return (
        <div className="bg-red-500 h-[40px] sticky top-0 z-10">
            <div className="px-[8px] py-[8px] display flex justify-between">
                <BurgerButton />
                {isAuth && <SiginButton />}
            </div>
        </div>
    );
};

export default Header;
