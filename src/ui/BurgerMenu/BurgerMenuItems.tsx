import { FC } from "react";
import { ISection } from "../../types/todo.types";
import { useToolTodo } from "../../hooks/useToolTodo";
import ToolTaskPanel from "../Tools/ToolTaskPanel/ToolTaskPanel";

interface IBurgerMenuItemsProps {
    items: ISection[];
    setId: (id: string) => void;
    count: number;
}
const BurgerMenuItems: FC<IBurgerMenuItemsProps> = ({
    items,
    count,
    setId,
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
                                        menuItems: [
                                            {
                                                name: "Добавить раздел выше",
                                                onClick: () => {},
                                            },
                                            {
                                                name: "Добавить раздел ниже",
                                                onClick: () => {},
                                            },
                                        ],
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
                        />
                    </>
                );
            })}
        </>
    );
};

export default BurgerMenuItems;
