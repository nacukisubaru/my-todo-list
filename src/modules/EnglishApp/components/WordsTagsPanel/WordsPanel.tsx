import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
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
    yandexTranslate?: () => void;
    setYandexData?: boolean;
    forBook?: boolean;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const WordsPanel: FC<IWordsPanel> = ({
    wordsList,
    tabs,
    setYandexData = false,
    forBook = false,
    selectTag,
    yandexTranslate = () => {},
}) => {
    const [value, setValue] = useState(0);
    const [words, setWords] = useState<IWordTag[]>([]);
    const [yandexTabValue, setYandexTabValue] = useState(0);
    const [isShowBtnTranslate, setShowBtnTranslate] = useState(false);

    const filterWords = (tab: string) => {
        const words = wordsList
            .filter((word) => word.type === tab)
            .map((word) => word);
        return words;
    };

    const handleChange = (newValue: number) => {
        setValue(newValue);
        const words = filterWords(tabs[newValue]);
        setWords(words);
    };
    
    useEffect(() => {
        const words = filterWords(tabs[value]);
        setWords(words);
    }, [wordsList]);

    useEffect(() => {
        if (!yandexTabValue) {
            let keyYandex = 0;
            tabs.map((tab, key) => {
                if (tab === "яндекс") {
                    keyYandex = key;
                }
            });

            if (keyYandex) {
                setYandexTabValue(keyYandex);
            }

            if (setYandexData) {
                setValue(keyYandex);
                const words = filterWords(tabs[keyYandex]);
                setWords(words);
            }
        }
    }, [tabs]);

    useEffect(() => {
        if (setYandexData) {
            setShowBtnTranslate(setYandexData);
        }
    }, [setYandexData]);

    return (
        <>
            <div className="mb-[15px]">
                <Tabs
                    value={value}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {tabs.map((typeWord, key) => {
                        return (
                            <Tab
                                label={typeWord}
                                style={{
                                    textTransform: "lowercase",
                                    outline: "none",
                                }}
                                onTouchStart={()=> {handleChange(key)}}
                                onClick={()=> {handleChange(key)}}
                            />
                        );
                    })}
                </Tabs>
            </div>

            {!isShowBtnTranslate && (
                <TabPanel value={value} index={yandexTabValue}>
                    <div className="flex justify-center">
                        <div className="lg:block hidden">
                            <Button
                                variant="contained"
                                size="small"
                                onClick={yandexTranslate}
                                onTouchStart={yandexTranslate}
                            >
                                Перевести
                            </Button>
                        </div>
                        <div className="lg:hidden block">
                            <Button
                                variant="contained"
                                size="small"
                                onClick={yandexTranslate}
                                onTouchStart={yandexTranslate}
                            >
                                Перевести
                            </Button>
                        </div>
                    </div>
                </TabPanel>
            )}

            <div className={`lg:h-[600px] ${forBook && 'lg:max-h-[600px]'} max-h-[100px] overflow-auto`}>
                {words.map((word) => {
                    if (word.word) {
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
                    }
                })}
            </div>
        </>
    );
};

export default WordsPanel;
