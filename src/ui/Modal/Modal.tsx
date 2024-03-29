import { FC, useState } from "react";
import { IMenuItem, IModalSettings } from "../../types/ui.types";
import ToolTaskPanel from "../Tools/ToolTaskPanel/ToolTaskPanel";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface IButtonsCallbacks {
    primaryBtnClick: () => void;
    secondaryBtnClick: () => void;
}

interface IToolPanel {
    menu: IMenuItem[];
    componentsList?: any[];
}

interface IModalProps {
    modalSettings: IModalSettings;
    toolPanel?: IToolPanel;
    callbacks: IButtonsCallbacks;
    children: any;
    icon?: any;
    maxWidth?: string;
    fullWidth?: boolean;
}

const Modal: FC<IModalProps> = ({
    modalSettings,
    toolPanel = { menu: [], componentsList: [] },
    callbacks,
    children,
    icon,
    maxWidth,
    fullWidth = true
}) => {
    const {
        title,
        oppositeTitle,
        primaryBtnName,
        secondaryBtnName,
        isVisible,
        heightBody,
        showButtons = true,
        showUpperButtons = false,
    } = modalSettings;

    const { primaryBtnClick, secondaryBtnClick } = callbacks;

    const [isVisibleToolsMenu, setVisibleToolsMenu] = useState(false);

    const showToolsMenu = () => {
        setVisibleToolsMenu(true);
    };

    const closeToolsMenu = () => {
        setVisibleToolsMenu(false);
    };

    return (
        <>
            {isVisible && (
                <div
                    className="relative z-10"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                            <div
                                className={`relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 ${fullWidth && 'sm:w-full'}  ${
                                    maxWidth ? maxWidth : "max-w-[50rem]"
                                } overflow-auto min-w-[326px] ${
                                    heightBody && heightBody
                                }`}
                            >
                                {showUpperButtons && (
                                    <>
                                        <div className="display flex justify-end px-[7px] py-[7px]">
                                            {toolPanel.menu.length > 0 && (
                                                <span className="z-50">
                                                    <ToolTaskPanel
                                                        settings={{
                                                            menuItems:
                                                                toolPanel.menu,
                                                            componentsList:
                                                                toolPanel.componentsList,
                                                            translateY: "24px",
                                                            translateX:
                                                                "-translate-x-[149px]",
                                                            showEditBtn: false,
                                                            colorBtn:
                                                                "bg-white",
                                                            isVisibleToolMenu:
                                                                isVisibleToolsMenu,
                                                        }}
                                                        callbacks={{
                                                            clickEditBtn:
                                                                () => {},
                                                            setShowMenu:
                                                                showToolsMenu,
                                                        }}
                                                    />
                                                </span>
                                            )}
                                           
                                            <IconButton onClick={secondaryBtnClick}>
                                                <CloseIcon />
                                            </IconButton>
                                        </div>
                                        <div
                                            className="w-[91%] h-[41px] absolute -mt-[41px]"
                                            onClick={closeToolsMenu}
                                        ></div>
                                    </>
                                )}

                                <div
                                    className={`${heightBody && heightBody}`}
                                    onClick={closeToolsMenu}
                                >
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:items-start">
                                            {icon}
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <div className="display flex justify-between">
                                                    <h3
                                                        className="text-base font-semibold leading-6 text-gray-900"
                                                        id="modal-title"
                                                    >
                                                        {title}
                                                    </h3>
                                                    {oppositeTitle && (
                                                        <div>
                                                            {oppositeTitle}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-2">
                                                    {children}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {showButtons && (
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            {primaryBtnName && (
                                                <button
                                                    onClick={primaryBtnClick}
                                                    type="button"
                                                    className="inline-flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 sm:ml-3 sm:w-auto"
                                                >
                                                    {primaryBtnName}
                                                </button>
                                            )}

                                            {secondaryBtnName && (
                                                <button
                                                    onClick={secondaryBtnClick}
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                >
                                                    {secondaryBtnName}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
