import { FC } from "react";
import { ITodoItem } from "../../types/todo.types";
import { useActions } from "../../hooks/useActions";
import { IToolTaskSettings } from "../../types/ui.types";
import TodoItem from "./TodoItem";
import { useAppSelector } from "../../hooks/useAppSelector";

interface ITodosListProps {
    todoitems: ITodoItem[];
    toolTaskSettings?: IToolTaskSettings;
    showChildrens?: boolean;
}

const TodosList: FC<ITodosListProps> = ({
    todoitems,
    toolTaskSettings,
    showChildrens = true,
}) => {
    const { setVisibleDetailTodo, setCurrentTodo } = useActions();
    const showDetail = (todo: ITodoItem) => {
        setVisibleDetailTodo({ isActive: true });
        setCurrentTodo({ todo });
    };
    const {isVisibleCompleteTasks} = useAppSelector(state => state.uiReducer);

    return (
        <ul>
            {todoitems.map((item) => {
                return (
                    <li className="ml-5" key={item.id}>
                        {!item.isComplete && (
                            <>
                                <TodoItem
                                    todo={item}
                                    onClick={() => {
                                        showDetail(item);
                                    }}
                                    toolTaskSettings={toolTaskSettings}
                                    showSubtasks={showChildrens}
                                />
                                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-[10px] mt-[10px]" />
                            </>
                        )}

                        {item.isComplete && isVisibleCompleteTasks && (
                            <>
                                <TodoItem
                                    todo={item}
                                    onClick={() => {
                                        showDetail(item);
                                    }}
                                    toolTaskSettings={toolTaskSettings}
                                    showSubtasks={showChildrens}
                                />
                                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-[10px] mt-[10px]" />
                            </>
                        )}

                        {item.showTasks && showChildrens && (
                            <TodosList
                                todoitems={item.items}
                                toolTaskSettings={{
                                    translateX: "-translate-x-[155px]",
                                    translateY: "-translate-y-[120px]",
                                }}
                            />
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default TodosList;
