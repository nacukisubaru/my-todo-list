export interface ITodoItem {
    id: string,
    name: string,
    parentId?: string | null,
    sectionId?: string,
    description: string,
    showTasks:boolean,
    type?: taskType,
    showSections?: boolean,
    sort: number,
    index?: number,
    creatable:boolean,
    editable:boolean,
    creatableLower: boolean,
    creatableUpper: boolean,
    isComplete: boolean,
    items: ITodoItem[]
}
export interface ITodoEditFields {
    name: string,
    description: string,
    id?: string,
    parentId?: string | null,
    showTasks?: boolean,
    isComplete?: boolean,
    items?: ITodoItem[]
}

export interface ISectionEditFields {
    name: string,
    id?: string,
    showSections?: boolean,
    parentId?: string | null,
    items?: ITodoItem[]
}

export interface ISortByPosition {
    sortPosition?: number,
    position: string
}

export type taskType = "task" | "section";