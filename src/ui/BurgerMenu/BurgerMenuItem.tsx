import { FC } from "react";
import { useToolTodo } from "../../hooks/useToolTodo";
import ToolTaskPanel from "../Tools/ToolTaskPanel/ToolTaskPanel";
import { ITodoItem } from "../../types/todo.types";
import { IMenuItem } from "../../types/ui.types";
import ArrowButton from "../Buttons/ArrowButton/ArrowButton";
import { useNavigate } from "react-router-dom";
import DndWrapper from "../../components/DnD/DndWrapper";

interface IBurgerMenuItemProps {
    count: number;
    item: ITodoItem;
    setItem: (item: ITodoItem) => void;
    toggleArrow: (id: string, value: boolean) => void;
    menu: IMenuItem[];
    itemWithArrow: boolean;
}

const BurgerMenuItem: FC<IBurgerMenuItemProps> = ({
    count,
    item,
    menu,
    itemWithArrow,
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
            {/* <DndWrapper id={item.id} index={count}> */}
                <div
                    className={`display flex justify-between hover:bg-gray-200 cursor-pointer ${
                        itemWithArrow && "-ml-[20px]"
                    } `}
                    style={item.parentId ? { marginLeft: `${count}px` } : {}}
                    onMouseOver={showToolPanel}
                    onMouseOut={hideToolPanel}
                >
                    {itemWithArrow ? (
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
                    ) : (
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
                    )}

                    {toolPanelIsVisible && (
                        <ToolTaskPanel
                            callbacks={{
                                clickEditBtn: () => {},
                            }}
                            settings={{
                                menuItems: menu,
                                showEditBtn: false,
                                colorBtn: "bg-gray-200",
                                translateX: "-translate-x-[150px]",
                            }}
                            parent={item}
                        />
                    )}
                </div>
            {/* </DndWrapper> */}
        </>
    );
};

export default BurgerMenuItem;
