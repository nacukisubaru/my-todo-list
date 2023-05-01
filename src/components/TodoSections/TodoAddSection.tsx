import { FC, useState } from "react";
import AddSectionButton from "../../ui/Buttons/AddSectionButton/AddSectionButton";
import TodoChange from "../TodoChange/TodoChange";
import { useActions } from "../../hooks/useActions";
import { useAppSelector } from "../../hooks/useAppSelector";

interface ITodoAddSectionProps {
    id: string,
    sort: number
}

const TodoAddSection: FC<ITodoAddSectionProps> = ({id, sort}) => {
    const isActiveBtn = useAppSelector(state => state.uiReducer.isActiveAddSectionBtn);
    const [isVisibleAddSection, setVisibleAddSection] = useState(false);
    const {setActiveAddSectionBtn} = useActions();
    const openAddSection = () => {
        setActiveAddSectionBtn({isActive: false});
        setVisibleAddSection(true);
    }

    const closeAddSection = () => {
        setVisibleAddSection(false);
        setActiveAddSectionBtn({isActive: true});
    }
    return (
        <>
            <TodoChange
                id={id}
                buttonsSettings={{
                    primaryButtonName: "Добавить раздел",
                    secondaryButtonName: "Отмена",
                    showAddTaskBtn: true,
                }}
                inputsSettings={{
                    inputPlaceHolder: "Название раздела",
                    textPlaceHolder: "Описание",
                }}
                isVisible={isVisibleAddSection}
                sortByPosition={{position: "lower", sortPosition: sort}}
                callback={closeAddSection}
                action="createSection"
            />
            {isActiveBtn && (
                <AddSectionButton onClick={openAddSection} />
            )}
        </>
    );
};

export default TodoAddSection;
