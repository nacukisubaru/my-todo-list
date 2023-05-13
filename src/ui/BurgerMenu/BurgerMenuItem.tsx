import { FC } from "react";
import { useToolTodo } from "../../hooks/useToolTodo";
import ToolTaskPanel from "../Tools/ToolTaskPanel/ToolTaskPanel";
import { ITodoItem } from "../../types/todo.types";
import { IMenuItem } from "../../types/ui.types";
import ArrowButton from "../Buttons/ArrowButton/ArrowButton";
import { useNavigate } from "react-router-dom";

interface IBurgerMenuItemProps {
    count: number;
    item: ITodoItem;
    setItem: (item: ITodoItem) => void;
    toggleArrow: (id: string, value: boolean) => void;
    menu: IMenuItem[];
}

const BurgerMenuItem: FC<IBurgerMenuItemProps> = ({
    count,
    item,
    menu,
    setItem,
    toggleArrow,
}) => {
    const { showToolPanel, hideToolPanel, toolPanelIsVisible } = useToolTodo(
        "",
        "section"
    );
    const navigate = useNavigate();

    return (
        <>
            {item.items.length > 0 ? (
                <div
                    className={`display flex justify-between hover:bg-gray-200 cursor-pointer -ml-[20px]`}
                    style={ item.parentId ? { marginLeft: `${count}px` } : {}}
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
                                    navigate(`/app/section/${item.id}`);
                                    setItem(item);
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
                    style={ item.parentId ? { marginLeft: `${count}px` } : {}}
                    onMouseOver={showToolPanel}
                    onMouseOut={hideToolPanel}
                >
                    <li
                        className="w-[100%] ml-3"
                        key={item.id}
                        onClick={() => {
                            navigate(`/app/section/${item.id}`);
                            setItem(item);
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
