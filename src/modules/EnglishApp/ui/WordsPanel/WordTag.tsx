import { Button } from "@mui/material";
import { FC } from "react";

interface IWordTag {
    children: any
}

const WordTag: FC<IWordTag> = ({children}) => {
    return (
     
        <Button
            color="primary"
            disabled={false}
            size="small"
            variant="outlined"
            style={{borderRadius:'27px', textTransform: 'lowercase', cursor: 'pointer'}}
        >
            {children}
        </Button>
      
    );
};

export default WordTag;
