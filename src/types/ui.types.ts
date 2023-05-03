export interface IMenuItem {
    name: string,
    onClick: () => void
}

export type changeAction = "create" | "change" | "createSection" | "changeSection";