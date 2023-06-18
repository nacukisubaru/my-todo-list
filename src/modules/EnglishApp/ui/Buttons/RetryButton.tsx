import { FC } from "react";
import retrySticker from "../../../../assets/retry-svgrepo-com.png";

interface IRetryProps {
    onClick: () => void;
}

const RetryButton: FC<IRetryProps> = ({onClick}) => {
    return (
        <button
            className={`p-0  'bg-white' hover:bg-gray-200 h-[67px] w-[67px] active:outline-0 focus:outline-0`}
            onClick={onClick}
        >
            <img src={retrySticker} width="67px"></img>
        </button>
    );
};

export default RetryButton;
