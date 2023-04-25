import BurgerMenu from "../../ui/BurgerMenu/BurgerMenu";
import TodoSectionsList from "../TodoSections/TodoSectionsList";

const WorkSpace = () => {
    return (
        <>
             <BurgerMenu
                items={[
                    { id: 1, name: "Добро пожаловать" },
                    { id: 2, name: "Проект 1" },
                    { id: 3, name: "Проект 2" },
                ]}
            />
            <TodoSectionsList />
        </>
    );
}

export default WorkSpace;