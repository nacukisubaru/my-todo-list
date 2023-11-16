import { FC } from "react";
import { uniqueList } from "../../../../helpers/arrayHelper";
import { useAppSelector } from "../../hooks/useAppSelector";
import WordsPanel from "./WordsPanel";
import { Box, Button, CircularProgress } from "@mui/material";
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";
import { useActions } from "../../hooks/useAction";

interface IWordsTagsPanel {
    selectTag?: (word: string) => void;
    saveTagsCallback?: (tags: IFullTranslateObject[]) => void;
    saveTags?: boolean;
    checkWords?: boolean;
    renderByTabs?: boolean;
}

const WordsTagsPanel: FC<IWordsTagsPanel> = ({
    selectTag,
    saveTagsCallback,
    saveTags = false,
    checkWords = true,
    renderByTabs = false,
}) => {
    const { fullTranslateList } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const [createLinkedWords] = dictionaryApi.useCreateLinkedWordMutation();

    const { setFullTranslateList } = useActions();
    const save = () => {
        if (fullTranslateList.length && fullTranslateList[0].dictionaryWordId) {
            const activeTags = fullTranslateList.filter(
                (item) => item.isActive
            );
            createLinkedWords({
                dictionaryId: fullTranslateList[0].dictionaryWordId,
                words: activeTags.map((item) => item.word),
            });

            saveTagsCallback && saveTagsCallback(activeTags);
        }
    };

    const activateTag = (word: string, isActive: boolean) => {
        const list: IFullTranslateObject[] = [];
        if (!isActive) {
            isActive = true;
        } else {
            isActive = false;
        }

        fullTranslateList.map((item) => {
            if (item.word == word) {
                list.push({ ...item, isActive });
            } else {
                list.push(item);
            }
        });

        selectTag && selectTag(word);
        setFullTranslateList(list);
    };

    return (
        <>
            {fullTranslateList.length ? (
                <>
                    <div className="mb-[20px]">
                        <WordsPanel
                            wordsList={fullTranslateList}
                            selectTag={activateTag}
                            tabs={uniqueList(
                                fullTranslateList.map((word) => word.type)
                            )}
                            renderByTabs={renderByTabs}
                        />
                    </div>
                    {saveTags && (
                        <div className="flex justify-end">
                            <Button
                                variant="contained"
                                size="small"
                                onClick={save}
                            >
                                Сохранить
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}
        </>
    );
};

export default WordsTagsPanel;
