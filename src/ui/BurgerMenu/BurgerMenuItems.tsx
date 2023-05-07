import { FC } from "react";
import { ISection } from "../../types/todo.types";
import { useToolTodo } from "../../hooks/useToolTodo";
import ToolTaskPanel from "../Tools/ToolTaskPanel/ToolTaskPanel";
import { IMenuItem } from "../../types/ui.types";

interface IBurgerMenuItemsProps {
    items: ISection[];
    setId: (id: string) => void;
    count: number;
    menu: IMenuItem[];
}

const BurgerMenuItems: FC<IBurgerMenuItemsProps> = ({
    items,
    count,
    setId,
    menu,
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

                        <BurgerMenuItems
                            items={item.items}
                            setId={setId}
                            count={count + 4}
                            menu={menu}
                        />
                    </>
                );
            })}
        </>
    );
};

export default BurgerMenuItems;
