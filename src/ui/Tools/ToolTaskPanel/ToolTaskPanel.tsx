import { FC, useState } from "react";
import ToolButton from "./ToolButton";
import ToolMenu from "../ToolMenu";
import { IMenuItem } from "../../../types/ui.types";
import EditButton from "../../Buttons/EditButton/EditButton";

interface ICallbacks {
    clickEditBtn?: () => void;
    setShowMenu?: (show: boolean) => void;
}

interface ISettings {
    showEditBtn: boolean;
    menuItems: IMenuItem[];
    componentsList?: any[]
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
    parent,
}) => {
    const { showEditBtn, menuItems, componentsList = [], translateX, translateY, colorBtn, isVisibleToolMenu = true } =
        settings;
    const { clickEditBtn, setShowMenu } = callbacks;

    const [isVisibleMenu, setVisibleMenu] = useState(false);

    const showMenu = () => {
        setVisibleMenu(true);
        setShowMenu && setShowMenu(true);
    };

    const editBtnAction = () => {
        clickEditBtn && clickEditBtn();
    }

    return (
        <div className="display flex">
            {showEditBtn && (
                <EditButton onClick={editBtnAction} />
            )}
            {componentsList.map((component) => {
                return component;
            })}
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
