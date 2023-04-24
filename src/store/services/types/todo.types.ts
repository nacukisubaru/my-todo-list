export interface ITodoList {
    sectionId: number,
    name: string,
    showTasks:boolean
    items: ITodoItem[]
}

export interface ITodoItem {
    todoId: number,
    name: string,
    items: ITodoItem[]
}