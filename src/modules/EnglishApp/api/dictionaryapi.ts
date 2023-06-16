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

    const cambridgeExamples = await getCambrigeExamples(word);
    return examples.concat(cambridgeExamples);
}

const getCambrigeExamples = async (word: string) => {
    const cambridgeExamples = [];
    const result = await fetch(`https://api.codetabs.com/v1/proxy?quest=https://dictionary.cambridge.org/dictionary/english/${word}`);
    const textResult = await result.text();
 
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(textResult, 'text/html');
    let exampleContents = parsedDoc.getElementsByClassName('deg');
    for (let contentInc in exampleContents) {
        if (exampleContents[contentInc].innerHTML) {
            const example = exampleContents[contentInc].innerHTML.replace(/<\/?[^>]+(>|$)/g, "").trim();
            const exampleObj = {originalText: example, translatedText: '', exampleType: 'example', showTranslate: false}
            cambridgeExamples.push(exampleObj);
        }
   }

   return cambridgeExamples;
}