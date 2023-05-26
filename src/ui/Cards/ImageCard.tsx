import { FC } from "react";
import Card from "./Card";

interface ICardImage {
    width: string,
    name: string,
    path: string,
    height?: string,
    maxHeight?: string,
    cardColor?: string
}

const ImageCard: FC<ICardImage> = ({name, path, width, cardColor, maxHeight, height}) => {
    return (
        <Card width={width} background={cardColor}>
            <img className={`${width && width} ${maxHeight ? maxHeight: 'max-h-[111px]'} ${height ? height: 'h-[111px]'}`} src={path} alt={name} />
            <div className="truncate ...">{name}</div>
        </Card>
    );
}

export default ImageCard;