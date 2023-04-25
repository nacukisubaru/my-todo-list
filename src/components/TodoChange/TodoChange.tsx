import { FC, useState } from "react";
import AddTaskButton from "../../ui/Buttons/AddTaskButton/AddTaskButton";
import AddTaskForm from "../../ui/Forms/AddTaskForm/AddTaskForm";

type parentType = "section" | "task";

interface ICreateTodoProps {
    id: number,
    parentType: parentType
}

interface IButtonsSettings {
    primaryButtonName: string,
    secondaryButtonName: string,
}

interface ITodoChange {
   createTodoProps: ICreateTodoProps,
   buttonsSettings: IButtonsSettings
}

const TodoChange: FC<ITodoChange> = ({createTodoProps, buttonsSettings}) => {
    const {id, parentType} = createTodoProps;

    const [isOpenTodoForm, openTodoForm] = useState(false);

    const createTodo = () => {
        id;
        parentType;
    }

    const todoFormOpen = () => {
        openTodoForm(true);
    };

    const todoFormClose = () => {
        openTodoForm(false);
    };

    return (
        <>
            {isOpenTodoForm ? (
                <AddTaskForm
                    buttonsSettings={{
                        ...buttonsSettings,
                        secondaryButtonClick: todoFormClose,
                        primaryButtonClick: todoFormOpen,
                    }}
                    inputSettings={{
                        inputPlaceHolder: "Название задачи",
                        textPlaceHolder: "Описание"
                    }}
                />
            ) : (
                <AddTaskButton onClick={todoFormOpen} />
            )}
        </>
    );
};

export default TodoChange;
