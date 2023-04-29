export interface ITodoSection {
    id: string,
    name: string,
    description: string,
    showTasks:boolean,
    creatable: boolean,
    editable:boolean,
    items: ITodoItem[] | []
}

export interface ITodoItem {
    id: string,
    name: string,
    parentId: string,
    description: string,
    showTasks:boolean,
    sort: number,
    editable:boolean,
    creatableLower: boolean,
    creatableUpper: boolean,
    items: ITodoItem[] | []
}

export interface ITodoEditFields {
    name: string,
    description: string
}