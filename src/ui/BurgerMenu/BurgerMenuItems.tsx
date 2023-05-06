import { FC } from "react";
import { ISection, ITodoItem } from "../../types/todo.types";
import { useToolTodo } from "../../hooks/useToolTodo";
import ToolTaskPanel from "../Tools/ToolTaskPanel/ToolTaskPanel";
import { IMenuItem } from "../../types/ui.types";

interface IBurgerMenuItemsProps {
    items: ISection[];
    setId: (id: string) => void;
    count: number;
    menu: IMenuItem[];
    toolCallback?: (item: ISection) => void;
}

const BurgerMenuItems: FC<IBurgerMenuItemsProps> = ({
    items,
    count,
    setId,
    menu,
    toolCallback
}) => {
    const { showToolPanel, hideToolPanel, toolPanelIsVisible } = useToolTodo(
        "",
        "section"
    );

    return (
        <>
            {items.map((item) => {
                return (
                    <>
                        <div
                            className={`display flex justify-between hover:bg-gray-200`}
                            style={{ marginLeft: `${count}px` }}
                            onMouseOver={showToolPanel}
                            onMouseOut={hideToolPanel}
                        >
                            <li
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
                                        callbackToolMenu: () => { toolCallback && toolCallback(item); }
                                    }}
                                    settings={{
                                        menuItems: menu,
                                        translateY: "24px",
                                        showEditBtn: false,
                                        colorBtn: "bg-gray-200",
                                    }}
                                />
                            )}
                        </div>

                        <BurgerMenuItems
                            items={item.items}
                            setId={setId}
                            count={count + 4}
                            menu={menu}
                            toolCallback={toolCallback}
                        />
                    </>
                );
            })}
        </>
    );
};

export default BurgerMenuItems;
