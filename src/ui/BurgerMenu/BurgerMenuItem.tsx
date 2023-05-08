import { FC } from "react";
import { useToolTodo } from "../../hooks/useToolTodo";
import ToolTaskPanel from "../Tools/ToolTaskPanel/ToolTaskPanel";
import { ISection } from "../../types/todo.types";
import { IMenuItem } from "../../types/ui.types";
import ArrowButton from "../Buttons/ArrowButton/ArrowButton";

interface IBurgerMenuItemProps {
    count: number;
    item: ISection;
    setId: (id: string) => void;
    toggleArrow: (id: string, value: boolean) => void;
    menu: IMenuItem[];
}

const BurgerMenuItem: FC<IBurgerMenuItemProps> = ({
    count,
    item,
    menu,
    setId,
    toggleArrow
}) => {
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
            {item.items.length > 0 ? (
                    <div className="display flex">
                        <ArrowButton
                            isArrowOpen={item.showSections}
                            color="bg-inherit"
                            onClick={(value: boolean) => {toggleArrow(item.id, value)}}
                        />
                        <span className="ml-3">{item.name}</span>
                    </div>
                ): (
                    item.name
                )}
            <li
                className="w-[100%]"
                key={item.id}
                onClick={() => {
                    setId(item.id);
                }}
            >
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
