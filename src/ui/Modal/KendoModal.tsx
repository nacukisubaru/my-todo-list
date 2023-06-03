import { Window } from "@progress/kendo-react-dialogs";
import { FC } from "react";

interface IKendoModal {
    children: any;
    initialWidth: number;
    initialHeight: number;
    isVisible?: boolean,
    onClose: () => void
}

const KendoModal: FC<IKendoModal> = ({
    children,
    initialHeight,
    initialWidth,
    isVisible = true,
    onClose
}) => {
   
    return (
        <>
            {isVisible && (
                <Window
                    title="Upload Image"
                    onClose={onClose}
                    initialWidth={initialWidth}
                    initialHeight={initialHeight}
                >
                    {children}
                </Window>
            )}
        </>
    );
};

export default KendoModal;
