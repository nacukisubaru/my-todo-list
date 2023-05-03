import { FC, useEffect, useState } from "react";
import AddSectionButton from "../../ui/Buttons/AddSectionButton/AddSectionButton";
import TodoChange from "../TodoChange/TodoChange";
import { useActions } from "../../hooks/useActions";
import { useAppSelector } from "../../hooks/useAppSelector";
import { changeAction } from "../../types/ui.types";

interface ITodoChangeSectionProps {
    id: string;
    sort: number;
    action: changeAction;
    isVisible?: boolean;
    primaryButtonName: string;
    callback?: () => void;
    showBtn?: boolean,
    nameValue: string
}

const TodoChangeSection: FC<ITodoChangeSectionProps> = ({
    id,
    sort,
    action,
    isVisible,
    primaryButtonName,
    callback,
    showBtn = true,
    nameValue
}) => {
    const isActiveBtn = useAppSelector(
        (state) => state.uiReducer.isActiveAddSectionBtn
    );
    const [isVisibleAddSection, setVisibleAddSection] = useState(false);
    const { setActiveAddSectionBtn } = useActions();
    const openAddSection = () => {
        setActiveAddSectionBtn({ isActive: false });
        setVisibleAddSection(true);
    };

    const closeAddSection = () => {
        callback && callback();
        setVisibleAddSection(false);
        setActiveAddSectionBtn({ isActive: true });
    };

    useEffect(() => {
        if (isVisible !== undefined) {
            setVisibleAddSection(isVisible);
        }
    }, [isVisible]);

    return (
        <>
            <TodoChange
                id={id}
                buttonsSettings={{
                    primaryButtonName,
                    secondaryButtonName: "Отмена",
                }}
                inputsSettings={{
                    inputPlaceHolder: "Название раздела",
                    textPlaceHolder: "Описание",
                    inputValue: nameValue
                }}
                isVisible={isVisibleAddSection}
                sortByPosition={{ position: "lower", sortPosition: sort }}
                callback={closeAddSection}
                action={action}
            />
            {isActiveBtn && showBtn && <AddSectionButton onClick={openAddSection} />}
        </>
    );
};

export default TodoChangeSection;
