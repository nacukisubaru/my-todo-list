import { FC, useState } from "react";
import ToolButton from "./ToolButton";
import ToolMenu from "../ToolMenu";
import { IMenuItem } from "../../../types/ui.types";

interface ICallbacks {
    clickEditBtn: () => void;
    setShowMenu: (show: boolean) => void;
}

interface ISettings {
    showEditBtn: boolean;
    menuItems: IMenuItem[];
    translateX?: string;
    translateY?: string;
    colorBtn?: string;
    isVisibleToolMenu?: boolean
}

interface IToolTaskPanelProps {
    settings: ISettings;
    callbacks: ICallbacks;
    parent?: any;
}

const ToolTaskPanel: FC<IToolTaskPanelProps> = ({
    callbacks,
    settings,
    parent
}) => {
    const { showEditBtn, menuItems, translateX, translateY, colorBtn, isVisibleToolMenu = true } =
        settings;
    const { clickEditBtn, setShowMenu } = callbacks;

    const [isVisibleMenu, setVisibleMenu] = useState(false);

    const showMenu = () => {
        setVisibleMenu(true);
        setShowMenu(true);
    };

    return (
        <div className="display flex">
            {showEditBtn && (
                <ToolButton onClick={clickEditBtn}>
                    <svg width="24" height="24">
                        <g fill="none" fillRule="evenodd">
                            <path
                                fill="currentColor"
                                d="M9.5 19h10a.5.5 0 110 1h-10a.5.5 0 110-1z"
                            ></path>
                            <path
                                stroke="currentColor"
                                d="M4.42 16.03a1.5 1.5 0 00-.43.9l-.22 2.02a.5.5 0 00.55.55l2.02-.21a1.5 1.5 0 00.9-.44L18.7 7.4a1.5 1.5 0 000-2.12l-.7-.7a1.5 1.5 0 00-2.13 0L4.42 16.02z"
                            ></path>
                        </g>
                    </svg>
                </ToolButton>
            )}
            <ToolButton color={colorBtn} onClick={showMenu}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                </svg>
            </ToolButton>
            {isVisibleMenu && isVisibleToolMenu && (
                <ToolMenu
                    translateX={translateX}
                    translateY={translateY}
                    menuItems={menuItems}
                    parent={parent}
                />
            )}
        </div>
    );
};

export default ToolTaskPanel;
