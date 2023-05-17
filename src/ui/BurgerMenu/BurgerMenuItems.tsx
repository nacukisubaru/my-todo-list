import { FC } from "react";
import { ITodoItem } from "../../types/todo.types";

import { IMenuItem } from "../../types/ui.types";
import BurgerMenuItem from "./BurgerMenuItem";

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
    return (
        <>
            {items.map((item) => {
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
                            />
                        ) : (
                            <BurgerMenuItem
                                count={count}
                                item={item}
                                setItem={setItem}
                                menu={menu}
                                toggleArrow={toggleArrow}
                                itemWithArrow={false}
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
        </>
    );
};

export default BurgerMenuItems;
