import { FC } from "react";
import studySticker from "../../../../assets/education-school-study-sticker-svgrepo-com.png";

interface IStudyButtonProps {
    onClick: () => void;
}

const StudyButton: FC<IStudyButtonProps> = ({ onClick }) => {
    return (
        <button
            className={`p-0  'bg-white' hover:bg-gray-200 h-[67px] w-[67px] active:outline-0 focus:outline-0`}
            onClick={onClick}
        >
            <img src={studySticker} width="67px"></img>
        </button>
    );
};

export default StudyButton;
