import { FC } from "react";
import { useTaskTree } from "../../hooks/useTaskTree";
import { ITodoSection } from "../../types/todo.types";
import ArrowButton from "../../ui/Buttons/ArrowButton/ArrowButton";

interface ITodoSectionProps {
    section: ITodoSection
}

const TodoSection:FC<ITodoSectionProps> = ({section}) => {
    const {mutateTask} = useTaskTree();

    const toggleTaskList = (id: number, type: string) => {
        const mutate = (value: any) => {
            mutateTask(id, [{field: "showTasks", value}], type);
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
