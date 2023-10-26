import { Button } from "@mui/material";
import { FC, useState } from "react";

interface IWordTag {
    children: any,
    onClick: (isActive: boolean) => void
}

const WordTag: FC<IWordTag> = ({children, onClick}) => {
    const [isActive, setActive] = useState(false);
    const changeTag = () => {
        if (isActive) {
            setActive(false);
        } else {
            setActive(true);
        }

        onClick(isActive);
    }

    return (
        <Button
            color="primary"
            disabled={false}
            size="small"
            variant={isActive ? "contained" : "outlined"}
            style={{borderRadius:'27px', textTransform: 'lowercase', cursor: 'pointer'}}
            onClick={changeTag}
        >
            {children}
        </Button>
      
    );
};

export default WordTag;
