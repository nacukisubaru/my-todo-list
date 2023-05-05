import { FC, useState } from "react";

interface IAddSectionButtonProps {
    onClick: () => void;
}

const AddSectionButton: FC<IAddSectionButtonProps> = ({ onClick }) => {
    const [isVisible, setVisible] = useState(false);

    const showBtn = () => {
        setVisible(true);
    }

    const hideBtn = () => {
        setVisible(false);
    }

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
