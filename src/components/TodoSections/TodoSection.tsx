import { FC } from "react";
import { ITodoItem } from "../../types/todo.types";
import ArrowButton from "../../ui/Buttons/ArrowButton/ArrowButton";
import ToolTaskPanel from "../../ui/Tools/ToolTaskPanel/ToolTaskPanel";
import TodoChangeSection from "./TodoChangeSection";
import { useToolTodo } from "../../hooks/useToolTodo";
import { useTaskTree } from "../../hooks/useTaskTree";

interface ITodoSectionProps {
    section: ITodoItem;
}

const TodoSection: FC<ITodoSectionProps> = ({ section }) => {
    const {
        toggleTaskList,
        showToolPanel,
        hideToolPanel,
        closeTodoChangePanel,
        openTodoChangePanel,
        toolPanelIsVisible,
        todoEditInputs,
    } = useToolTodo(section.id, "section");

    const {removeTask} = useTaskTree();

    const removeSection = () => {
        removeTask(section.id, true);
    }

    return (
        <>
            <TodoChangeSection
                id={section.id}
                sort={section.sort}
                action={"changeSection"}
                isVisible={section.editable}
                primaryButtonName="Изменить раздел"
                callback={closeTodoChangePanel}
                showBtn={false}
                nameValue={todoEditInputs.name}
            />
            {!section.editable && (
                <div
                    className="display flex justify-between"
                    onMouseOver={showToolPanel}
                    onMouseOut={hideToolPanel}
                >
                    <div className="display flex">
                        <span className="mt-[0px]">
                            <ArrowButton
                                isArrowOpen={section.showTasks}
                                onClick={toggleTaskList}
                            />
                        </span>
                        <span className="font-bold ml-3">{section.name}</span>
                    </div>
                    {toolPanelIsVisible && (
                        <ToolTaskPanel
                            callbacks={{
                                clickEditBtn: () => {},
                            }}
                            settings={{
                                menuItems: [
                                    {
                                        name: "Изменить раздел",
                                        onClick: openTodoChangePanel,
                                    },
                                    {
                                        name: "Удалить раздел",
                                        onClick: removeSection,
                                    },
                                ],
                                showEditBtn: false,
                            }}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default TodoSection;
