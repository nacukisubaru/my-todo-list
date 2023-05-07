import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getSections } from "../../store/services/sections/sections.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import { todoApi } from "../../store/services/todo/todo.api";
import { useSection } from "../../hooks/useSection";
import { useModal } from "../../hooks/useModal";
import BurgerMenu from "../../ui/BurgerMenu/BurgerMenu";
import TodoSectionsList from "../TodoSections/TodoSectionsList";
import Modal from "../../ui/Modal/Modal";
import SectionsMenu from "../Sections/SectionsMenu";


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
            <SectionsMenu />
            <TodoSectionsList />
        </>
    );
};

export default WorkSpace;
