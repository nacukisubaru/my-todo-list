import { FC } from "react";
import { useToolTodo } from "../../hooks/useToolTodo";
import ToolTaskPanel from "../Tools/ToolTaskPanel/ToolTaskPanel";
import { ISection } from "../../types/todo.types";
import { IMenuItem } from "../../types/ui.types";

interface IBurgerMenuItemProps {
    count: number,
    item: ISection,
    setId: (id: string) => void,
    menu: IMenuItem[]
}

const BurgerMenuItem: FC<IBurgerMenuItemProps> = ({count, item, menu, setId}) => {
    const { showToolPanel, hideToolPanel, toolPanelIsVisible } = useToolTodo(
        "",
        "section"
    );

    return (
        <div
            className={`display flex justify-between hover:bg-gray-200`}
            style={{ marginLeft: `${count}px` }}
            onMouseOver={showToolPanel}
            onMouseOut={hideToolPanel}
        >
            <li
                className="w-[100%]"
                key={item.id}
                onClick={() => {
                    setId(item.id);
                }}
            >
                {item.name}
            </li>
            {toolPanelIsVisible && (
                <ToolTaskPanel
                    callbacks={{
                        clickEditBtn: () => {},
                    }}
                    settings={{
                        menuItems: menu,
                        translateY: "24px",
                        showEditBtn: false,
                        colorBtn: "bg-gray-200",
                    }}
                    parent={item}
                />
            )}
        </div>
    );
};

export default BurgerMenuItem;
