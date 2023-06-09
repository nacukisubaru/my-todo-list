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

interface IDictionarySettings {
    targetLanguage: string
}

interface ITranslateResult {
    originalWord: string,
    translatedWord: string,
    textLang: string
}

interface ITranslateParams {
    word: string,
    targetLang: string
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
    studyStage?: studyStageType[] | [],
    searchByOriginal?: string,
    searchByTranslate?: string
}