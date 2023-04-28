import { FC, useEffect, useRef, useState } from "react";
import { useTaskTree } from "../../hooks/useTaskTree";
import AddTaskButton from "../../ui/Buttons/AddTaskButton/AddTaskButton";
import BasicButton from "../../ui/Buttons/BasicButton/BasicButton";
import { useActions } from "../../hooks/useActions";
import { useAppSelector } from "../../hooks/useAppSelector";

type parentType = "section" | "task";
type action = "create" | "change";

interface ICreateTodoProps {
    id: number;
    parentType: parentType;
}

interface IInputsSettings {
    inputValue?: string,
    textValue?: string, 
    inputPlaceHolder: string;
    textPlaceHolder: string;
}

interface IButtonsSettings {
    primaryButtonName: string;
    secondaryButtonName: string;
    showAddTaskBtn: boolean;
}

interface ITodoChange {
    createTodoProps: ICreateTodoProps;
    buttonsSettings: IButtonsSettings;
    inputsSettings: IInputsSettings;
    isVisible?: boolean;
    callback?: () => void;
    action?: action;
}

const TodoChange: FC<ITodoChange> = ({
    createTodoProps,
    buttonsSettings,
    inputsSettings,
    isVisible = false,
    callback,
    action = "create"
}) => {
    const { id, parentType } = createTodoProps;
    const { inputPlaceHolder, textPlaceHolder, inputValue, textValue } = inputsSettings;
    const { primaryButtonName, secondaryButtonName } = buttonsSettings;

    const { createTask, mutateTask } = useTaskTree();
    const [primaryBtnIsDisabled, setPrimaryBtnDisabled] = useState(true);
    const { setActiveAddTaskBtn } = useActions();

    const name: any = useRef();
    const description: any = useRef();

    const createTodo = () => {
        const TaskName = name.current.value;
        const TaskDesc = description.current.value;
        createTask(
            { taskId: id, type: parentType },
            { name: TaskName, description: TaskDesc }
        );
        name.current.value = "";
        description.current.value = "";
        setPrimaryBtnDisabled(true);
    };

    const changeTodo = () => {
        const TaskName = name.current.value;
        const TaskDesc = description.current.value;
         mutateTask(
            id, 
            [
                {field: 'name', value: TaskName},
                {field: 'description', value:TaskDesc}
            ], 
            'task'
        );
        callback && callback();
    };

    const applyActionTodo = () => {
        if (action === "change") {
            changeTodo();
        } else if (action === "create") {
            createTodo();
        }
    }


    const todoFormClose = () => {
        setActiveAddTaskBtn({isActive: true});
        setPrimaryBtnDisabled(true);
        callback && callback();
    };

    const changeField = () => {
        if (name.current.value.length) {
            setPrimaryBtnDisabled(false);
        } else {
            setPrimaryBtnDisabled(true);
        }
    }

    useEffect(() => {
        if (isVisible && action === "change") {
            name.current.value = inputValue;
            description.current.value = textValue;
        }
    }, [isVisible]);

    return (
        <>
            {isVisible && (
                <div className="border-solid border-2 border-indigo-600 rounded-xl h-auto">
                    <div className="display grid px-[7px] py-[7px] mb-[18px]">
                        <input
                            type="text"
                            ref={name}
                            className="hover:outline-none hover:outline-offset-0 active:outline-none active:outline-offset-0 focus:outline-none focus:outline-offset-0"
                            placeholder={inputPlaceHolder}
                            onChange={changeField}
                            onInput={changeField}
                        />
                        <textarea
                            ref={description}
                            className="resize-none h-[70px] hover:outline-none hover:outline-offset-0 active:outline-none active:outline-offset-0 focus:outline-none focus:outline-offset-0"
                            placeholder={textPlaceHolder}
                            onChange={changeField}
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
                            onClick={applyActionTodo}
                            isDisabled={primaryBtnIsDisabled}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default TodoChange;
