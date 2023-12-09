import { IconButton } from "@mui/material";
import { FC } from "react";

interface IStudyStageButton {
    children: any,
    updateStudy: () => void;
}

const StudyStageButton: FC<IStudyStageButton> = ({children, updateStudy}) => {
    return (
        <>
            <div className="lg:block hidden">
                <IconButton
                    onClick={() => {
                        updateStudy();
                    }}
                >
                    {children}
                </IconButton>
            </div>

            <div className="lg:hidden block">
                <IconButton
                    onTouchStart={() => {
                        updateStudy();
                    }}
                >
                   {children}
                </IconButton>
            </div>
        </>
    );
};

export default StudyStageButton;
