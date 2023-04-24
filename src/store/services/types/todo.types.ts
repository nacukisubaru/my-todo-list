export interface ITodoList {
    sectionId: number,
    name: string,
    items: ITodoItem[]
}

export interface ITodoItem {
    todoId: number,
    name: string,
    items: ITodoItem[]
}