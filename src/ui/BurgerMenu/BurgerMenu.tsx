import { FC } from "react";
import { ISection } from "../../types/todo.types";
import ToolTaskPanel from "../Tools/ToolTaskPanel/ToolTaskPanel";
import { useToolTodo } from "../../hooks/useToolTodo";

interface IBurgerMenu {
    items: ISection[];
    setId: (id: string) => void;
}

const BurgerMenu: FC<IBurgerMenu> = ({ items, setId }) => {
    const { showToolPanel, hideToolPanel, toolPanelIsVisible } = useToolTodo(
        "",
        "section"
    );

    return (
        <div className="w-[340px] h-[100%] fixed bg-gray-100">
            <div className="display flex justify-center mt-[20px]">
                <ul className="w-[89%]">
                    {items.map((item) => {
                        return (
                            <div
                                className="display flex justify-between hover:bg-gray-200"
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
                                            translateY: '24px',
                                            showEditBtn: false,
                                            colorBtn: 'bg-gray-200'
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default BurgerMenu;
