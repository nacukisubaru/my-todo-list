type translateMethod = "lingvo" | "yandex";
interface IDictionary {
    id: string;
    originalWord: string;
    translatedWord: string;
    languageOriginal: string;
    languageTranslation: string;
    dictionaryExamples: IDictionaryExample[]; 
    studyStage: studyStageType;
}

interface IDictionaryExample {
    originalText: string,
    translatedText: string,
    exampleType: string,
    showTranslate: boolean
}

interface ILanguageSettings {
    code: string,
    isoName: string
}

interface IDictionaryMainSettings {
    id: number,
    sourceLanguage: string,
    targetLanguage: string,
    sourceISO: string,
    targetISO: string
}

interface IDictionarySettings {
    settings:IDictionaryMainSettings[],
    langsForStudy: ILanguageSettings[],
    studyLangs: ILanguageSettings[],
    settingsForSelector: IOption[]
}

interface IDictionaryActiveSettings {
    id: number,
    sourceLanguage: string,
    targetLanguage: string,
    sourceISO?: string,
    targetISO?: string
}

interface IDictionaryLangsCodes {
    sourceLanguage: string,
    targetLanguage: string
}

interface IAddDictionarySettings {
    sourceLangCodes: string[],
    targetLangCodes: string []
}

interface IRemoveDictionarySettings {
    sourceCodesList?: string[],
    targetCodesList?: string[]
}

interface ITranslateResult {
    originalWord: string,
    translatedWord: string,
    originalLang: string,
    translateLang: string
}

interface ITranslateParams {
    word: string,
    sourceLang: string,
    targetLang: string,
    translateMethod?: translateMethod
}

interface IFullTranslateObject {
    word: string,
    type: string
}

interface ICreateDictionary {
    id: string;
    originalWord: string;
    translatedWord: string;
    languageOriginal: string;
    languageTranslation: string;
}

type studyStageType = "NOT_STUDIED" | "BEING_STUDIED" | "STUDIED";

interface IUpdateStudyStage {
    id: string,
    studyStage: studyStageType
}

interface ILanguage {
    code: string,
    name: string,
    isoName: string
}

interface IDictionaryCard {
    originalWord: string,
    translatedWord: string,
    orginalLang: string,
    translationLang: string,
    dictionaryExamples: IDictionaryExample;
}

interface IExample {
    examples: any[]
    synonyms: any[]
    antonyms: any[]
}

interface ICreateDictionaryExample {
    dictionaryId: string;
    text: string;
    targetLanguageCode: string;
    type: string;
}

interface IGetDictionaryListParams {
    page: number,
    languageOriginal?: string | string[], 
    languageTranslation?: string | string[],
    studyStage?: studyStageType[] | [],
    searchByOriginal?: string,
    searchByTranslate?: string
}

interface IFilterDictionary {
    page: number,
    languageOriginal?: ILanguage[], 
    languageTranslation?: ILanguage[],
    studyStage?: studyStageType[],
    searchByOriginal?: string,
    searchByTranslate?: string
}

interface IError {
    statusCode: number,
    errorCode: string,
    message: string
}