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
    toggleArrow,
}) => {
    const { showToolPanel, hideToolPanel, toolPanelIsVisible } = useToolTodo(
        "",
        "section"
    );

    return (
        <>
            {item.items.length > 0 ? (
                <div
                    className={`display flex justify-between hover:bg-gray-200 cursor-pointer -ml-[20px]`}
                    style={ item.parentId && { marginLeft: `${count}px` }}
                    onMouseOver={showToolPanel}
                    onMouseOut={hideToolPanel}
                >
                    <li className="w-[100%] ml-3" key={item.id}>
                        <div className="display flex ">
                            <span className="mr-[5px]">
                                <ArrowButton
                                    isArrowOpen={item.showSections}
                                    color="bg-inherit"
                                    onClick={(value: boolean) => {
                                        toggleArrow(item.id, value);
                                    }}
                                />
                            </span>

                            <span
                                className="w-[100%]"
                                onClick={() => {
                                    setId(item.id);
                                }}
                            >
                                {item.name}
                            </span>
                        </div>
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
            ) : (
                <div
                    className={`display flex justify-between hover:bg-gray-200 cursor-pointer`}
                    style={ item.parentId && { marginLeft: `${count}px` }}
                    onMouseOver={showToolPanel}
                    onMouseOut={hideToolPanel}
                >
                    <li
                        className="w-[100%] ml-3"
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
            )}
        </>
    );
};

export default BurgerMenuItem;
