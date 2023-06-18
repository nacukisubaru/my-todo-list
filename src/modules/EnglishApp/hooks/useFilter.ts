import { useDispatch } from "react-redux"
import { getDictionaryByUser } from "../store/services/dictionary/dictionary.slice"
import { useActions } from "./useAction";
import { useAppSelector } from "./useAppSelector";

export const useFilter = () => {
    const filterDictionary: IFilterDictionary | any = useAppSelector(state => state.dictionaryReducer.filterDictionary);
    const { resetDictionary, setDictionaryFilter } = useActions();
    const dispatch = useDispatch();

    const filtrate = async (page: number = 0, resetState: boolean = true) => {
        const filter: IFilterDictionary = filterDictionary;
        let languageOriginalCodes: string[] = [];
        let languageTranslationCodes: string[] = [];
        let studyStage: studyStageType[] = [];
        let searchByOriginal: string = '';
        let searchByTranslate: string = '';

        if (filter.languageOriginal) {
            languageOriginalCodes = filter.languageOriginal.map((lang: ILanguage) => lang.code);
        }

        if (filter.languageTranslation) {
            languageTranslationCodes = filterDictionary.languageTranslation.map((lang: ILanguage) => lang.code);
        }

        if (filter.studyStage) {
            studyStage = filterDictionary.studyStage;
        }

        if (filter.searchByOriginal) {
            searchByOriginal = filter.searchByOriginal;
        }

        if (filter.searchByTranslate) {
            searchByTranslate = filter.searchByTranslate;
        }

        if (resetState) {
            await resetDictionary();
        }

        return dispatch(getDictionaryByUser({ 
            page, 
            languageOriginal: languageOriginalCodes, 
            languageTranslation: languageTranslationCodes, 
            studyStage,
            searchByOriginal,
            searchByTranslate
        }));
    }

    const selectOriginalLang = (langs: ILanguage[]) => {
        setDictionaryFilter({ ...filterDictionary, languageOriginal: langs });
    };

    const selectTranslationLang = (langs: ILanguage[]) => {
        setDictionaryFilter({ ...filterDictionary, languageTranslation: langs });
    };

    return { filtrate, selectOriginalLang, selectTranslationLang, setDictionaryFilter, filterDictionary };
}