import { FC } from "react";
import { ITodoItem } from "../../types/todo.types";

import { IMenuItem } from "../../types/ui.types";
import BurgerMenuItem from "./BurgerMenuItem";
import { DragDropContext } from "react-beautiful-dnd";
import { useTaskTree } from "../../hooks/useTaskTree";

interface IBurgerMenuItemsProps {
    items: ITodoItem[];
    setItem: (item: ITodoItem) => void;
    toggleArrow: (id: string, value: boolean) => void;
    count: number;
    menu: IMenuItem[];
}

const BurgerMenuItems: FC<IBurgerMenuItemsProps> = ({
    items,
    count,
    setItem,
    toggleArrow,
    menu,
}) => {

    const {dragAndDropSort} = useTaskTree();
    const onDragEnd = (draggable: any) => {
        dragAndDropSort({
            destination: draggable.destination, 
            draggableId: draggable.draggableId,
            dragSection: true
        });
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                {items.map((item, index) => {
                    return (
                        <>
                            {item.items.length > 0 ? (
                                <BurgerMenuItem
                                    count={count}
                                    item={item}
                                    setItem={setItem}
                                    menu={menu}
                                    toggleArrow={toggleArrow}
                                    itemWithArrow={true}
                                    index={index}
                                />
                            ) : (
                                <BurgerMenuItem
                                    count={count}
                                    item={item}
                                    setItem={setItem}
                                    menu={menu}
                                    toggleArrow={toggleArrow}
                                    itemWithArrow={false}
                                    index={index}
                                />
                            )}
                            {item.showSections && (
                                <BurgerMenuItems
                                    items={item.items}
                                    setItem={setItem}
                                    count={count + count}
                                    menu={menu}
                                    toggleArrow={toggleArrow}
                                />
                            )}
                        </>
                    );
                })}
            </DragDropContext>
        </>
    );
};

export default BurgerMenuItems;
