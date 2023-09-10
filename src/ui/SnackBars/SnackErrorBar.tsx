import { Alert, Button, Snackbar } from "@mui/material"
import { FC, useEffect, useState } from "react";

interface ISnackErrorBar {
    error: IError
}

const SnackErrorBar: FC<ISnackErrorBar> = ({error}) => {
    const [isOpen, setOpen] = useState(false);
    useEffect(() => {
        if (error.message || error.errorCode) {
            setOpen(true);
        }
    }, [error]);

    const close = () => {
        setOpen(false);
    }

    return (
        <>
            <Snackbar open={isOpen} autoHideDuration={6000} onClose={close}>
                <Alert severity="error" sx={{ width: '100%' }} onClose={close}>                
                    {error.message} 
                    {error.errorCode && error.errorCode === 'settingsNotSupportLang' ? <Button variant="outlined" color="error">Перейти к настройкам</Button> : ''}
                </Alert>
            </Snackbar>
        </>
    );
}

export default SnackErrorBar;