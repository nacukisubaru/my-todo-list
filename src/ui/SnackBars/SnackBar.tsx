import { Alert, AlertColor, Snackbar } from "@mui/material"
import { FC, ReactNode, useEffect, useState } from "react";

interface ISnackBar {
    isOpen: boolean,
    type: AlertColor,
    children: ReactNode
}

const SnackBar: FC<ISnackBar> = ({isOpen, type, children}) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const close = () => {
        setOpen(false);
    }

    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={close}>
                <Alert severity={type} sx={{ width: '100%' }} onClose={close}>                
                    {children}
                </Alert>
            </Snackbar>
        </>
    );
}

export default SnackBar;