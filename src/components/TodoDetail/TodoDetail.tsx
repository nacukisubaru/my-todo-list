import { FC } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import { useTaskTree } from "../../hooks/useTaskTree";
import TodosList from "../Todos/TodosList";
import Modal from "../../ui/Modal/Modal";
import AddTaskButton from "../../ui/Buttons/AddTaskButton/AddTaskButton";
import TodoChange from "../TodoChange/TodoChange";

interface ITodoDetailProps {}

const TodoDetail: FC<ITodoDetailProps> = () => {
    const { setVisibleDetailTodo, setCurrentTodo } = useActions();
    const { isVisibleDetailTodo } = useAppSelector((state) => state.uiReducer);
    const { currentTodo } = useAppSelector((state) => state.todosReducer);
    const { mutateAllTasks, findTaskInTree, mutateTask } = useTaskTree();

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
        mutateTask(currentTodo.id, [{ field: "creatable", value: false }], false, true);
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
                <b>{currentTodo.name}</b>
                <p className="mb-[15px]">{currentTodo.description}</p>
                <div className="mb-[15px]">
                    <b>Подзадачи:</b>
                </div>
                <div className="-ml-[28px]">
                    <TodosList
                        todoitems={currentTodo.items}
                        toolTaskSettings={{
                            translateY: "-translate-y-[180px]",
                            translateX: "-translate-x-[145px]",
                        }}
                        showChildrens={false}
                    />
                
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
                        isVisible={currentTodo.creatable }
                        callback={closeCreateTodo}
                    />
                    
                    <AddTaskButton onClick={openCreateTodo} />
                </div>
            </div>
        </Modal>
    );
};

export default TodoDetail;
