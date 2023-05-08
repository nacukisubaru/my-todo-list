import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getSections } from "../../store/services/sections/sections.slice";
import { todoApi } from "../../store/services/todo/todo.api";

import TodoSectionsList from "../TodoSections/TodoSectionsList";
import SectionsMenu from "../Sections/SectionsMenu";
import Header from "../../ui/Header/Header";

const WorkSpace = () => {
    const dispatch = useDispatch();
    const updPositions = todoApi.useUpdTodosPositionsQuery({});

    useEffect(() => {
        const get = async () => {
            await updPositions.refetch();
            await dispatch(getSections());
        };
        get();
    }, []);

    return (
        <>
            <Header />
            <SectionsMenu />
            <TodoSectionsList />
        </>
    );
};

export default WorkSpace;
