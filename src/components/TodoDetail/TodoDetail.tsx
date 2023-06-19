import { FC, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import { useTaskTree } from "../../hooks/useTaskTree";
import TodosList from "../Todos/TodosList";
import Modal from "../../ui/Modal/Modal";
import AddTaskButton from "../../ui/Buttons/AddTaskButton/AddTaskButton";
import TodoChange from "../TodoChange/TodoChange";
import { useToolTodo } from "../../hooks/useToolTodo";
import CheckBox from "../../ui/CheckBox/CheckBox";
import { useNavigate, useParams } from "react-router-dom";
import useCopyToClipboard from "../../hooks/useCopyToClickboard";
import HTMLReactParser from "html-react-parser";
import EditButton from "../../ui/Buttons/EditButton/EditButton";
import { replaceEntityTags } from "../../helpers/stringHelper";
import { Button } from "@progress/kendo-react-buttons";
import ArrowButtonUp from "../../ui/Buttons/ArrowButton/ArrowButtonUp";
import ArrowButtonLow from "../../ui/Buttons/ArrowButton/ArrowButtonLow";

interface ITodoDetailProps {}

const TodoDetail: FC<ITodoDetailProps> = () => {
    const { setVisibleDetailTodo, setCurrentTodo } = useActions();
    const { isVisibleDetailTodo } = useAppSelector((state) => state.uiReducer);
    const { currentTodo } = useAppSelector((state) => state.todosReducer);
    let { currentSection } = useAppSelector((state) => state.sectionsReducer);
    const { mutateAllTasks, findTaskInTree, mutateTask, completeTasks } =
        useTaskTree();
    const { setTodoEditInputs, todoEditInputs } = useToolTodo(
        currentTodo.id,
        "todo"
    );

    const [copy] = useCopyToClipboard();
    const { sectionId } = useParams();
    const navigate = useNavigate();

    const [isVisibleAnkiText, setVisibleAnkiText] = useState(false);

    const closeDetail = () => {
        navigate(`/app/section/${sectionId}`);
        setVisibleDetailTodo({ isActive: false });
        setVisibleAnkiText(false);
    };

    const openCreateTodo = async () => {
        const callback = (obj: any) => {
            obj.creatableUpper = false;
            obj.creatableLower = false;
            obj.editable = false;
            if (obj.id === currentTodo.id) {
                obj.creatable = true;
            }
        };
        const todos = await mutateAllTasks(callback, false);
        const todo = await findTaskInTree(todos, currentTodo.id);
        if (todo) {
            setCurrentTodo({ todo });
        }
    };

    const closeCreateTodo = async () => {
        mutateTask(
            currentTodo.id,
            [{ field: "creatable", value: false }],
            false,
            true
        );
    };

    const openEditTodo = async () => {
        await setTodoEditInputs({
            name: currentTodo.name,
            text: currentTodo.description,
            textTwo: currentTodo.descriptionTwo
        });
        mutateTask(
            currentTodo.id,
            [{ field: "editable", value: true }],
            false,
            true
        );
    };

    const closeEditTodo = () => {
        mutateTask(
            currentTodo.id,
            [{ field: "editable", value: false }],
            false,
            true
        );
    };

    const completeTodo = (isComplete: boolean) => {
        const tasks = completeTasks(currentTodo.id, isComplete);
        const task = findTaskInTree(tasks, currentTodo.id);
        if (task) {
            setCurrentTodo({ todo: task });
        }
    };

    const copyLink = () => {
        copy(window.location.href);
    };

    const showAnkiText = () => {
        setVisibleAnkiText(true);
    };

    const switchTodo = (isNext: boolean = true) => {
        setVisibleAnkiText(false);
        if (isNext) {
            if (currentTodo.nextTodoId) {
                navigate(`/app/section/${sectionId}/task/${currentTodo.nextTodoId}`);
            }
        } else {
            if (currentTodo.prevTodoId) {
                navigate(`/app/section/${sectionId}/task/${currentTodo.prevTodoId}`);
            }
        }
    }

    return (
        <Modal
            modalSettings={{
                title: "",
                primaryBtnName: "",
                secondaryBtnName: "",
                isVisible: isVisibleDetailTodo,
                heightBody: "min-h-[90vh]",
                showButtons: false,
                showUpperButtons: true,
            }}
            toolPanel={{
                menu: [
                    { name: "Скопировать ссылку на задачу", onClick: copyLink },
                ],
                componentsList: [
                    <ArrowButtonUp onClick={()=>{switchTodo(false)}}/>,
                    <ArrowButtonLow onClick={switchTodo}/>
                ]
            }}
            callbacks={{
                primaryBtnClick: () => {},
                secondaryBtnClick: closeDetail,
            }}
        >
            <div>
                <TodoChange
                    id={currentTodo.id}
                    buttonsSettings={{
                        primaryButtonName: "Изменить",
                        secondaryButtonName: "Отмена",
                    }}
                    inputsSettings={{
                        inputPlaceHolder: "Название задачи",
                        textPlaceHolder: "Описание",
                        textValue: todoEditInputs.text,
                        textTwoValue: todoEditInputs.textTwo,
                        inputValue: todoEditInputs.name,
                        heightText: "h-[45vh]",
                    }}
                    isVisible={currentTodo.editable}
                    callback={closeEditTodo}
                    action="change"
                    isVisibleEditor={true}
                />

                {!currentTodo.editable && (
                    <div className="display flex">
                        <CheckBox
                            checkCallback={completeTodo}
                            checked={currentTodo.isComplete}
                        />

                        <div className="text-start -mt-[4px] ml-[10px]">
                            <div className="display flex" style={{overflowWrap: 'anywhere'}}>
                                <span
                                    className={`${
                                        currentTodo.isComplete && "line-through"
                                    }`}
                                >
                                    <b>{currentTodo.name}</b>
                                </span>
                                <span className="ml-[7px] -mt-[2px]">
                                    <EditButton onClick={openEditTodo} />
                                </span>
                            </div>
                            <div className="mb-[15px] break-words max-w-[15rem] md:max-w-2xl">
                                {currentTodo.description &&
                                    HTMLReactParser(
                                        replaceEntityTags(
                                            currentTodo.description
                                        )
                                    )}
                            </div>
                        </div>
                    </div>
                )}

                {!currentSection.isAnkiSection ? (
                    <>
                        <div className="mb-[15px] text-start">
                            <b>Подзадачи:</b>
                        </div>
                        <div className="-ml-[20px]">
                            <TodosList
                                todoitems={currentTodo.items}
                                toolTaskSettings={{
                                    translateY: "-translate-y-[120px]",
                                    translateX: "-translate-x-[115px]",
                                }}
                                showChildrens={false}
                                isDragAndDropList={false}
                            />

                            <div className="ml-[20px] text-start">
                                <TodoChange
                                    id={currentTodo.id}
                                    buttonsSettings={{
                                        primaryButtonName: "Добавить задачу",
                                        secondaryButtonName: "Отмена",
                                    }}
                                    inputsSettings={{
                                        inputPlaceHolder: "Название задачи",
                                        textPlaceHolder: "Описание",
                                    }}
                                    isVisible={currentTodo.creatable}
                                    callback={closeCreateTodo}
                                    editorHeight="150px"
                                />

                                {!currentTodo.isComplete && (
                                    <AddTaskButton onClick={openCreateTodo} />
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {!currentTodo.editable && (
                            <div className="mt-[50px]">
                                <div className="display flex justify-center">
                                    <Button onClick={showAnkiText}>
                                        Посмотреть ответ
                                    </Button>
                                </div>
                                {isVisibleAnkiText && (
                                    <div>{ HTMLReactParser(
                                        replaceEntityTags(
                                            currentTodo.descriptionTwo
                                        )
                                    )}</div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Modal>
    );
};

export default TodoDetail;
