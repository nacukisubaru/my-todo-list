import { FC } from "react";
import { useTaskTree } from "../../hooks/useTaskTree";
import { ITodoItem } from "../../types/todo.types";
import ArrowButton from "../../ui/Buttons/ArrowButton/ArrowButton";

interface ITodoSectionProps {
    section: ITodoItem
}

const TodoSection:FC<ITodoSectionProps> = ({section}) => {
    const {mutateTask} = useTaskTree();

    const toggleTaskList = (id: string) => {
        const mutate = (value: any) => {
            mutateTask(id, [{field: "showTasks", value}]);
        }
        return mutate;
    }

    return (
        <div className="display flex">
            <ArrowButton
                isArrowOpen={section.showTasks}
                onClick={toggleTaskList(section.id)}
            />
            <span className="font-bold ml-3">{section.name}</span>
        </div>
    );
};

export default TodoSection;
