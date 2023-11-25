import TodoSectionsList from "../../components/TodoSections/TodoSectionsList";
import SectionsMenu from "../../components/Sections/SectionsMenu";
import Header from "../../ui/Header/Header";
import TodoDetail from "../../components/TodoDetail/TodoDetail";
import { useStartApp } from "../../hooks/useStartApp";
import { useEffect } from "react";
import { setTitle } from "../../helpers/domHelper";

const WorkSpace = () => {
    useStartApp();
    useEffect(() => {
        setTitle("Список дел");
    }, [])
    return (
        <>
            <SectionsMenu />
            <Header />
            <TodoSectionsList />
            <TodoDetail />
        </>
    );
};

export default WorkSpace;
