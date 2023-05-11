import { FC } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import { useTaskTree } from "../../hooks/useTaskTree";
import TodosList from "../Todos/TodosList";
import Modal from "../../ui/Modal/Modal";
import AddTaskButton from "../../ui/Buttons/AddTaskButton/AddTaskButton";
import TodoChange from "../TodoChange/TodoChange";
import { useToolTodo } from "../../hooks/useToolTodo";

interface ITodoDetailProps {}

const TodoDetail: FC<ITodoDetailProps> = () => {
    const { setVisibleDetailTodo, setCurrentTodo } = useActions();
    const { isVisibleDetailTodo } = useAppSelector((state) => state.uiReducer);
    const { currentTodo } = useAppSelector((state) => state.todosReducer);
    const { mutateAllTasks, findTaskInTree, mutateTask } = useTaskTree();
    const {setTodoEditInputs, todoEditInputs} = useToolTodo(currentTodo.id, "todo");

    const closeDetail = () => {
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
                        inputValue: todoEditInputs.name
                    }}
                    isVisible={currentTodo.editable}
                    callback={closeEditTodo}
                    action="change"
                />
                {!currentTodo.editable && (
                    <div className="text-start" onClick={openEditTodo}>
                        <b>{currentTodo.name}</b>
                        <p className="mb-[15px]">{currentTodo.description}</p>
                    </div>
                )}
                <div className="mb-[15px]">
                    <b>Подзадачи:</b>
                </div>
                <div className="-ml-[28px]">
                    <TodosList
                        todoitems={currentTodo.items}
                        toolTaskSettings={{
                            translateY: "-translate-y-[120px]",
                            translateX: "-translate-x-[115px]",
                        }}
                        showChildrens={false}
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

                        <AddTaskButton onClick={openCreateTodo} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default TodoDetail;
