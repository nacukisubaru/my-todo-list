import { useDispatch } from "react-redux"
import { getDictionaryByUser } from "../store/services/dictionary/dictionary.slice"
import { useActions } from "./useAction";
import { useAppSelector } from "./useAppSelector";

export const useFilter = () => {
    const filterDictionary: IFilterDictionary | any = useAppSelector(state => state.dictionaryReducer.filterDictionary);
    const {resetDictionary, setDictionaryFilter} = useActions();
    const dispatch = useDispatch();
  
    const filtrate = async (page: number = 0, resetState: boolean = true) => {
        let languageOriginalCodes: string[] = [];
        let languageTranslationCodes: string[] = [];
        let studyStage: studyStageType[] = [];

        if (filterDictionary.languageOriginal) {
            languageOriginalCodes = filterDictionary.languageOriginal.map((lang:ILanguage) => lang.code);
        }

        if (filterDictionary.languageTranslation) {
            languageTranslationCodes = filterDictionary.languageTranslation.map((lang:ILanguage) => lang.code);
        }

        if (filterDictionary.studyStage) {
            studyStage = filterDictionary.studyStage;
        }
        
        if (resetState) {
            await resetDictionary();
        }

        dispatch(getDictionaryByUser({page, languageOriginal: languageOriginalCodes, languageTranslation: languageTranslationCodes, studyStage}));
    }

    const selectOriginalLang = (langs: ILanguage[]) => {
        setDictionaryFilter({...filterDictionary, languageOriginal: langs});
    };

    const selectTranslationLang = (langs: ILanguage[]) => {
        setDictionaryFilter({...filterDictionary, languageTranslation: langs});
    };

    return {filtrate, selectOriginalLang, selectTranslationLang, setDictionaryFilter, filterDictionary};
}