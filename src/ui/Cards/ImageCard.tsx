import { FC } from "react";
import Card from "./Card";

interface ICardImage {
    width: string,
    name: string,
    path: string,
}

const ImageCard: FC<ICardImage> = ({name, path, width}) => {
    return (
        <Card width={width}>
            <img className={`${width && width}`} src={path} alt={name} />
            {name}
        </Card>
    );
}

export default ImageCard;