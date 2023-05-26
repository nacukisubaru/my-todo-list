import { FC } from "react";

interface ICardProps {
    width: string;
    children: any;
    background?: string;
}

const Card: FC<ICardProps> = ({ children, width, background }) => {
    return (
        <div
            className={`max-w-sm p-6 ${
                background ? background : "bg-white"
            } border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer ${
                width && width
            }`}
        >
            {children}
        </div>
    );
};

export default Card;
