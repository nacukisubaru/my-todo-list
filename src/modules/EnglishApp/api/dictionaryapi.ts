import axios from "axios";

export const getExamplesByWord = async (word: string) => {
    const examples: IDictionaryExample[] = [];

    let dictionaryExpamples;
    try {
       dictionaryExpamples = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    } catch (e) {}

    if (dictionaryExpamples && dictionaryExpamples.data && dictionaryExpamples.data.length) {
       if (dictionaryExpamples.data[0].meanings) {
        dictionaryExpamples.data[0].meanings.map((meaning: any) => {

            meaning.synonyms.map((synonym: any) => {
                examples.push({originalText: synonym, translatedText: '', exampleType: 'synonym', showTranslate: false});
            });

            meaning.antonyms.map((antonym: any) => {
                examples.push({originalText: antonym, translatedText: '', exampleType: 'antonym', showTranslate: false});
            });

            meaning.definitions.map((definition: any) => {
                if (definition.example) {  
                    examples.push({originalText: definition.example, translatedText: '', exampleType: 'example', showTranslate: false});
                }
            })
        })
       }
    }
    
    return examples;
}