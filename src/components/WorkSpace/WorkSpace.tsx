import { useDispatch } from "react-redux";
import BurgerMenu from "../../ui/BurgerMenu/BurgerMenu";
import TodoSectionsList from "../TodoSections/TodoSectionsList";
import { useEffect } from "react";
import { getSections } from "../../store/services/sections/sections.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";

const WorkSpace = () => {
    const { sections } = useAppSelector((state) => state.sectionsReducer);
    const {setSectionId} = useActions();
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getSections());
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
