interface IDictionary {
    id: string;
    originalWord: string;
    translatedWord: string;
    languageOriginal: string;
    languageTranslation: string;
    isStudy: boolean;
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

interface ILanguage {
    code: string,
    name: string,
    isoName: string
}

interface IDictionaryCard {
    originalWord: string,
    translatedWord: string,
    orginalLang: string,
    translationLang: string
}

interface IExample {
    examples: any[]
    synonyms: any[]
    antonyms: any[]
}