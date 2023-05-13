import { ITodoItem } from "./todo.types";

export interface IMenuItem {
    name: string,
    onClick: (item: ITodoItem) => void,
    isDeactive?: boolean
}

export interface IToolTaskSettings {
    translateX?: string,
    translateY?: string
}

export interface IModalSettings {
    title: string;
    primaryBtnName: string;
    secondaryBtnName: string;
    isVisible: boolean;
    heightBody?: string;
    showButtons?: boolean;
    showUpperButtons?: boolean;
}

export interface IMutateList {
    field: string,
    value: any
}

export type changeAction = "create" | "change" | "createSection" | "changeSection";