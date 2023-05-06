import { useDispatch } from "react-redux";
import BurgerMenu from "../../ui/BurgerMenu/BurgerMenu";
import TodoSectionsList from "../TodoSections/TodoSectionsList";
import { useEffect } from "react";
import { getSections } from "../../store/services/sections/sections.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import { useTaskTree } from "../../hooks/useTaskTree";
import { todoApi } from "../../store/services/todo/todo.api";

const WorkSpace = () => {
    const { sections } = useAppSelector((state) => state.sectionsReducer);
    const {setSectionId} = useActions();
    const dispatch = useDispatch();
    todoApi.useUpdTodosPositionsQuery({});
    const {createSection} = useTaskTree();

    useEffect(() => {
        const get = async () => {
            await dispatch(getSections());
            createSection("79d5bf69e1ae15ea916a9365af3401d5", "testnew4", {position: "lower", sortPosition: 1});
        }
        get();
    }, []);

    const choiseSection = (id: string) => {
        setSectionId({sectionId: id});
    }

    return (
        <>
            <BurgerMenu items={sections} setId={choiseSection}/>
            <TodoSectionsList />
        </>
    );
};

export default WorkSpace;
