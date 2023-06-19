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
import Divider from "../../ui/Dividers/Divider";
import TodoChange from "../TodoChange/TodoChange";

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
    const { mutateAllTasks, mutateTask, findTaskInTree } = useTaskTree();
    const { isVisibleDetailTodo } = useAppSelector((state) => state.uiReducer);
    const { setVisibleDetailTodo, setCurrentTodo } = useActions();
    const { todos } = useAppSelector(
        (state) => state.todosReducer
    );
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

    const onDragEnd = async (draggable: any) => {
        const items = mutateAllTasks((item) => {
            item.isDragDisabled = false;
        }, false);
        dragAndDropSort({
            destination: draggable.destination, 
            draggableId: draggable.draggableId,
            items
        });
    };

    const changeDraggable = () => {
        if (item.parentId) {
            const parent = findTaskInTree(todos, item.parentId);
            if (parent && parent.type !== "section") {
                mutateTask(parent.id, [{ field: "isDragDisabled", value: true }]);
            }
        }    
    };

    const onDragStart = () => {
        if (item.parentId) {
           const parent = findTaskInTree(todos, item.parentId);
           
            if (parent && parent.type !== "section") {
                mutateTask(parent.id, [{ field: "isDragDisabled", value: true }]);
            }
        }
    }

    const closeUpperOrLowerForm = (field: string) => {
        mutateTask(
            item.id,
            [{ field, value: false }],
            false,
            isVisibleDetailTodo
        );
    };

    const closeLowerAddForm = async () => {
        closeUpperOrLowerForm("creatableLower");
    };

    return (
        <div
            className="ml-5"
            key={item.id}
            onTouchStart={changeDraggable}
        >
            {!item.isComplete && (
                <>
                    <TodoItem
                        todo={item}
                        onClick={() => {
                            showDetail(item);
                        }}
                        showSubtasks={showChildrens}
                    />
                    <Divider />
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
                  <Divider />
                </>
            )}

            {item.showTasks && showChildrens && (
                <DragDropContext onDragEnd={onDragEnd} onBeforeDragStart={onDragStart}>
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

            <TodoChange
                id={item.id}
                buttonsSettings={{
                    primaryButtonName: "Добавить задачу",
                    secondaryButtonName: "Отмена",
                }}
                inputsSettings={{
                    inputPlaceHolder: "Название задачи",
                    textPlaceHolder: "Описание",
                }}
                isVisible={item.creatableLower}
                sortByPosition={{ position: "lower" }}
                callback={closeLowerAddForm}
                action="create"
                editorHeight="150px"
            />
        </div>
    );
};

export default TodoListItem;
