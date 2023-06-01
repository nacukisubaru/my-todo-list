import { FC } from "react";
import Card from "./Card";
import TrashButton from "../Buttons/TrashButton";

interface ICardImage {
    width: string;
    name: string;
    path: string;
    height?: string;
    maxHeight?: string;
    cardColor?: string;
    removeFile: () => void;
}

const ImageCard: FC<ICardImage> = ({
    name,
    path,
    width,
    cardColor,
    maxHeight,
    height,
    removeFile,
}) => {
    return (
        <Card width={width} background={cardColor}>
            <img
                className={`${width && width} ${
                    maxHeight ? maxHeight : "max-h-[111px]"
                } ${height ? height : "h-[111px]"}`}
                src={path}
                alt={name}
            />
            <div className="display flex justify-between">
                <div className="w-[88%] truncate ...">{name}</div>
                <TrashButton onClick={removeFile} />
            </div>
        </Card>
    );
};

export default ImageCard;
