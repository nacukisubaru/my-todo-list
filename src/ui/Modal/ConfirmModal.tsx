import { FC } from "react";
import Modal from "./Modal";
import { Button, Typography } from "@mui/material";

interface IConfirmModal {
    text: string;
    isVisible?: boolean;
    primaryBtnClick: () => void;
    secondaryBtnClick: () => void;
}

const ConfirmModal: FC<IConfirmModal> = ({ text, isVisible = false, primaryBtnClick, secondaryBtnClick }) => {

    return (
        <>
            <Modal
                modalSettings={{
                    primaryBtnName: "",
                    secondaryBtnName: "",
                    showButtons: false,
                    isVisible,
                    showUpperButtons: true,
                    title: "",
                }}
                maxWidth="500px"
                fullWidth={false}
                callbacks={{
                    primaryBtnClick,
                    secondaryBtnClick
                }}
            >
                <div className="mb-[25px]">
                    <div className="flex justify-center mb-[10px]">
                        <Typography variant="h5">{text}</Typography>
                    </div>
                    <div className="flex justify-center">
                        <Button variant="outlined" style={{marginRight: "5px"}} onClick={secondaryBtnClick}>Нет</Button>
                        <Button variant="contained" onClick={primaryBtnClick}>Да</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ConfirmModal;
