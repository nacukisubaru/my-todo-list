import { FC } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import TodoChange from "../TodoChange/TodoChange";
import TodoSection from "./TodoSection";
import TodosList from "../Todos/TodosList";
import AddTaskButton from "../../ui/Buttons/AddTaskButton/AddTaskButton";
import { useTaskTree } from "../../hooks/useTaskTree";
import { useActions } from "../../hooks/useActions";
import TodoChangeSection from "./TodoChangeSection";
import ToolTaskPanel from "../../ui/Tools/ToolTaskPanel/ToolTaskPanel";
import { useToolTodo } from "../../hooks/useToolTodo";
import { useParams } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import DndWrapper from "../DnD/DndWrapper";

const TodoSectionsList: FC = () => {
    let todos = useAppSelector((state) => state.todosReducer.todos);
    let isActiveAddTaskBtn = useAppSelector(
        (state) => state.uiReducer.isActiveAddTaskBtn
    );
    const { isVisibleCompleteTasks } = useAppSelector(
        (state) => state.uiReducer
    );
    let { currentSection } = useAppSelector((state) => state.sectionsReducer);

    const { mutateTask, mutateAllTasks, generateTaskId, dragAndDropSort } =
        useTaskTree();
    const { showToolPanel, hideToolPanel, toolPanelIsVisible } = useToolTodo(
        "",
        "todo"
    );
    const { setActiveAddTaskBtn, setVisibleCompleteTasks } = useActions();
    const { sectionId } = useParams();

    const openAddTodoForm = async (id: string) => {
        setActiveAddTaskBtn({ isActive: false });

        const callback = (obj: any) => {
            obj.creatableUpper = false;
            obj.creatableLower = false;
            obj.editable = false;
            if (obj.type === "section" && obj.id === id) {
                obj.creatable = true;
            }
        };
        await mutateAllTasks(callback);
    };

    const closeAddTodoForm = (id: string) => {
        setActiveAddTaskBtn({ isActive: true });
        mutateTask(id, [{ field: "creatable", value: false }]);
    };

    const showCompleteTasks = () => {
        if (isVisibleCompleteTasks) {
            setVisibleCompleteTasks({ isActive: false });
        } else {
            setVisibleCompleteTasks({ isActive: true });
        }
    };

    const onDragEnd = (draggable: any) => {
        dragAndDropSort({
            destination: draggable.destination, 
            draggableId: draggable.draggableId
        });
    };

    return (
        <>
            <div className="display flex justify-center">
                <ul className="w-[165vh] mt-[50px] px-[30px]">
                    {currentSection && (
                        <div
                            className="display flex justify-between"
                            onMouseOver={showToolPanel}
                            onMouseOut={hideToolPanel}
                        >
                            <div className="font-bold text-xl">
                                {currentSection.name}
                            </div>
                            {toolPanelIsVisible && (
                                <ToolTaskPanel
                                    callbacks={{
                                        clickEditBtn: () => {},
                                    }}
                                    settings={{
                                        menuItems: [
                                            {
                                                name: !isVisibleCompleteTasks
                                                    ? "Показать выполненные"
                                                    : "Скрыть выполненные",
                                                onClick: showCompleteTasks,
                                            },
                                        ],
                                        showEditBtn: false,
                                        translateY: "-translate-y-[40px]",
                                        translateX: "-translate-x-[150px]",
                                    }}
                                />
                            )}
                        </div>
                    )}
                    <div className="mt-[30px]">
                        {!todos.length && sectionId ? (
                            <TodoChangeSection
                                id={generateTaskId(sectionId)}
                                sort={0}
                                action={"createSection"}
                                primaryButtonName="Добавить раздел"
                                nameValue=""
                                hideAddSectionButton={false}
                            />
                        ) : (
                            <DragDropContext onDragEnd={onDragEnd}>
                                {todos.map((section, index) => {
                                    return (
                                        <li className="mb-10" key={section.id}>
                                            <DndWrapper
                                                id={section.id}
                                                index={index}
                                            >
                                                <TodoSection
                                                    section={section}
                                                />
                                                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700 mb-[10px]" />
                                            </DndWrapper>
                                            {section.showTasks && (
                                                <>
                                                    <TodosList
                                                        todoitems={
                                                            section.items
                                                        }
                                                        isDragAndDropList={true}
                                                    />
                                                </>
                                            )}

                                            <TodoChange
                                                id={section.id}
                                                buttonsSettings={{
                                                    primaryButtonName:
                                                        "Добавить задачу",
                                                    secondaryButtonName:
                                                        "Отмена",
                                                }}
                                                inputsSettings={{
                                                    inputPlaceHolder:
                                                        "Название задачи",
                                                    textPlaceHolder: "Описание",
                                                }}
                                                isVisible={section.creatable}
                                                callback={() => {
                                                    closeAddTodoForm(
                                                        section.id
                                                    );
                                                }}
                                            />

                                            {isActiveAddTaskBtn && (
                                                <AddTaskButton
                                                    onClick={() => {
                                                        openAddTodoForm(
                                                            section.id
                                                        );
                                                    }}
                                                />
                                            )}
                                            <TodoChangeSection
                                                id={section.id}
                                                sort={section.sort}
                                                action={"createSection"}
                                                primaryButtonName="Добавить раздел"
                                                nameValue=""
                                            />
                                        </li>
                                    );
                                })}
                            </DragDropContext>
                        )}
                    </div>
                </ul>
            </div>
        </>
    );
};

export default TodoSectionsList;
