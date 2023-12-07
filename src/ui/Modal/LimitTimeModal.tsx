import { FC, useEffect, useState } from "react";
import Modal from "./Modal";
import { Box, Button, LinearProgress, Typography } from "@mui/material";

interface ILimitTimeModal {
    limitTime?: number;
    text: string;
    isVisible?: boolean;
    primaryBtnClick: () => void;
    secondaryBtnClick: () => void;
}

const LimitTimeModal: FC<ILimitTimeModal> = ({ limitTime = 250, text, isVisible = false, primaryBtnClick, secondaryBtnClick }) => {
    const [progress, setProgress] = useState(0);
    const [isProgressComplete, setProgressComplete] = useState(false);
    const [timerId, setTimerId] = useState<NodeJS.Timer>();

    useEffect(() => {
        if (isVisible) {
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        setProgressComplete(true);
                        return 0;
                    }
                    const diff = Math.random() * 10;
                    return Math.min(oldProgress + diff, 100);
                });
            }, limitTime);
            setTimerId(timer);
        }
    }, [isVisible]);

    const reset = () => {
        setProgress(0);
        if (timerId) {
            clearInterval(timerId);
        }
    }

    useEffect(() => {
        if (isProgressComplete) {
            reset();
            primaryBtnClick();
        }
    }, [isProgressComplete]);

    const executePrimary = () => {
        reset();
        primaryBtnClick();
    }
    
    const close = () => {
        reset();
        secondaryBtnClick();
    }

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
                    primaryBtnClick: executePrimary,
                    secondaryBtnClick: close
                }}
            >
                <div className="mb-[25px]">
                    <div className="flex justify-center mb-[10px]">
                        <Typography variant="h5">{text}</Typography>
                    </div>
                    <div className="flex justify-center">
                        <Button variant="outlined" style={{marginRight: "5px"}} onClick={close}>Нет</Button>
                        <Button variant="contained" onClick={executePrimary}>Да</Button>
                    </div>
                </div>
                <Box sx={{ width: "100%" }}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            </Modal>
        </>
    );
};

export default LimitTimeModal;
