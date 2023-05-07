import { ITodoItem } from "./todo.types";

export interface IMenuItem {
    name: string,
    onClick: (item: ITodoItem) => void
}

export interface IModalSettings {
    title: string;
    primaryBtnName: string;
    secondaryBtnName: string;
    isVisible: boolean;
}

export interface IMutateList {
    field: string,
    value: any
}

export type changeAction = "create" | "change" | "createSection" | "changeSection";