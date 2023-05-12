import { FC } from "react";
import { ISection } from "../../types/todo.types";

import { IMenuItem } from "../../types/ui.types";
import BurgerMenuItem from "./BurgerMenuItem";

interface IBurgerMenuItemsProps {
    items: ISection[];
    setItem: (item: ISection) => void;
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
                        <BurgerMenuItem
                            count={count}
                            item={item}
                            setItem={setItem}
                            menu={menu}
                            toggleArrow={toggleArrow}
                        />
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
