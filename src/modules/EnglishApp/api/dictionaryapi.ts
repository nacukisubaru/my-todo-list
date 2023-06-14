import axios from "axios";

export const getExamplesByWord = async (word: string) => {
    const examples: any[] = [];
    let synonyms: any[] = [];
    let antonyms: any[] = [];

    let dictionaryExpamples;
    try {
       dictionaryExpamples = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    } catch (e) {}

    if (dictionaryExpamples && dictionaryExpamples.data && dictionaryExpamples.data.length) {
       if (dictionaryExpamples.data[0].meanings) {
        dictionaryExpamples.data[0].meanings.map((meaning: any) => {
            synonyms = synonyms.concat(meaning.synonyms);
            antonyms = antonyms.concat(meaning.antonyms);
            meaning.definitions.map((definition: any) => {
                if (definition.example) {
                    examples.push(definition.example);
                }
            })
        })
       }
    }
    
    return {examples, synonyms, antonyms};
}