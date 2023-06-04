import { FC, useEffect, useRef, useState } from "react";
import { useActions } from "../../hooks/useActions";
import { useTaskTree } from "../../hooks/useTaskTree";
import { ISortByPosition } from "../../types/todo.types";
import { changeAction } from "../../types/ui.types";
import { todoSectionsApi } from "../../store/services/todo/todo-sections.api";
import { todoApi } from "../../store/services/todo/todo.api";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
    EditorMountEvent,
    ProseMirror,
} from "@progress/kendo-react-editor";
import { replaceEntityTags } from "../../helpers/stringHelper";
import { insertImageFiles } from "../InsertImagePlugin/utils";
import { insertImagePlugin } from "../InsertImagePlugin/InsertImagePlugin";
import ArrowButton from "../../ui/Buttons/ArrowButton/ArrowButton";
import TodoEditor from "./TodoEditor";
import BasicButton from "../../ui/Buttons/BasicButton/BasicButton";
import "@progress/kendo-theme-default/dist/all.css";

interface IInputsSettings {
    inputValue?: string;
    textValue?: string;
    textTwoValue?: string;
    inputPlaceHolder: string;
    textPlaceHolder: string;
    heightText?: string;
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
    sortByPosition?: ISortByPosition;
    editorHeight?: string;
    isVisibleEditor?: boolean;
}


