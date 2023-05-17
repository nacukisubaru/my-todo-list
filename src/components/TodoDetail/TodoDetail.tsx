import { FC } from "react";
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
import { textBreak, wrapLinksInTags } from "../../helpers/stringHelper";

interface ITodoDetailProps {}

const TodoDetail: FC<ITodoDetailProps> = () => {
    const { setVisibleDetailTodo, setCurrentTodo } = useActions();
    const { isVisibleDetailTodo } = useAppSelector((state) => state.uiReducer);
    const { currentTodo } = useAppSelector((state) => state.todosReducer);
    const { mutateAllTasks, findTaskInTree, mutateTask, completeTasks } = useTaskTree();
    const { setTodoEditInputs, todoEditInputs } = useToolTodo(
        currentTodo.id,
        "todo"
    );

    const [copy] = useCopyToClipboard()
    const {sectionId} = useParams();
    const navigate = useNavigate();
    
    const closeDetail = () => {
        navigate(`/app/section/${sectionId}`);
        setVisibleDetailTodo({ isActive: false });
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
            setCurrentTodo({todo: task});
        }
    }

    const copyLink = () => {
        copy(window.location.href);
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
            toolPanel={{menu: [{name: 'Скопировать ссылку на задачу', onClick: copyLink }]}}
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
                        inputValue: todoEditInputs.name,
                    }}
                    isVisible={currentTodo.editable}
                    callback={closeEditTodo}
                    action="change"
                />

                {!currentTodo.editable && (
                    <div className="display flex">
                        <CheckBox
                            checkCallback={completeTodo}
                            checked={currentTodo.isComplete}
                        />

                        <div className="text-start -mt-[4px] ml-[10px]">
                            <div className="display flex">
                                <span className={`${currentTodo.isComplete && 'line-through'}`}><b>{currentTodo.name}</b></span>
                                <span className="ml-[7px] -mt-[2px]"><EditButton onClick={openEditTodo}/></span>
                            </div>
                            <div className="mb-[15px] break-words max-w-[15rem] md:max-w-2xl">
                                {currentTodo.description && HTMLReactParser(textBreak(wrapLinksInTags(currentTodo.description)))}
                            </div>
                        </div>
                    </div>
                )}
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
                        />
                        
                        {!currentTodo.isComplete && (
                             <AddTaskButton onClick={openCreateTodo} />
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default TodoDetail;
