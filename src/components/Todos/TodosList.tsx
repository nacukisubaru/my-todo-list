import { FC, useEffect, useState } from "react";
import { ITodoItem } from "../../types/todo.types";
import { useActions } from "../../hooks/useActions";
import { IToolTaskSettings } from "../../types/ui.types";
import TodoItem from "./TodoItem";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { uiReducer } from "../../store/reducers/ui.slice";

interface ITodosListProps {
    todoitems: ITodoItem[];
    droppableId: string;
    toolTaskSettings?: IToolTaskSettings;
    showChildrens?: boolean;
}

const TodosList: FC<ITodosListProps> = ({
    todoitems,
    showChildrens = true,
    droppableId,
}) => {
    const { setVisibleDetailTodo, setCurrentTodo } =
        useActions();
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

    const onDragStart = (draggableItem: any) => {
      
    };

    const onDragEnd = () => {
    };

    return (
        <Droppable droppableId={droppableId} key={droppableId}>
            {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {todoitems.map((item, index) => (
                        <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                        >
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
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

                                        {item.isComplete &&
                                            isVisibleCompleteTasks && (
                                                <>
                                                    <TodoItem
                                                        todo={item}
                                                        onClick={() => {
                                                            showDetail(item);
                                                        }}
                                                        showSubtasks={
                                                            showChildrens
                                                        }
                                                    />
                                                    <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-[10px] mt-[10px]" />
                                                </>
                                            )}

                                        {item.showTasks && showChildrens && (
                                            <DragDropContext
                                                onDragEnd={onDragEnd}
                                                onDragStart={onDragStart}
                                            >
                                                <TodosList
                                                    todoitems={item.items}
                                                    toolTaskSettings={{
                                                        translateX:
                                                            "-translate-x-[155px]",
                                                        translateY:
                                                            "-translate-y-[120px]",
                                                    }}
                                                    droppableId={item.id}
                                                />
                                            </DragDropContext>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default TodosList;
