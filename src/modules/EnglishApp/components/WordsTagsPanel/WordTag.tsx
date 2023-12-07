import { Button } from "@mui/material";
import { FC } from "react";

interface IWordTag {
    children: any,
    isActive?: boolean,
    onClick?: (word: string, isActive: boolean) => void
}

const WordTag: FC<IWordTag> = ({children, isActive = false, onClick}) => {
    
    return (
        <Button
            color="primary"
            disabled={false}
            size="small"
            variant={isActive ? "contained" : "outlined"}
            style={{borderRadius:'27px', textTransform: 'lowercase', cursor: 'pointer'}}
            onClick={() => {onClick && onClick(children, isActive)}}
        >
            {children}
        </Button>
      
    );
};

export default WordTag;
