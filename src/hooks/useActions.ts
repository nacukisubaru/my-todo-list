import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux"
import { todosActions } from "../store/services/todo/todo.slice";
import { uiActions } from "../store/reducers/ui.slice";
import { sectionsActions } from "../store/services/sections/sections.slice";
import { authActions } from "../store/services/auth/auth.slice";

const allActions = {
    ...todosActions,
    ...uiActions,
    ...sectionsActions,
    ...authActions
}

export const useActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(allActions, dispatch);
}