import { FC } from "react";
import { useTaskTree } from "../../hooks/useTaskTree";
import { useAppSelector } from "../../hooks/useAppSelector";
import { ITodoItem } from "../../types/todo.types";
import CheckBox from "../../ui/CheckBox/CheckBox";
import ArrowButton from "../../ui/Buttons/ArrowButton/ArrowButton";

interface ITodoItemProps {
    todo: ITodoItem
}

const TodoItem: FC<ITodoItemProps> = ({todo}) => {
    let todos = useAppSelector((state) => state.todosReducer.todos);
    const {mutateTask} = useTaskTree();

    const toggleTaskList = (id: number, type: string) => {
        const mutate = (value: any) => {
            mutateTask(todos, id, 'showTasks', value, type);
        }
        return mutate;
    }

    return (
        <div className="display flex">
            <div className="-mt-[3px] mr-3">
                {todo.items.length > 0 && (
                    <ArrowButton
                        isArrowOpen={todo.showTasks}
                        onClick={
                            toggleTaskList(todo.id, todo.type)
                        }
                    />
                )}
            </div>
            <CheckBox label={todo.name} />
        </div>
    );
};

export default TodoItem;
