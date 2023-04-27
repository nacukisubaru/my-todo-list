import { FC, useEffect, useState } from "react";
import { useTaskTree } from "../../hooks/useTaskTree";
import { ITodoItem } from "../../types/todo.types";
import { useAppSelector } from "../../hooks/useAppSelector";
import ToolTaskPanel from "../../ui/Tools/ToolTaskPanel/ToolTaskPanel";
import TodoChange from "../TodoChange/TodoChange";
import CheckBox from "../../ui/CheckBox/CheckBox";
import ArrowButton from "../../ui/Buttons/ArrowButton/ArrowButton";
import { useActions } from "../../hooks/useActions";
import ToolMenu from "../../ui/Tools/ToolMenu";

interface ITodoItemProps {
    todo: ITodoItem;
}

const TodoItem: FC<ITodoItemProps> = ({ todo }) => {
    let todos = useAppSelector((state) => state.todosReducer.todos);
    const { mutateTask, findTaskInTree } = useTaskTree();
    const [toolPanelIsVisible, setVisibleToolPanel] = useState(true);
    const [todoChangeIsOpen, setOpenTodoChange] = useState(false);
    const [todoEditInputs, setTodoEditInputs] = useState({
        name: "",
        text: "",
    });
    const { editableTaskId, prevEditableTaskId } = useAppSelector(
        (state) => state.uiReducer
    );
    const { setEditableTaskId } = useActions();

    const toggleTaskList = (id: number, type: string) => {
        const mutate = (value: any) => {
            mutateTask(id, [{ field: "showTasks", value }], type);
        };
        return mutate;
    };

    const showToolPanel = () => {
        setVisibleToolPanel(true);
    };

    const hideToolPanel = () => {
        setVisibleToolPanel(false);
    };

    const openTodoChangePanel = () => {
        const foundTask: ITodoItem | false = findTaskInTree(
            todos,
            todo.id,
            "task"
        );
        if (foundTask !== false) {
            setTodoEditInputs({
                name: foundTask.name,
                text: foundTask.description,
            });
        }
        setOpenTodoChange(true);
        setEditableTaskId({ id: todo.id });
    };

    const closeTodoChangePanel = () => {
        setOpenTodoChange(false);
        setEditableTaskId({ id: 0 });
    };

    useEffect(() => {
        if (prevEditableTaskId === todo.id) {
            setOpenTodoChange(false);
        }
    }, [editableTaskId]);

    return (
        <>
            {!editableTaskId ||
                (editableTaskId === todo.id && (
                    <TodoChange
                        createTodoProps={{
                            id: todo.id,
                            parentType: "task",
                        }}
                        buttonsSettings={{
                            primaryButtonName: "Изменить задачу",
                            secondaryButtonName: "Отмена",
                            showAddTaskBtn: false,
                        }}
                        inputsSettings={{
                            inputPlaceHolder: "Название задачи",
                            textPlaceHolder: "Описание",
                            inputValue: todoEditInputs.name,
                            textValue: todoEditInputs.text,
                        }}
                        showPanel={todoChangeIsOpen}
                        callback={closeTodoChangePanel}
                        action="change"
                    />
                ))}

            {!todoChangeIsOpen && (
                <div
                    className="display flex justify-between"
                    onMouseOver={showToolPanel}
                    onMouseOut={hideToolPanel}
                >
                    <div className="display flex">
                        <div className="-mt-[3px] mr-3">
                            {todo.items.length > 0 && (
                                <ArrowButton
                                    isArrowOpen={todo.showTasks}
                                    onClick={toggleTaskList(todo.id, todo.type)}
                                />
                            )}
                        </div>
                        <CheckBox label={todo.name} />
                    </div>
                    {toolPanelIsVisible && (
                        <ToolTaskPanel
                            callbacks={{
                                clickEditBtn: openTodoChangePanel,
                            }}
                            settings={{
                                menuItems: [
                                    {
                                        id: 1,
                                        name: "Добавить задачу выше",
                                    },
                                    {
                                        id: 2,
                                        name: "Добавить задачу ниже",
                                    },
                                    { id: 3, name: "Изменить задачу" },
                                    { id: 4, name: "Удалить задачу" },
                                ],
                                showEditBtn: true,
                            }}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default TodoItem;
