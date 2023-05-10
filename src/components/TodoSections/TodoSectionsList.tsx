import { FC, useEffect, useState } from "react";
import { getTodosBySection } from "../../store/services/todo/todo.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import TodoChange from "../TodoChange/TodoChange";
import TodoSection from "./TodoSection";
import TodosList from "../Todos/TodosList";
import AddTaskButton from "../../ui/Buttons/AddTaskButton/AddTaskButton";
import { useTaskTree } from "../../hooks/useTaskTree";
import { useActions } from "../../hooks/useActions";
import TodoChangeSection from "./TodoChangeSection";

const TodoSectionsList: FC = () => {
    let todos = useAppSelector((state) => state.todosReducer.todos);
    const { sectionId } = useAppSelector((state) => state.sectionsReducer);
    let isActiveAddTaskBtn = useAppSelector(
        (state) => state.uiReducer.isActiveAddTaskBtn
    );
    const dispatch = useDispatch();
    const { mutateTask, mutateAllTasks, generateTaskId } = useTaskTree();
    const { setActiveAddTaskBtn } = useActions();

    useEffect(() => {
        const getTodos = async () => {
            await dispatch(getTodosBySection(sectionId));
        };

        if (sectionId) {
            getTodos();
        }
    }, [sectionId]);

    const openAddTodoForm = async (id: string) => {
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

    const closeAddTodoForm = (id: string) => {
        setActiveAddTaskBtn({ isActive: true });
        mutateTask(id, [{ field: "creatable", value: false }]);
    };

    return (
        <>
            <div className="display flex justify-center xl:ml-[100px]">
                <ul className="w-[165vh] mt-[50px] px-[7px]">
                    {!todos.length && sectionId ? (
                        <TodoChangeSection
                            id={generateTaskId(sectionId)}
                            sort={0}
                            action={"createSection"}
                            primaryButtonName="Добавить раздел"
                            nameValue=""
                            hideAddSectionButton={false}
                        />
                    ) : (
                        todos.map((section) => {
                            return (
                                <li className="mb-10" key={section.id}>
                                    <TodoSection section={section} />
                                    <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-[10px]" />
                                    {section.showTasks && (
                                        <TodosList todoitems={section.items} />
                                    )}

                                    <TodoChange
                                        id={section.id}
                                        buttonsSettings={{
                                            primaryButtonName:
                                                "Добавить задачу",
                                            secondaryButtonName: "Отмена",
                                        }}
                                        inputsSettings={{
                                            inputPlaceHolder: "Название задачи",
                                            textPlaceHolder: "Описание",
                                        }}
                                        isVisible={section.creatable}
                                        callback={() => {
                                            closeAddTodoForm(section.id);
                                        }}
                                    />

                                    {isActiveAddTaskBtn && (
                                        <AddTaskButton
                                            onClick={() => {
                                                openAddTodoForm(section.id);
                                            }}
                                        />
                                    )}
                                    <TodoChangeSection
                                        id={section.id}
                                        sort={section.sort}
                                        action={"createSection"}
                                        primaryButtonName="Добавить раздел"
                                        nameValue=""
                                    />
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>
        </>
    );
};

export default TodoSectionsList;
