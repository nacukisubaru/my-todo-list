import { FC } from "react";
import { useToolTodo } from "../../hooks/useToolTodo";
import { IToolTaskSettings } from "../../types/ui.types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTaskTree } from "../../hooks/useTaskTree";
import { ITodoItem } from "../../types/todo.types";
import ToolTaskPanel from "../../ui/Tools/ToolTaskPanel/ToolTaskPanel";
import TodoChange from "../TodoChange/TodoChange";
import CheckBox from "../../ui/CheckBox/CheckBox";
import ArrowButton from "../../ui/Buttons/ArrowButton/ArrowButton";

interface ITodoItemProps {
    todo: ITodoItem;
    toolTaskSettings?: IToolTaskSettings;
    showSubtasks?: boolean;
    onClick: () => void;
}

const TodoItem: FC<ITodoItemProps> = ({ todo, toolTaskSettings, showSubtasks = true, onClick }) => {
    const { mutateTask, removeTask } = useTaskTree();
    const {
        toggleTaskList,
        showUpperOrLowerForm,
        openTodoChangePanel,
        showToolPanel,
        hideToolPanel,
        closeTodoChangePanel,
        toolPanelIsVisible,
        todoEditInputs,
    } = useToolTodo(todo.id, "todo");

    const {isVisibleDetailTodo} = useAppSelector(state => state.uiReducer);

    const closeUpperOrLowerForm = (field: string) => {
        mutateTask(todo.id, [{ field, value: false }], false, isVisibleDetailTodo);
    };

    const showLowerAddForm = async () => {
        showUpperOrLowerForm("creatableLower", "creatableUpper");
    };

    const closeLowerAddForm = async () => {
        closeUpperOrLowerForm("creatableLower");
    };

    const showUpperAddForm = () => {
        showUpperOrLowerForm("creatableUpper", "creatableLower");
    };

    const closeUpperAddForm = () => {
        closeUpperOrLowerForm("creatableUpper");
    };

    const removeTodo = () => {
        removeTask(todo.id);
    };

    return (
        <>
            <TodoChange
                id={todo.id}
                buttonsSettings={{
                    primaryButtonName: "Добавить задачу",
                    secondaryButtonName: "Отмена",
                }}
                inputsSettings={{
                    inputPlaceHolder: "Название задачи",
                    textPlaceHolder: "Описание",
                }}
                isVisible={todo.creatableUpper}
                sortByPosition={{ position: "upper" }}
                callback={closeUpperAddForm}
                action="create"
            />

            <TodoChange
                id={todo.id}
                buttonsSettings={{
                    primaryButtonName: "Изменить задачу",
                    secondaryButtonName: "Отмена",
                }}
                inputsSettings={{
                    inputPlaceHolder: "Название задачи",
                    textPlaceHolder: "Описание",
                    inputValue: todoEditInputs.name,
                    textValue: todoEditInputs.text,
                }}
                isVisible={todo.editable}
                callback={closeTodoChangePanel}
                action="change"
            />

            {!todo.editable && (
                <div
                    className="display flex justify-between"
                    onMouseOver={showToolPanel}
                    onMouseOut={hideToolPanel}
                >
                    <div className="display flex">
                        <div className="-mt-[3px] mr-3">
                            {todo.items.length > 0 && showSubtasks && (
                                <ArrowButton
                                    isArrowOpen={todo.showTasks}
                                    onClick={toggleTaskList}
                                />
                            )}
                        </div>
                      
                        <CheckBox label={todo.name} onClick={onClick}/>
                    </div>
                    {toolPanelIsVisible && (
                        <ToolTaskPanel
                            callbacks={{
                                clickEditBtn: openTodoChangePanel,
                            }}
                            settings={{
                                menuItems: [
                                    {
                                        name: "Добавить задачу выше",
                                        onClick: showUpperAddForm,
                                    },
                                    {
                                        name: "Добавить задачу ниже",
                                        onClick: showLowerAddForm,
                                    },
                                    {
                                        name: "Изменить задачу",
                                        onClick: openTodoChangePanel,
                                    },
                                    {
                                        name: "Удалить задачу",
                                        onClick: removeTodo,
                                    },
                                ],
                                showEditBtn: true,
                                ...toolTaskSettings
                            }}
                        />
                        )}
                </div>
            )}

            <TodoChange
                id={todo.id}
                buttonsSettings={{
                    primaryButtonName: "Добавить задачу",
                    secondaryButtonName: "Отмена",
                }}
                inputsSettings={{
                    inputPlaceHolder: "Название задачи",
                    textPlaceHolder: "Описание",
                }}
                isVisible={todo.creatableLower}
                sortByPosition={{ position: "lower" }}
                callback={closeLowerAddForm}
                action="create"
            />
        </>
    );
};

export default TodoItem;
