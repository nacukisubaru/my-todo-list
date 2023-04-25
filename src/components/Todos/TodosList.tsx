import { FC } from "react";
import { ITodoItem } from "../../types/todo.types";
import TodoItem from "./TodoItem";

interface ITodosListProps {
    todoitems: ITodoItem[];
}

const TodosList: FC<ITodosListProps> = ({ todoitems }) => {
    return (
        <ul>
            {todoitems.map((item) => {
                return (
                    <li className="ml-5" key={item.id}>
                        <TodoItem todo={item} />
                        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-[10px] mt-[10px]" />
                        {item.showTasks && (
                            <TodosList todoitems={item.items} />
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default TodosList;