const TodoChange: FC<ITodoChange> = ({
    id,
    buttonsSettings,
    inputsSettings,
    isVisible = false,
    callback,
    action = "create",
    sortByPosition,
    editorHeight = "500px",
    isVisibleEditor = false,
}) => {
    const { inputPlaceHolder, inputValue, textValue = "", textTwoValue = "" } =
        inputsSettings;
    const { primaryButtonName, secondaryButtonName } = buttonsSettings;
    const isCreate = action === "create" || action === "createSection";
    const { createTask, mutateTask, createTaskSection } = useTaskTree();
    const [primaryBtnIsDisabled, setPrimaryBtnDisabled] = useState(isCreate);
    const { isVisibleDetailTodo } = useAppSelector((state) => state.uiReducer);
    let { currentSection } = useAppSelector((state) => state.sectionsReducer);
    const { setActiveAddTaskBtn, setCurrentTodo } = useActions();

    const [updSection] = todoSectionsApi.useUpdateMutation();
    const [updTodo] = todoApi.useUpdateMutation();

    const [textEditorContent, setTextEditorContent] = useState({
        textOne: "",
        textTwo: "",
    });
    const [isVisibleToolBar, setToolBarVisible] = useState(false);

    const name: any = useRef();

    const showToolBar = (show: boolean) => {
        setToolBarVisible(show);
    };

    const createTodo = async () => {
        const TaskName = name.current.value;
        const TaskDesc = textEditorContent.textOne;
        const task = await createTask({
            taskId: id,
            editFields: {
                name: TaskName,
                description: TaskDesc,
                descriptionTwo: textEditorContent.textTwo,
            },
            position: sortByPosition?.position,
        });

        if (isVisibleDetailTodo && task) {
            setCurrentTodo({ todo: task });
        }
        name.current.value = "";
        setTextEditorContent({ textOne: "", textTwo: "" });
        setPrimaryBtnDisabled(true);
    };

    const changeTodo = async () => {
        const TaskName = name.current.value;
        const TaskDesc = replaceEntityTags(textEditorContent.textOne);
        const arrayTodo = [
            { field: "name", value: TaskName },
            { field: "description", value: TaskDesc },
            {
                field: "descriptionTwo",
                value: replaceEntityTags(textEditorContent.textTwo),
            },
            { field: "editable", value: false },
        ];

        const task = await mutateTask(id, arrayTodo);
        if (isVisibleDetailTodo) {
            await mutateTask(id, arrayTodo, false, isVisibleDetailTodo);
        }

        updTodo(task);
    };

    const createSectionTodo = () => {
        if (sortByPosition?.sortPosition !== undefined) {
            createTaskSection({
                name: name.current.value,
                sort: sortByPosition?.sortPosition,
            });
        }
    };

    const changeSectionTodo = async () => {
        const task = await mutateTask(id, [
            { field: "name", value: name.current.value },
            { field: "editable", value: false },
        ]);
        updSection(task);
    };

    const applyActionTodo = () => {
        switch (action) {
            case "change":
                changeTodo();
                break;
            case "create":
                createTodo();
                break;
            case "createSection":
                createSectionTodo();
                break;
            case "changeSection":
                changeSectionTodo();
                break;
        }

        if (action === "createSection") {
            callback && callback();
        }
    };

    const todoFormClose = () => {
        setActiveAddTaskBtn({ isActive: true });
        setPrimaryBtnDisabled(true);
        setToolBarVisible(false);
        callback && callback();
    };

    const changeField = () => {
        if (action !== "change" && action !== "changeSection") {
            if (name.current.value.length) {
                setPrimaryBtnDisabled(false);
            } else {
                setPrimaryBtnDisabled(true);
            }
        }
    };

    useEffect(() => {
        if (isVisible && (action === "change" || action === "changeSection")) {
            name.current.value = inputValue;
        }
    }, [isVisible]);

    useEffect(() => {
        if (textValue !== undefined && textTwoValue !== undefined) {
            setTextEditorContent({textOne: textValue, textTwo: textTwoValue});
        }
    }, [textValue]);

    const setEditorContent = (current: any) => {
        if (current.target && current.target.contentElement) {
            setTextEditorContent({
                ...textEditorContent,
                textOne: replaceEntityTags(
                    current.target.contentElement.innerHTML
                ),
            });
        }
    };

    const setEditorContentAnki = (current: any) => {
        if (current.target && current.target.contentElement) {
            setTextEditorContent({
                ...textEditorContent,
                textTwo: replaceEntityTags(
                    current.target.contentElement.innerHTML
                ),
            });
        }
    };

    const onImageInsert = (args: any) => {
        const { files, view, event } = args;
        const nodeType = view.state.schema.nodes.image;

        const position =
            event.type === "drop"
                ? view.posAtCoords({ left: event.clientX, top: event.clientY })
                : null;

        insertImageFiles({ view, files, nodeType, position });

        return files.length > 0;
    };

    const onMount = (event: EditorMountEvent) => {
        const state = event.viewProps.state;
        const plugins = [...state.plugins, insertImagePlugin(onImageInsert)];

        let editor = document.getElementsByClassName("k-editor")[0];
        let iFrame = editor.querySelector("iframe");
        if (iFrame && iFrame.contentDocument) {
            const kendoContent =
                iFrame.contentDocument.querySelector(".k-content");
            if (kendoContent) {
                kendoContent.setAttribute("style", "font-family: Arial;");
            }
        }
        return new ProseMirror.EditorView(
            { mount: event.dom },
            {
                ...event.viewProps,
                state: ProseMirror.EditorState.create({
                    doc: state.doc,
                    plugins,
                }),
            }
        );
    };

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
                        {action !== "createSection" &&
                            action !== "changeSection" && (
                                <>
                                    {isVisibleEditor && (
                                        <ArrowButton
                                            tailwindstyles={`w-[21px] h-[22px] bg-stone-200 px-[3px]`}
                                            onClick={showToolBar}
                                        />
                                    )}
                                    {isVisibleEditor && (
                                       <TodoEditor 
                                            textValue={textValue ? textValue: ""} 
                                            textTwoValue={textTwoValue ? textTwoValue : ""} 
                                            editorHeight={editorHeight} 
                                            setEditorContent={setEditorContent} 
                                            setEditorContentAnki={setEditorContentAnki} 
                                            onMount={onMount}
                                            isVisibleToolBar={isVisibleToolBar}
                                            isAnki={currentSection.isAnkiSection}
                                        />
                                    )}
                                </>
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
