import { FC, useEffect } from "react";
import { getTodosBySection } from "../../store/services/todo/todo.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import TodoChange from "../TodoChange/TodoChange";
import TodoSection from "./TodoSection";
import TodosList from "../Todos/TodosList";
import AddTaskButton from "../../ui/Buttons/AddTaskButton/AddTaskButton";
import { useTaskTree } from "../../hooks/useTaskTree";
import { useActions } from "../../hooks/useActions";

const TodoSectionsList: FC = () => {
    let todos = useAppSelector((state) => state.todosReducer.todos);
    let isActiveAddTaskBtn = useAppSelector((state) => state.uiReducer.isActiveAddTaskBtn);
    const dispatch = useDispatch();
    const { mutateTask, mutateAllTasks } = useTaskTree();
    const { setActiveAddTaskBtn } = useActions();

    useEffect(() => {
        const getTodos = async () => {
            await dispatch(getTodosBySection(1));
        };
        getTodos();
    }, []);

    const openAddTodoForm = async (id: number | string) => {
        setActiveAddTaskBtn({ isActive: false });
    
        const callback = (obj: any) => {
            obj.creatableUpper = false;
            obj.creatableLower = false;
            obj.editable = false;
            if (obj.type === "section" && obj.id === id) {
                obj.creatable = true;
            }
        };
        await mutateAllTasks(callback);
    };

    const closeAddTodoForm = (id: number | string) => {
        setActiveAddTaskBtn({ isActive: true });
        mutateTask(id, [{ field: "creatable", value: false }], "section");
    };

    return (
        <div className="display flex justify-center">
            <ul className="w-[55%] mt-[50px]">
                {todos.map((section) => {
                    return (
                        <li className="mb-10" key={section.id}>
                            <TodoSection section={section} />
                            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-[10px]" />
                            {section.showTasks && (
                                <TodosList todoitems={section.items} />
                            )}

                            <TodoChange
                                createTodoProps={{
                                    id: section.id,
                                    parentType: "section",
                                }}
                                buttonsSettings={{
                                    primaryButtonName: "Добавить задачу",
                                    secondaryButtonName: "Отмена",
                                    showAddTaskBtn: true,
                                }}
                                inputsSettings={{
                                    inputPlaceHolder: "Название задачи",
                                    textPlaceHolder: "Описание",
                                }}
                                isVisible={section.creatable}
                                callback={() => {closeAddTodoForm(section.id)}}
                            />
                            {isActiveAddTaskBtn && (
                                <AddTaskButton
                                    onClick={() => {
                                        openAddTodoForm(section.id);
                                    }}
                                />
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TodoSectionsList;
