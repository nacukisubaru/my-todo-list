import { FC } from "react";
import { ISection } from "../../types/todo.types";

import { IMenuItem } from "../../types/ui.types";
import BurgerMenuItem from "./BurgerMenuItem";

interface IBurgerMenuItemsProps {
    items: ISection[];
    setId: (id: string) => void;
    toggleArrow: (id: string, value: boolean) => void;
    count: number;
    menu: IMenuItem[];
}

const BurgerMenuItems: FC<IBurgerMenuItemsProps> = ({
    items,
    count,
    setId,
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
                            setId={setId}
                            menu={menu}
                            toggleArrow={toggleArrow}
                        />
                        {item.showSections && (
                            <BurgerMenuItems
                                items={item.items}
                                setId={setId}
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
