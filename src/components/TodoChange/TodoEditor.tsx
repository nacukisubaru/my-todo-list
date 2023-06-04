import {
    Editor,
    EditorMountEvent,
    EditorTools,
} from "@progress/kendo-react-editor";
import { InsertImage } from "../InsertImagePlugin/InsetImageTool";
import { iframeToEntity } from "../../helpers/stringHelper";
import { FC, useEffect, useState } from "react";

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

const listComponentsEditor = [
    [Bold, Italic, Underline, Strikethrough],
    [InsertImage],
    ForeColor,
    BackColor,
    [CleanFormatting],
    [AlignLeft, AlignCenter, AlignRight, AlignJustify],
    [Indent, Outdent],
    [OrderedList, UnorderedList],
    [NumberedList, BulletedList],
    FontSize,
    FontName,
    FormatBlock,
    [SelectAll],
    [Undo, Redo],
    [Link, Unlink, ViewHtml],
    [InsertTable, InsertFile],
    [Pdf, Print],
    [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
    [DeleteRow, DeleteColumn, DeleteTable],
    [MergeCells, SplitCell],
];

interface ITodoEditorProps {
    isVisibleToolBar?: boolean;
    textValue: string;
    textTwoValue: string;
    editorHeight: string;
    isAnki?: boolean;
    setEditorContent: (current: any) => void;
    setEditorContentAnki: (current: any) => void;
    onMount: (event: EditorMountEvent) => void;
}

const TodoEditor: FC<ITodoEditorProps> = ({
    isVisibleToolBar = false,
    textValue,
    textTwoValue,
    editorHeight,
    isAnki = false,
    setEditorContent,
    setEditorContentAnki,
    onMount,
}) => {
    const [componentsEditor, setComponentsEditor] =
        useState(listComponentsEditor);

    useEffect(() => {
        if (isVisibleToolBar) {
            setComponentsEditor(listComponentsEditor);
        } else {
            setComponentsEditor([]);
        }
    }, [isVisibleToolBar]);

    return (
        <>
            <div className="mb-[15px]">
                <Editor
                    tools={componentsEditor}
                    onChange={setEditorContent}
                    defaultContent={iframeToEntity(textValue)}
                    onMount={onMount}
                    style={{
                        height: editorHeight,
                    }}
                />
            </div>
            {isAnki && (
                <Editor
                    tools={componentsEditor}
                    onChange={setEditorContentAnki}
                    value={iframeToEntity(textTwoValue)}
                    onMount={onMount}
                    style={{
                        height: editorHeight,
                    }}
                />
            )}
        </>
    );
};

export default TodoEditor;
