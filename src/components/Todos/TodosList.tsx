import { FC } from "react";
import { ITodoItem } from "../../types/todo.types";
import { IToolTaskSettings } from "../../types/ui.types";
import DndWrapper from "../DnD/DndWrapper";
import TodoListItem from "./TodoListItem";

interface ITodosListProps {
    todoitems: ITodoItem[];
    toolTaskSettings?: IToolTaskSettings;
    showChildrens?: boolean;
    isDragAndDropList: boolean;
}

const TodosList: FC<ITodosListProps> = ({
    todoitems,
    showChildrens = true,
    isDragAndDropList,
}) => {
    return (
        <>
            {todoitems.map((item, index) => (
                <>
                    {isDragAndDropList ? (
                        <DndWrapper id={item.id} index={index} isDragDisabled={item.isDragDisabled}>
                            <TodoListItem
                                item={item}
                                isDragAndDropList={isDragAndDropList}
                                showChildrens={showChildrens}
                            />
                        </DndWrapper>
                    ) : (
                        <TodoListItem
                            item={item}
                            isDragAndDropList={isDragAndDropList}
                            showChildrens={showChildrens}
                        />
                    )}
                </>
            ))}
        </>
    );
};

export default TodosList;
