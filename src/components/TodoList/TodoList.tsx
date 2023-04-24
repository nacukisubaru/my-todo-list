import { FC } from "react";
import ArrowButton from "../../ui/ArrowButton/ArrowButton";
import CheckBox from "../../ui/CheckBox/CheckBox";

export interface ITodoItem {
    todoId: number;
    name: string;
    items: ITodoItem[];
}

interface ITodoList {
    todoitems: ITodoItem[];
}

const TodoList: FC<ITodoList> = ({ todoitems }) => {
    return (
        <ul>
            {todoitems.map((item) => {
                return (
                    <li className="ml-5">
                        <div className="display flex">
                            <div className="-mt-[3px] mr-3">
                                {item.items.length > 0 && (
                                    <ArrowButton isArrowOpen={false} />
                                )}
                            </div>
                            <CheckBox label={item.name}/>
                        </div>
                        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-[10px] mt-[10px]" />
                        <TodoList todoitems={item.items} />
                    </li>
                );
            })}
        </ul>
    );
};

export default TodoList;
