import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux"
import { dictionaryActions } from "../store/services/dictionary/dictionary.slice";
import { settingsActions } from "../store/services/settings/settings.slice";

const allActions = {
    ...dictionaryActions,
    ...settingsActions
}

export const useActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(allActions, dispatch);
}