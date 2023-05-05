import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux"
import { todosActions } from "../store/services/todo/todo.slice";
import { uiActions } from "../store/reducers/ui.slice";

const allActions = {
    ...todosActions,
    ...uiActions
}

export const useActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(allActions, dispatch);
}