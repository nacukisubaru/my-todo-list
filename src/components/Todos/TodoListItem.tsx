import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTaskTree } from "../../hooks/useTaskTree";
import { useActions } from "../../hooks/useActions";
import { ITodoItem } from "../../types/todo.types";
import TodoItem from "./TodoItem";
import { FC } from "react";
import { IToolTaskSettings } from "../../types/ui.types";
import TodosList from "./TodosList";
import { DragDropContext } from "react-beautiful-dnd";

interface ITodoListItem {
    item: ITodoItem;
    toolTaskSettings?: IToolTaskSettings;
    showChildrens?: boolean;
    isDragAndDropList: boolean;
}

const TodoListItem: FC<ITodoListItem> = ({
    item,
    showChildrens,
    isDragAndDropList,
}) => {
    const { setVisibleDetailTodo, setCurrentTodo } = useActions();
    const { isVisibleCompleteTasks } = useAppSelector(
        (state) => state.uiReducer
    );
    const section = useAppSelector(
        (state) => state.sectionsReducer.currentSection
    );
    const navigate = useNavigate();

    const showDetail = (todo: ITodoItem) => {
        setVisibleDetailTodo({ isActive: true });
        setCurrentTodo({ todo });
        navigate(`/app/section/${section.id}/task/${todo.id}`);
    };
    const { dragAndDropSort } = useTaskTree();

    const onDragEnd = (draggable: any) => {
        dragAndDropSort(draggable.destination, draggable.draggableId);
    };

    return (
        <div className="ml-5" key={item.id}>
            {!item.isComplete && (
                <>
                    <TodoItem
                        todo={item}
                        onClick={() => {
                            showDetail(item);
                        }}
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
                        showSubtasks={showChildrens}
                    />
                    <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-[10px] mt-[10px]" />
                </>
            )}

            {item.showTasks && showChildrens && (
                <DragDropContext onDragEnd={onDragEnd}>
                    <TodosList
                        todoitems={item.items}
                        toolTaskSettings={{
                            translateX: "-translate-x-[155px]",
                            translateY: "-translate-y-[120px]",
                        }}
                        isDragAndDropList={isDragAndDropList}
                    />
                </DragDropContext>
            )}
        </div>
    );
};

export default TodoListItem;
