import { getDictionaryByUser } from "../store/services/dictionary/dictionary.slice"
import { useActions } from "./useAction";
import { useAppDispatch, useAppSelector } from "./useAppSelector";

export const useFilter = () => {
    const filterDictionary: IFilterDictionary = useAppSelector(state => state.dictionaryReducer.filterDictionary);
    const { resetDictionary, setDictionaryFilter } = useActions();
    const dispatch = useAppDispatch();

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
            if (filterDictionary.languageTranslation) {
                languageTranslationCodes = filterDictionary.languageTranslation.map((lang: ILanguage) => lang.code);
            }
        }

        if (filter.studyStage) {
            if (filterDictionary.studyStage) {
                studyStage = filterDictionary.studyStage;
            }
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

    const checkApplyFilter = (): boolean => {
        for (const [key, value] of Object.entries(filterDictionary)) {
            if (key !== 'page') {
                const val: any = value;
                if (val.lenght) {
                    return true;
                }
            }
          }

          return false;
    }

    const selectOriginalLang = (langs: ILanguage[]) => {
        setDictionaryFilter({ ...filterDictionary, languageOriginal: langs });
    };

    const selectTranslationLang = (langs: ILanguage[]) => {
        setDictionaryFilter({ ...filterDictionary, languageTranslation: langs });
    };

    

    return { filtrate, checkApplyFilter, selectOriginalLang, selectTranslationLang, setDictionaryFilter, filterDictionary };
}