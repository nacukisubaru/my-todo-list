export interface ITodoList {
    id: number,
    name: string,
    description: string,
    type: string,
    showTasks:boolean,
    items: ITodoItem[]
}

export interface ITodoItem {
    id: number,
    name: string,
    description: string,
    type: string,
    showTasks:boolean,
    items: ITodoItem[]
}

export interface ITodoEditFields {
    name: string,
    description: string
}