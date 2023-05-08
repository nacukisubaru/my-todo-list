import { FC } from "react";
import { IModalSettings } from "../../types/ui.types";

interface IButtonsCallbacks {
    primaryBtnClick: () => void;
    secondaryBtnClick: () => void;
}

interface IModalProps {
    modalSettings: IModalSettings;
    callbacks: IButtonsCallbacks;
    children: any;
    icon?: any;
}

const Modal: FC<IModalProps> = ({
    modalSettings,
    callbacks,
    children,
    icon,
}) => {
    const {title, primaryBtnName, secondaryBtnName, isVisible} = modalSettings;
    const {primaryBtnClick, secondaryBtnClick} = callbacks;

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
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-[80%]">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:items-start">
                                        {icon}
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <h3
                                                className="text-base font-semibold leading-6 text-gray-900"
                                                id="modal-title"
                                            >
                                                {title}
                                            </h3>
                                            <div className="mt-2">
                                                {children}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        onClick={primaryBtnClick}
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    >
                                        {primaryBtnName}
                                    </button>
                                    <button
                                        onClick={secondaryBtnClick}
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    >
                                        {secondaryBtnName}
                                    </button>
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
