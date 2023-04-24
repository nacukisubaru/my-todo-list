import { FC, useEffect } from "react";
import { getTodosBySection } from "../../store/services/todo/todo.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import TodoList from "../TodoList/TodoList";
import ArrowButton from "../../ui/ArrowButton/ArrowButton";
import BurgerMenu from "../../ui/BurgerMenu/BurgerMenu";

const TodoSections: FC = () => {
    const todos = useAppSelector((state) => state.todosReducer.todos);
    const dispatch = useDispatch();

    useEffect(() => {
        const getTodos = async () => {
            await dispatch(getTodosBySection(1));
        };
        getTodos();
    }, []);

    return (
        <>
            <BurgerMenu 
                items={[
                    {id: 1, name: 'Добро пожаловать'},
                    {id: 2, name: 'Проект 1'},
                    {id: 3, name: 'Проект 2'},
                ]}
            />
            <div className="display flex justify-center">
                <ul className="w-[55%] mt-[50px]">
                    {todos.map((section) => {
                        return (
                            <li className="mb-10">
                                <div className="display flex">
                                    <ArrowButton isArrowOpen={false} />
                                    <span className="font-bold ml-3">
                                        {section.name}
                                    </span>
                                </div>
                                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-[10px]" />
                                <TodoList todoitems={section.items}></TodoList>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default TodoSections;
