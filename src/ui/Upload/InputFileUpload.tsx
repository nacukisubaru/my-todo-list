import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FC } from "react";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

interface InputFileUploadProps {
    onChange: (e: any) => void;
}

const InputFileUpload: FC<InputFileUploadProps> = ({onChange}) => {
    return (
        <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
        >
            Upload file
            <VisuallyHiddenInput type="file" onChange={onChange}/>
        </Button>
    );
};

export default InputFileUpload;
