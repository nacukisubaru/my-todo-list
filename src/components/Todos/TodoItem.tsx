import { FC, useState } from "react";
import { useTaskTree } from "../../hooks/useTaskTree";
import { ITodoItem, ITodoSection } from "../../types/todo.types";
import { useAppSelector } from "../../hooks/useAppSelector";
import ToolTaskPanel from "../../ui/Tools/ToolTaskPanel/ToolTaskPanel";
import TodoChange from "../TodoChange/TodoChange";
import CheckBox from "../../ui/CheckBox/CheckBox";
import ArrowButton from "../../ui/Buttons/ArrowButton/ArrowButton";
import { useActions } from "../../hooks/useActions";

interface ITodoItemProps {
    todo: ITodoItem;
}

const TodoItem: FC<ITodoItemProps> = ({ todo }) => {
    let todos = useAppSelector((state) => state.todosReducer.todos);
    const { mutateTask, findTaskInTree, mutateAllTasks } = useTaskTree();
    const [toolPanelIsVisible, setVisibleToolPanel] = useState(true);
    const [todoEditInputs, setTodoEditInputs] = useState({
        name: "",
        text: "",
    });
    const {setActiveAddTaskBtn} = useActions();

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

    const showUpperOrLowerForm = async (
        field: string,
        fieldDisable: string
    ) => {
        const callback = (obj: any) => {
            obj.creatable = false;
            obj[fieldDisable] = false;
            obj.editable = false;
            if (obj.id !== todo.id) {
                obj[field] = false;
            } else {
                obj[field] = true;
            }
        };
        setActiveAddTaskBtn({ isActive: false });
        await mutateTask(todo.id, [{ field, value: true }], "task");
        await mutateAllTasks(callback);
    };

    const closeUpperOrLowerForm = (field: string) => {
        mutateTask(todo.id, [{ field, value: false }], "task");
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

    const openTodoChangePanel = async () => {
        const foundTask = findTaskInTree(
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

        const callback = (obj: any) => {
            obj.creatable = false;
            obj.creatableLower = false;
            obj.creatableUpper = false;
            if (obj.id !== todo.id) {
                obj.editable = false;
            } else {
                obj.editable = true;
            }
        };
        setActiveAddTaskBtn({ isActive: true });

        await mutateTask(todo.id, [{ field: "editable", value: true }], "task");
        await mutateAllTasks(callback);
    };

    const closeTodoChangePanel = () => {
        mutateTask(todo.id, [{ field: "editable", value: false }], "task");
    };

    return (
        <>
            <TodoChange
                createTodoProps={{
                    id: todo.id,
                    parentType: "task",
                }}
                buttonsSettings={{
                    primaryButtonName: "Добавить задачу",
                    secondaryButtonName: "Отмена",
                    showAddTaskBtn: false,
                }}
                inputsSettings={{
                    inputPlaceHolder: "Название задачи",
                    textPlaceHolder: "Описание",
                }}
                isVisible={todo.creatableUpper}
                callback={closeUpperAddForm}
                action="create"
            />

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
                                        name: "Добавить задачу выше",
                                        onClick: showUpperAddForm,
                                    },
                                    {
                                        name: "Добавить задачу ниже",
                                        onClick: showLowerAddForm,
                                    },
                                    {
                                        name: "Изменить задачу",
                                        onClick: () => {},
                                    },
                                    {
                                        name: "Удалить задачу",
                                        onClick: () => {},
                                    },
                                ],
                                showEditBtn: true,
                            }}
                        />
                    )}
                </div>
            )}

            <TodoChange
                createTodoProps={{
                    id: todo.id,
                    parentType: "task",
                }}
                buttonsSettings={{
                    primaryButtonName: "Добавить задачу",
                    secondaryButtonName: "Отмена",
                    showAddTaskBtn: false,
                }}
                inputsSettings={{
                    inputPlaceHolder: "Название задачи",
                    textPlaceHolder: "Описание",
                }}
                isVisible={todo.creatableLower}
                callback={closeLowerAddForm}
                action="create"
            />
        </>
    );
};

export default TodoItem;
