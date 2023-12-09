import { Button } from "@mui/material";
import { FC } from "react";

interface IWordTag {
    children: any,
    isActive?: boolean,
    onClick?: (word: string, isActive: boolean) => void
}

const WordTag: FC<IWordTag> = ({children, isActive = false, onClick}) => {
    
    return (
        <>
            <div className="lg:inline-block hidden">
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
            </div>
            <div className="lg:hidden inline-block">
                <Button
                    color="primary"
                    disabled={false}
                    size="small"
                    variant={isActive ? "contained" : "outlined"}
                    style={{borderRadius:'27px', textTransform: 'lowercase', cursor: 'pointer'}}
                    onTouchStart={() => {onClick && onClick(children, isActive)}}
                    className="lg:hidden block"
                >
                    {children}
                </Button>
            </div>
        </>
    );
};

export default WordTag;
