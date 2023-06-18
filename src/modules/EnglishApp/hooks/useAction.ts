import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux"
import { dictionaryActions } from "../store/services/dictionary/dictionary.slice";

const allActions = {
    ...dictionaryActions
}

export const useActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(allActions, dispatch);
}