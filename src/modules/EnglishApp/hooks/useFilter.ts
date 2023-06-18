import { useDispatch } from "react-redux"
import { getDictionaryByUser } from "../store/services/dictionary/dictionary.slice"
import { useActions } from "./useAction";
import { useAppSelector } from "./useAppSelector";

export const useFilter = () => {
    const filterDictionary = useAppSelector(state => state.dictionaryReducer.filterDictionary);
    const {resetDictionary, setDictionaryFilter} = useActions();
    const dispatch = useDispatch();
  
    const filtrate = async (page: number = 0, resetState: boolean = true) => {
        let languageOriginalCodes: string[] = [];
        let languageTranslationCodes: string[] = [];

        if (filterDictionary.languageOriginal) {
            languageOriginalCodes = filterDictionary.languageOriginal.map(lang => lang.code);
        }

        if (filterDictionary.languageTranslation) {
            languageTranslationCodes = filterDictionary.languageTranslation.map(lang => lang.code);
        }
        
        if (resetState) {
            await resetDictionary();
        }
        dispatch(getDictionaryByUser({page, languageOriginal: languageOriginalCodes, languageTranslation: languageTranslationCodes}));
    }

    const selectOriginalLang = (langs: ILanguage[]) => {
        setDictionaryFilter({...filterDictionary, languageOriginal: langs});
    };

    const selectTranslationLang = (langs: ILanguage[]) => {
        setDictionaryFilter({...filterDictionary, languageTranslation: langs});
    };

    return {filtrate, selectOriginalLang, selectTranslationLang, filterDictionary};
}