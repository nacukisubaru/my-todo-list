import { FC, useEffect, useRef, useState } from "react";
import { useActions } from "../../hooks/useActions";
import { useTaskTree } from "../../hooks/useTaskTree";
import { ISortByPosition } from "../../types/todo.types";
import { changeAction } from "../../types/ui.types";
import { todoSectionsApi } from "../../store/services/todo/todo-sections.api";
import { todoApi } from "../../store/services/todo/todo.api";
import BasicButton from "../../ui/Buttons/BasicButton/BasicButton";
import { useAppSelector } from "../../hooks/useAppSelector";
import { Editor, EditorMountEvent, EditorTools, ProseMirror } from "@progress/kendo-react-editor";
import { iframeToEntity, replaceEntityTags } from "../../helpers/stringHelper";
import "@progress/kendo-theme-default/dist/all.css";

import { insertImageFiles } from "../InsertImagePlugin/utils";
import { insertImagePlugin } from "../InsertImagePlugin/InsertImagePlugin";
import { InsertImage } from "../InsertImagePlugin/InsetImageTool";
import ArrowButton from "../../ui/Buttons/ArrowButton/ArrowButton";

interface IInputsSettings {
    inputValue?: string;
    textValue?: string;
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
    showToolBarEditor?: boolean;
}

const TodoChange: FC<ITodoChange> = ({
    id,
    buttonsSettings,
    inputsSettings,
    isVisible = false,
    callback,
    action = "create",
    sortByPosition,
    showToolBarEditor = false,
}) => {
    const {
        Bold,
        Italic,
        Underline,
        Strikethrough,
        ForeColor,
        BackColor,
        CleanFormatting,
        AlignLeft,
        AlignCenter,
        AlignRight,
        AlignJustify,
        Indent,
        Outdent,
        OrderedList,
        UnorderedList,
        NumberedList,
        BulletedList,
        Undo,
        Redo,
        FontSize,
        FontName,
        FormatBlock,
        Link,
        Unlink,
        ViewHtml,
        InsertTable,
        InsertFile,
        SelectAll,
        Print,
        Pdf,
        AddRowBefore,
        AddRowAfter,
        AddColumnBefore,
        AddColumnAfter,
        DeleteRow,
        DeleteColumn,
        DeleteTable,
        MergeCells,
        SplitCell,
    } = EditorTools;

    const { inputPlaceHolder, inputValue, textValue } = inputsSettings;
    const { primaryButtonName, secondaryButtonName } = buttonsSettings;

    const { createTask, mutateTask, createTaskSection } = useTaskTree();
    const [primaryBtnIsDisabled, setPrimaryBtnDisabled] = useState(true);
    const { isVisibleDetailTodo } = useAppSelector((state) => state.uiReducer);
    const { setActiveAddTaskBtn, setCurrentTodo } = useActions();

    const [updSection] = todoSectionsApi.useUpdateMutation();
    const [updTodo] = todoApi.useUpdateMutation();

    const [textEditorContent, setTextEditorContent] = useState("");
    const [isVisibleEditor, setEditorVisible] = useState(false);

    const name: any = useRef();

    const showEditor = (show: boolean) => {
        setEditorVisible(show);
    }

    const createTodo = async () => {
        const TaskName = name.current.value;
        const TaskDesc = textEditorContent;
        const task = await createTask({
            taskId: id,
            editFields: { name: TaskName, description: TaskDesc },
            position: sortByPosition?.position,
        });
        
        if (isVisibleDetailTodo && task) {
            setCurrentTodo({ todo: task });
        }
        name.current.value = "";
        setTextEditorContent('');
        setPrimaryBtnDisabled(true);
    };

    const changeTodo = async () => {
        const TaskName = name.current.value;
        const TaskDesc = replaceEntityTags(textEditorContent);
        const arrayTodo = [
            { field: "name", value: TaskName },
            { field: "description", value: TaskDesc },
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
        setEditorVisible(false);
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
        }
    }, [isVisible]);

    const setEditorContent = (current: any) => {
        if (current.target && current.target.contentElement) {
            setTextEditorContent(replaceEntityTags(current.target.contentElement.innerHTML));
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
    
        return new ProseMirror.EditorView(
          { mount: event.dom },
          {
            ...event.viewProps,
            state: ProseMirror.EditorState.create({ doc: state.doc, plugins }),
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
                                    <ArrowButton 
                                        tailwindstyles={`w-[21px] h-[22px] bg-stone-200 px-[3px]`}
                                        onClick={showEditor}
                                    />
                                    {isVisibleEditor ? (
                                        <Editor
                                            tools={[
                                                [
                                                    Bold,
                                                    Italic,
                                                    Underline,
                                                    Strikethrough,
                                                ],
                                                [InsertImage],
                                                ForeColor,
                                                BackColor,
                                                [CleanFormatting],
                                                [
                                                    AlignLeft,
                                                    AlignCenter,
                                                    AlignRight,
                                                    AlignJustify,
                                                ],
                                                [Indent, Outdent],
                                                [OrderedList, UnorderedList],
                                                [NumberedList, BulletedList],
                                                FontSize,
                                                FontName,
                                                FormatBlock,
                                                [SelectAll],
                                                [Undo, Redo],
                                                [
                                                    Link,
                                                    Unlink,
                                                    ViewHtml,
                                                ],
                                                [InsertTable, InsertFile],
                                                [Pdf, Print],
                                                [
                                                    AddRowBefore,
                                                    AddRowAfter,
                                                    AddColumnBefore,
                                                    AddColumnAfter,
                                                ],
                                                [
                                                    DeleteRow,
                                                    DeleteColumn,
                                                    DeleteTable,
                                                ],
                                                [MergeCells, SplitCell],
                                            ]}
                                          
                                            onChange={setEditorContent}
                                            defaultContent={iframeToEntity(textValue)}
                                            onMount={ onMount}
                                            style={{height: '500px'}}
                                        />
                                    ) : (
                                        <Editor
                                         
                                            onChange={setEditorContent}
                                            style={{height:'500px'}}
                                            defaultContent={iframeToEntity(textValue)}
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
