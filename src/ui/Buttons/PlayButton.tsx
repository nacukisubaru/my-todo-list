import { FC } from "react";
import PlayIcon from "../SvgIcons/PlayIcon";

interface IPlayButton {
    onClick: () => void
}

const PlayButton:FC<IPlayButton> = ({onClick}) => {
    return (
        <>
            <button className={`lg:block hidden p-0 'bg-white'hover:bg-gray-200 h-[28px] active:outline-0 focus:outline-0`} onClick={onClick}>
                <PlayIcon />
            </button>

            <button className={`lg:hidden block p-0 'bg-white' hover:bg-gray-200 h-[28px] active:outline-0 focus:outline-0`} onTouchStart={onClick}>
                <PlayIcon />
            </button>
        </>
    );
};

export default PlayButton;
