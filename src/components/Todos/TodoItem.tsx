import { FC, useState } from "react";
import { useTaskTree } from "../../hooks/useTaskTree";
import { ITodoItem } from "../../types/todo.types";
import { useAppSelector } from "../../hooks/useAppSelector";
import ToolTaskPanel from "../../ui/Tools/ToolTaskPanel/ToolTaskPanel";
import TodoChange from "../TodoChange/TodoChange";
import CheckBox from "../../ui/CheckBox/CheckBox";
import ArrowButton from "../../ui/Buttons/ArrowButton/ArrowButton";

interface ITodoItemProps {
    todo: ITodoItem;
}

const TodoItem: FC<ITodoItemProps> = ({ todo }) => {
    let todos = useAppSelector((state) => state.todosReducer.todos);
    const { mutateTask, findTaskInTree } = useTaskTree();
    const [toolPanelIsVisible, setVisibleToolPanel] = useState(false);
    const [todoChangeIsOpen, setOpenTodoChange] = useState(false);
    const [todoEditInputs, setTodoEditInputs] = useState({name: '', text: ''});

    const toggleTaskList = (id: number, type: string) => {
        const mutate = (value: any) => {
            mutateTask(id, "showTasks", value, type);
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
        const foundTask: ITodoItem | false = findTaskInTree(todos, todo.id, 'task');
        if (foundTask !== false) {
            setTodoEditInputs({name: foundTask.name, text: ''})
        }
        setOpenTodoChange(true);
    };

    const closeTodoChangePanel = () => {
        setOpenTodoChange(false);
    };

    return (
        <>
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
                    inputValue:todoEditInputs.name,
                    textValue: todoEditInputs.text
                }}
                showPanel={todoChangeIsOpen}
                callback={closeTodoChangePanel}
                action="change"
            />
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
                            callbacks={{ clickEditBtn: openTodoChangePanel }}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default TodoItem;
