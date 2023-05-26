import { FC } from "react";

interface ICardProps {
    width: string;
    children: any;
}

const Card: FC<ICardProps> = ({ children, width }) => {
    return (
        <div
            className={`max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ${
                width && width
            }`}
        >
            {children}
        </div>
    );
};

export default Card;
