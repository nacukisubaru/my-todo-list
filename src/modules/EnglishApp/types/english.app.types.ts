interface IDictionary {
    id: string;
    originalWord: string;
    translatedWord: string;
    languageOriginal: string;
    languageTranslation: string;
    isStudy: boolean;
}

interface ITranslateResult {
    originalWord: string,
    translatedWord: string
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