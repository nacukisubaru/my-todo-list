import { FC } from "react";

interface ICardProps {
    width?: string;
    height?: string;
    children: any;
    background?: string;
    maxWidth?: string 
}

const Card: FC<ICardProps> = ({ children, height, width = 'w-[50vh]', background, maxWidth }) => {
    return (
        <div
            className={`max-w-sm p-6 
                ${maxWidth && maxWidth} 
                ${background ? background : "bg-white"} 
                border border-gray-200 rounded-lg shadow 
                dark:bg-gray-800 dark:border-gray-700 cursor-pointer 
                ${width && width} ${height && height}`}
        >
            {children}
        </div>
    );
};

export default Card;
