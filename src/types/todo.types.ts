export interface ITodoList {
    id: number,
    name: string,
    type: string,
    showTasks:boolean,
    items: ITodoItem[]
}

export interface ITodoItem {
    id: number,
    name: string,
    type: string,
    showTasks:boolean,
    items: ITodoItem[]
}