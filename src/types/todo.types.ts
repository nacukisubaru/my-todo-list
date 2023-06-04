export interface ITodoItem {
    id: string,
    name: string,
    parentId?: string | null,
    sectionId?: string,
    nextTodoId?: string,
    prevTodoId?: string,
    description: string,
    descriptionTwo?: string,
    showTasks:boolean,
    type?: taskType,
    showSections?: boolean,
    isDragDisabled?: boolean,
    sort: number,
    index?: number,
    creatable:boolean,
    editable:boolean,
    creatableLower: boolean,
    creatableUpper: boolean,
    isComplete: boolean,
    items: ITodoItem[],
    isAnkiSection?: boolean,
}
export interface ITodoEditFields {
    name: string,
    description: string,
    descriptionTwo?: string,
    id?: string,
    parentId?: string | null,
    showTasks?: boolean,
    isComplete?: boolean,
    isDragDisabled?: boolean,
    items?: ITodoItem[]
}

export interface ISectionEditFields {
    name: string,
    id?: string,
    showSections?: boolean,
    parentId?: string | null,
    items?: ITodoItem[],
    isAnkiSection?: boolean,
}

export interface ISortByPosition {
    sortPosition?: number,
    position: string
}

export type taskType = "task" | "section";