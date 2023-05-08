import { FC, useEffect, useState } from "react";

interface IAddSectionButtonProps {
    onClick: () => void;
    hideBtnByDefault?: boolean;
}

const AddSectionButton: FC<IAddSectionButtonProps> = ({ onClick, hideBtnByDefault = true }) => {
    const [isVisible, setVisible] = useState(false);

    const showBtn = () => {
        if (hideBtnByDefault) {
            setVisible(true);
        }
    }

    const hideBtn = () => {
        if (hideBtnByDefault) { 
            setVisible(false);
        }
    }

    useEffect(() => {
        if (hideBtnByDefault === false) {
            setVisible(true);
        }
    }, [hideBtnByDefault])

    return (
        <div className="h-[50px]" onMouseOver={showBtn} onMouseLeave={hideBtn}>
            {isVisible && (
                <button className="w-[100%]" onClick={onClick}>
                    Добавить раздел
                </button>
            )}
        </div>
    );
};

export default AddSectionButton;
