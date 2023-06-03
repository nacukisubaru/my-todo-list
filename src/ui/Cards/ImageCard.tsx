import { FC, useState } from "react";
import Card from "./Card";
import ToolMenu from "../Tools/ToolMenu";
import MenuButton from "../Buttons/MenuButton";
import { IMenuItem } from "../../types/ui.types";
import PlayVideo from "../Icons/PlayVideo";
import { getExtensionFromStr } from "../../helpers/stringHelper";

interface ICardImage {
    width: string;
    name: string;
    path: string;
    height?: string;
    maxHeight?: string;
    cardColor?: string;
    menuItems: IMenuItem[];
}

const ImageCard: FC<ICardImage> = ({
    name,
    path,
    width,
    cardColor,
    maxHeight,
    height,
    menuItems,
}) => {
    const [isVisibleMenu, setVisibleMenu] = useState(false);

    const showMenu = () => {
        setVisibleMenu(true);
    };

    return (
        <Card width={width} background={cardColor}>
            {getExtensionFromStr(path) == ".mp4" ||
            getExtensionFromStr(path) == ".webm" ? (
                <div className={`${height ? height : "h-[112px]"}`}>
                    <div className={`display flex justify-center`}>
                        <PlayVideo />
                    </div>
                    {name}
                </div>
            ) : (
                <img
                    className={`${width && width} ${
                        maxHeight ? maxHeight : "max-h-[111px]"
                    } ${height ? height : "h-[112px]"}`}
                    src={path}
                    alt={name}
                />
            )}

            <div className="w-[88%] truncate ...">{name}</div>
            <div className="display flex justify-end">
                <MenuButton color={cardColor} onClick={showMenu} />
            </div>
            {isVisibleMenu && (
                <ToolMenu
                    position="static"
                    translateX="translate-x-[100px]"
                    menuItems={menuItems}
                    onMouseLeave={() => {
                        setVisibleMenu(false);
                    }}
                />
            )}
        </Card>
    );
};

export default ImageCard;
