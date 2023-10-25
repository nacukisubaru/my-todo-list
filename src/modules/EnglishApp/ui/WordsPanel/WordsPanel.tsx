import { Tab, Tabs } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { uniqueList } from "../../../../helpers/arrayHelper";
import WordTag from "./WordTag";

interface IWordsPanel {
    wordsList: IFullTranslateObject[]
}

const WordsPanel: FC<IWordsPanel> = ({wordsList}) => {
    const [value, setValue] = useState(0);
    const [typeWord, setTypeWord] = useState(wordsList[0].type);
    const [words, setWords] = useState<string[]>([]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    useEffect(() => {
       const words = wordsList.filter((word) => word.type === typeWord).map(word => word.word);
       setWords(words);
    }, [typeWord]);

    return (
      <>
            <div className="mb-[15px]">
                <Tabs value={value} onChange={handleChange} centered>
                    {uniqueList(wordsList.map(word => word.type)).map(typeWord => {
                        return <Tab label={typeWord} onClick={() => {setTypeWord(typeWord)}} style={{textTransform: 'lowercase', outline: "none"}}/>
                    })}
                </Tabs>
            </div>
            
            {words.map(word => {
                return <span className="mr-[5px]"><WordTag>{word}</WordTag></span>;
            })}
       </>
    );
};

export default WordsPanel;
