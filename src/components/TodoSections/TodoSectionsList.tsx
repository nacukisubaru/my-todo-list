import { FC, useEffect } from "react";
import { getTodosBySection } from "../../store/services/todo/todo.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import BurgerMenu from "../../ui/BurgerMenu/BurgerMenu";
import TodoChange from "../TodoChange/TodoChange";
import TodoSection from "./TodoSection";
import TodosList from "../Todos/TodosList";

const TodoSectionsList: FC = () => {
    let todos = useAppSelector((state) => state.todosReducer.todos);
    const dispatch = useDispatch();

    useEffect(() => {
        const getTodos = async () => {
            await dispatch(getTodosBySection(1));
        };
        getTodos();
    }, []);

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
                                createTodoProps={{id: section.id, parentType: "section"}} 
                                buttonsSettings={{
                                    primaryButtonName: "Добавить задачу", 
                                    secondaryButtonName: "Отмена"
                                }}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TodoSectionsList;
