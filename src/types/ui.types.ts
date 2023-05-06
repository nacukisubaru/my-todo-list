export interface IMenuItem {
    name: string,
    onClick: () => void
}

export interface IModalSettings {
    title: string;
    primaryBtnName: string;
    secondaryBtnName: string;
    isVisible: boolean;
}

export type changeAction = "create" | "change" | "createSection" | "changeSection";