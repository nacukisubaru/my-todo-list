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
    creatable:boolean,
    editable:boolean,
    creatableLower: boolean,
    creatableUpper: boolean,
    isComplete: boolean,
    items: ITodoItem[] | []
}

export interface ISection {
    id: string,
    name: string,
    items: ISection[]
}

export interface ITodoEditFields {
    name: string,
    description: string
}

export interface ISortByPosition {
    sortPosition?: number,
    position: string
}

export type taskType = "task" | "section";