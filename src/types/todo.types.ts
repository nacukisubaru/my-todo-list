export interface ITodoSection {
    id: number,
    name: string,
    description: string,
    type: string,
    showTasks:boolean,
    creatable: boolean,
    editable:boolean,
    items: ITodoItem[] | []
}

export interface ITodoItem {
    id: number,
    name: string,
    description: string,
    type: string,
    showTasks:boolean,
    editable:boolean,
    creatableLower: boolean,
    creatableUpper: boolean,
    items: ITodoItem[] | []
}

export interface ITodoEditFields {
    name: string,
    description: string
}