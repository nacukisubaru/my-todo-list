import { Button } from "@mui/material";
import { FC, useState } from "react";

interface IWordTag {
    children: any,
    isActive?: boolean,
    onClick: (isActive: boolean) => void
}

const WordTag: FC<IWordTag> = ({children, isActive = false, onClick}) => {
    const [active, setActive] = useState(isActive);
    const changeTag = () => {
        if (active) {
            setActive(false);
        } else {
            setActive(true);
        }

        onClick(active);
    }

    return (
        <Button
            color="primary"
            disabled={false}
            size="small"
            variant={active ? "contained" : "outlined"}
            style={{borderRadius:'27px', textTransform: 'lowercase', cursor: 'pointer'}}
            onClick={changeTag}
        >
            {children}
        </Button>
      
    );
};

export default WordTag;
