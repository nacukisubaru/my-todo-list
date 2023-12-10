import { FC, useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface IArrowWithTextProps {
    onClick?: (isArrowUp: boolean) => void,
    children: any,
    content: any,
    alwaysChangeContent?: boolean
}

const ArrowWithText: FC<IArrowWithTextProps> = ({onClick, alwaysChangeContent = false, children, content}) => {
    const [isArrowUp, setArrowUp] = useState(false);

    const switchArrow = () => {
        if (isArrowUp) {
            setArrowUp(false);
        } else {
            setArrowUp(true);
        }

        if (alwaysChangeContent) {
            onClick && onClick(isArrowUp);
        }

        if (!content && !alwaysChangeContent) {
           onClick && onClick(isArrowUp);
        }
    }

    return (
        <>
            <div className="font-bold cursor-pointer" onClick={switchArrow}>{children}{isArrowUp ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon/>}</div>
            <div>{isArrowUp && content}</div>
        </>
    );
};

export default ArrowWithText;


