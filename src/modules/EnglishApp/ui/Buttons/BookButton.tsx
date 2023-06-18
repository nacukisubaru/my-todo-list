import { FC } from "react";
import bookSticker from "../../../../assets/education-school-study-sticker-8-svgrepo-com.png";

interface IBookButtonProps {
    onClick: () => void;
}

const BookButton: FC<IBookButtonProps> = ({ onClick }) => {
    return (
        <button
            className={`p-0  'bg-white' hover:bg-gray-200 h-[67px] w-[67px] active:outline-0 focus:outline-0`}
            onClick={onClick}
        >
            <img src={bookSticker} width="67px"></img>
        </button>
    );
};

export default BookButton;
