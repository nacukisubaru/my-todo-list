import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface CustomSnackBar {
    severity: "success" | "error" | "warning" | "info" | "success",
    message: string,
    isOpen?: boolean,
    onClose?: () => void 
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackBar: React.FC<CustomSnackBar> = ({severity, message, isOpen = true, onClose}) => {
    const [open, setOpen] = React.useState(isOpen);

    React.useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }

        onClose && onClose();
        setOpen(false);
    };

    return (
        <Snackbar open={open}  onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={severity}
                sx={{ width: "100%", maxWidth: "400px" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}


export default CustomSnackBar;