import { FC, useEffect, useRef, useState } from "react";
import { useActions } from "../../hooks/useActions";
import { useTaskTree } from "../../hooks/useTaskTree";
import { ISortByPosition } from "../../types/todo.types";
import { changeAction } from "../../types/ui.types";
import { todoSectionsApi } from "../../store/services/todo/todo-sections.api";
import { todoApi } from "../../store/services/todo/todo.api";
import BasicButton from "../../ui/Buttons/BasicButton/BasicButton";

interface IInputsSettings {
    inputValue?: string;
    textValue?: string;
    inputPlaceHolder: string;
    textPlaceHolder: string;
}

interface IButtonsSettings {
    primaryButtonName: string;
    secondaryButtonName: string;
}

interface ITodoChange {
    id: string;
    buttonsSettings: IButtonsSettings;
    inputsSettings: IInputsSettings;
    isVisible?: boolean;
    callback?: () => void;
    action?: changeAction;
    position?: string;
    sortByPosition?: ISortByPosition
}

const TodoChange: FC<ITodoChange> = ({
    id,
    buttonsSettings,
    inputsSettings,
    isVisible = false,
    callback,
    action = "create",
    sortByPosition
}) => {
    const { inputPlaceHolder, textPlaceHolder, inputValue, textValue } =
        inputsSettings;
    const { primaryButtonName, secondaryButtonName } = buttonsSettings;

    const { createTask, mutateTask, createSection } = useTaskTree();
    const [primaryBtnIsDisabled, setPrimaryBtnDisabled] = useState(true);
    const { setActiveAddTaskBtn } = useActions();
    
    const [updSection] = todoSectionsApi.useUpdateMutation();
    const [updTodo] = todoApi.useUpdateMutation();

    const name: any = useRef();
    const description: any = useRef();

    const createTodo = () => {
        const TaskName = name.current.value;
        const TaskDesc = description.current.value;
        createTask(id, { name: TaskName, description: TaskDesc }, sortByPosition?.position);
        name.current.value = "";
        description.current.value = "";
        setPrimaryBtnDisabled(true);
    };

    const changeTodo = async () => {
        const TaskName = name.current.value;
        const TaskDesc = description.current.value;
        const task = await mutateTask(id, [
            { field: "name", value: TaskName },
            { field: "description", value: TaskDesc },
            { field: "editable", value: false },
        ]);
        updTodo(task);
    };

    const createSectionTodo = () => {
        if (sortByPosition?.sortPosition) {
            createSection(name.current.value, sortByPosition?.sortPosition);
        }
    }

    const changeSectionTodo = async () => {
        const task = await mutateTask(id, [
            { field: "name", value: name.current.value },
            { field: "editable", value: false },
        ]);
        updSection(task);
    }

    const applyActionTodo = () => {
        switch(action) {
            case 'change':
                changeTodo();
            break;
            case 'create':
                createTodo();
            break;
            case 'createSection':
                createSectionTodo();
            break;
            case 'changeSection':
                changeSectionTodo();
            break;
        }
    };

    const todoFormClose = () => {
        setActiveAddTaskBtn({ isActive: true });
        setPrimaryBtnDisabled(true);
        callback && callback();
    };

    const changeField = () => {
        if (name.current.value.length) {
            setPrimaryBtnDisabled(false);
        } else {
            setPrimaryBtnDisabled(true);
        }
    };

    useEffect(() => {
        if (isVisible && (action === "change" || action === "changeSection")) {
            name.current.value = inputValue;
            if (textValue) {
                description.current.value = textValue;
            }
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
                        {action !== "createSection" && action !== "changeSection" &&  (
                            <textarea
                                ref={description}
                                className="resize-none h-[70px] hover:outline-none hover:outline-offset-0 active:outline-none active:outline-offset-0 focus:outline-none focus:outline-offset-0"
                                placeholder={textPlaceHolder}
                                onChange={changeField}
                            ></textarea>
                        )}
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
