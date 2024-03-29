type translateMethod = "translateApi" | "yandex";
interface IDictionary {
    id: string;
    originalWord: string;
    translatedWord: string;
    languageOriginal: string;
    languageTranslation: string;
    dictionaryExamples: IDictionaryExample[];
    dictionaryLinkedWords: IDictionaryLinkedWord[];
    linkedWords: string[];
    studyStage: studyStageType;
    transcription?: string;
    notes: string;
}

interface IDictionaryExample {
    originalText: string,
    translatedText: string,
    exampleType?: string,
    showTranslate?: boolean
}

interface IDictionaryLinkedWord {
    id?: number,
    word: string,
}

interface ILinkedWords {
    id?: number,
    word: string,
    type: string
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
    translateLang: string,
    wordsList?: ILinkedWords[],
    transcription?: string
}

interface ITranslateParams {
    word: string,
    sourceLang: string,
    targetLang: string,
    translateMethod?: translateMethod,
    getTranscription?: boolean,
    getYandexTranslate?: boolean
}

interface IExampleParams {
    word: string,
    sourceLang: string,
    targetLang: string,
    pageSize: number
}

interface IFullTranslateObject {
    word: string,
    type: string,
    isActive: boolean,
    dictionaryWordId: string,
    studyStage: studyStageType,
    originalWord: string
}

interface ILingvoExample {
    originalText: string,
    translatedText: string
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

interface IUpdateNotes {
    id: string,
    notes: string
}

interface IUpdateWord {
    id: string,
    originalWord: string
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

interface ICreateLinkedWord {
    dictionaryId: string;
    words: string[]
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

interface ITranslateSettings {
    id?:number,
    lingvo: boolean
    wordHunt: boolean
}

interface IError {
    statusCode: number,
    errorCode: string,
    message: string
}