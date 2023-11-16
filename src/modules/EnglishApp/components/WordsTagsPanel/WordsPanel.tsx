import { Tab, Tabs } from "@mui/material";
import { FC, useEffect, useState } from "react";
import WordTag from "./WordTag";

interface IWordTag {
    word: string;
    type: string;
    isActive?: boolean;
}

interface IWordsPanel {
    wordsList: IWordTag[];
    tabs: string[];
    selectTag?: (word: string, isRemove: boolean) => void;
    renderByTabs?: boolean
}

const WordsPanel: FC<IWordsPanel> = ({
    wordsList,
    tabs,
    selectTag,
}) => {
    const [value, setValue] = useState(0);
    const [words, setWords] = useState<IWordTag[]>([]);

    const filterWords = (tab: string) => {
        const words = wordsList
            .filter((word) => word.type === tab)
            .map((word) => word);
        return words;
    };

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        const words = filterWords(tabs[newValue]);
        setWords(words);
    };

   
    useEffect(() => {
        const words = filterWords(tabs[value]);
        setWords(words);
    }, [wordsList]);

    return (
        <>
            <div className="mb-[15px]">
                <Tabs
                    value={value}
                    variant="scrollable"
                    scrollButtons="auto"
                    onChange={handleChange}
                >
                    {tabs.map((typeWord) => {
                        return (
                            <Tab
                                label={typeWord}
                                style={{
                                    textTransform: "lowercase",
                                    outline: "none",
                                }}
                            />
                        );
                    })}
                </Tabs>
            </div>

            {words.map((word) => {
                return (
                    <span className="mr-[5px]">
                        <WordTag
                            onClick={selectTag}
                            isActive={word.isActive}
                        >
                            {word.word}
                        </WordTag>
                    </span>
                );
            })}
        </>
    );
};

export default WordsPanel;
