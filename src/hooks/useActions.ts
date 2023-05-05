import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux"
import { todosActions } from "../store/services/todo/todo.slice";
import { uiActions } from "../store/reducers/ui.slice";
import { sectionsActions } from "../store/services/sections/sections.slice";

const allActions = {
    ...todosActions,
    ...uiActions,
    ...sectionsActions
}

export const useActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(allActions, dispatch);
}