import { FC } from "react";
import { useToolTodo } from "../../hooks/useToolTodo";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTaskTree } from "../../hooks/useTaskTree";
import { ITodoItem } from "../../types/todo.types";
import { useActions } from "../../hooks/useActions";
import ToolTaskPanel from "../../ui/Tools/ToolTaskPanel/ToolTaskPanel";
import TodoChange from "../TodoChange/TodoChange";
import CheckBox from "../../ui/CheckBox/CheckBox";
import ArrowButton from "../../ui/Buttons/ArrowButton/ArrowButton";

interface ITodoItemProps {
    todo: ITodoItem;
    showSubtasks?: boolean;
    onClick: () => void;
}

const TodoItem: FC<ITodoItemProps> = ({
    todo,
    showSubtasks = true,
    onClick,
}) => {
    const { mutateTask, completeTasks, removeTask, findTaskInTree } = useTaskTree();
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

    const { isVisibleDetailTodo } = useAppSelector((state) => state.uiReducer);
    const {setCurrentTodo} = useActions();

    const closeUpperOrLowerForm = (field: string) => {
        mutateTask(
            todo.id,
            [{ field, value: false }],
            false,
            isVisibleDetailTodo
        );
    };

    const showLowerAddForm = async () => {
        showUpperOrLowerForm("creatableLower", "creatableUpper");
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

    const completeTodo = async (isComplete: boolean) => {
        const tasks = await completeTasks(todo.id, isComplete);
        if (isVisibleDetailTodo) {
            if (todo.parentId) {
                const parent = findTaskInTree(tasks, todo.parentId);
                if (parent) {
                    const task = findTaskInTree(tasks, parent.id);
                    if (task) {
                        setCurrentTodo({todo: task});
                    }
                }
            }
        }
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
                editorHeight="150px"
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
                    textTwoValue: todoEditInputs.textTwo
                }}
                isVisible={todo.editable}
                callback={closeTodoChangePanel}
                isVisibleEditor={true}
                action="change"
                editorHeight="150px"
            />

            {!todo.editable && (
                <div
                    className="display flex justify-between"
                    onMouseOver={showToolPanel}
                    onMouseOut={hideToolPanel}
                >
                    <div className="display flex">
                        {todo.items.length > 0 && showSubtasks && (
                            <div className="-mt-[3px] mr-3 -ml-[24px]">
                                <ArrowButton
                                    isArrowOpen={todo.showTasks}
                                    onClick={toggleTaskList}
                                />
                            </div>
                        )}

                        <CheckBox
                            label={todo.name}
                            onClick={onClick}
                            checkCallback={completeTodo}
                            checked={todo.isComplete}
                        />
                    </div>
                    <div className="display flex justify-end -mt-[5px]">
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
                                        isDeactive: todo.isComplete
                                    },
                                    {
                                        name: "Добавить задачу ниже",
                                        onClick: showLowerAddForm,
                                        isDeactive: todo.isComplete
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
                                translateX: "-translate-x-[151px]",
                                translateY: '-translate-y-[80px]'
                            }}
                        />
                    )}
                    </div>
                </div>
            )}
        </>
    );
};

export default TodoItem;
