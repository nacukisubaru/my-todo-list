import { FC } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTaskTree } from "../../hooks/useTaskTree";
import { ITodoList } from "../../types/todo.types";
import ArrowButton from "../../ui/Buttons/ArrowButton/ArrowButton";

interface ITodoSectionProps {
    section: ITodoList
}

const TodoSection:FC<ITodoSectionProps> = ({section}) => {
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
            <ArrowButton
                isArrowOpen={section.showTasks}
                onClick={toggleTaskList(section.id, section.type)}
            />
            <span className="font-bold ml-3">{section.name}</span>
        </div>
    );
};

export default TodoSection;
