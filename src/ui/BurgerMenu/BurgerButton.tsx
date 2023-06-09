import { FC } from "react";
import { useActions } from "../../hooks/useActions";
import { useAppSelector } from "../../hooks/useAppSelector";

interface IBurgerButtonProps {
}

const BurgerButton: FC<IBurgerButtonProps> = () => {
    const {showMenu} = useAppSelector(state => state.uiReducer);
    const {toggleMenu} = useActions();

    const showBurgerMenu = () => {
        if (showMenu) {
            toggleMenu({isShow: false});
        } else {
            toggleMenu({isShow: true});
        }
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-white cursor-pointer"
            onClick={showBurgerMenu}
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
            />
        </svg>
    );
};

export default BurgerButton;
