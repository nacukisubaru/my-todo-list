import { FC, useRef, useState } from "react";
import { useTaskTree } from "../../hooks/useTaskTree";
import AddTaskButton from "../../ui/Buttons/AddTaskButton/AddTaskButton";
import BasicButton from "../../ui/Buttons/BasicButton/BasicButton";

type parentType = "section" | "task";

interface ICreateTodoProps {
    id: number;
    parentType: parentType;
}

interface IInputsSettings {
    inputPlaceHolder: string;
    textPlaceHolder: string;
}

interface IButtonsSettings {
    primaryButtonName: string;
    secondaryButtonName: string;
}

interface ITodoChange {
    createTodoProps: ICreateTodoProps;
    buttonsSettings: IButtonsSettings;
    inputsSettings: IInputsSettings;
}

const TodoChange: FC<ITodoChange> = ({
    createTodoProps,
    buttonsSettings,
    inputsSettings,
}) => {
    const { id, parentType } = createTodoProps;
    const { inputPlaceHolder, textPlaceHolder } = inputsSettings;
    const { primaryButtonName, secondaryButtonName } = buttonsSettings;

    const { createTask } = useTaskTree();
    const [isOpenTodoForm, openTodoForm] = useState(false);

    const name: any = useRef();
    const description: any = useRef();

    const createTodo = () => {
        const TaskName = name.current.value;
        const TaskDesc = description.current.value;
        createTask(
            { taskId: id, type: parentType },
            { name: TaskName, description: TaskDesc }
        );
    };

    const todoFormOpen = () => {
        openTodoForm(true);
    };

    const todoFormClose = () => {
        openTodoForm(false);
    };

    return (
        <>
            {isOpenTodoForm ? (
                <div className="border-solid border-2 border-indigo-600 rounded-xl h-auto">
                    <div className="display grid px-[7px] py-[7px] mb-[18px]">
                        <input
                            type="text"
                            ref={name}
                            className="hover:outline-none hover:outline-offset-0 active:outline-none active:outline-offset-0 focus:outline-none focus:outline-offset-0"
                            placeholder={inputPlaceHolder}
                        />
                        <textarea
                            ref={description}
                            className="resize-none h-[70px] hover:outline-none hover:outline-offset-0 active:outline-none active:outline-offset-0 focus:outline-none focus:outline-offset-0"
                            placeholder={textPlaceHolder}
                        ></textarea>
                    </div>
                    <div className="display flex justify-end mx-[7px] my-[7px]">
                        <span className="mr-[8px]">
                            <BasicButton
                                name={secondaryButtonName}
                                color="secondary"
                                onClick={todoFormClose}
                            />
                        </span>
                        <BasicButton
                            name={primaryButtonName}
                            color="primary"
                            onClick={createTodo}
                        />
                    </div>
                </div>
            ) : (
                <AddTaskButton onClick={todoFormOpen} />
            )}
        </>
    );
};

export default TodoChange;
