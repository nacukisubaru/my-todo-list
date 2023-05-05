export interface ITodoItem {
    id: string,
    name: string,
    parentId?: string | null,
    sectionId?: string,
    description: string,
    showTasks:boolean,
    type?: string,
    sort: number,
    creatable:boolean,
    editable:boolean,
    creatableLower: boolean,
    creatableUpper: boolean,
    isComplete: boolean,
    items: ITodoItem[] | []
}

export interface ITodoEditFields {
    name: string,
    description: string
}

export interface ISortByPosition {
    sortPosition?: number,
    position: string
}