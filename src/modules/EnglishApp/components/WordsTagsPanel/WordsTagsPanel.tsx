import { FC, useEffect, useState } from "react";
import { uniqueList } from "../../../../helpers/arrayHelper";
import { useAppSelector } from "../../hooks/useAppSelector";
import WordsPanel from "./WordsPanel";
import { Box, Button, CircularProgress } from "@mui/material";
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";
import { useActions } from "../../hooks/useAction";
import { generateCryptId } from "../../../../helpers/stringHelper";

interface IWordsTagsPanel {
    selectTag?: (word: string) => void;
    saveTagsCallback?: (tags: IFullTranslateObject[]) => void;
    saveTags?: boolean;
    saveBtnName?: string;
    lang?: string;
    forBook?: boolean;
}

const WordsTagsPanel: FC<IWordsTagsPanel> = ({
    selectTag,
    saveTagsCallback,
    saveTags = false,
    lang,
    forBook = false,
}) => {
    const { fullTranslateList } = useAppSelector(
        (state) => state.dictionaryReducer
    );

    const [createLinkedWords] = dictionaryApi.useCreateLinkedWordMutation();
    const [createWord] = dictionaryApi.useAddMutation();
    const [dictionaryId, setDictionaryId] = useState<string>("");
    const [isVisibleSaveBtn, setVisibleSaveBtn] = useState<boolean>(false);

    const { setFullTranslateList } = useActions();
    const save = async () => {
        if (fullTranslateList.length) {
            const translateList = fullTranslateList.filter(
                (item) => item.type !== "transcription" && item.isActive
            );
            const translateItem = translateList[0];
            const transcriptionObj = fullTranslateList.find(
                (item) => item.type === "transcription"
            );

            let dictionaryWordId = translateItem.dictionaryWordId;
            if (dictionaryId) {
                dictionaryWordId = dictionaryId;
            }

            const addWordToDictionary = async (
                translateItem: IFullTranslateObject
            ) => {
                if (!dictionaryWordId) {
                    const obj: any = {
                        originalWord: translateItem.word,
                        translatedWord: translateItem.originalWord,
                        languageOriginal: "ru",
                        languageTranslation: lang,
                        studyStage: "BEING_STUDIED",
                        id: "",
                        dictionaryExamples: [],
                        transcription: transcriptionObj
                            ? transcriptionObj.word
                            : "",
                        dictionaryLinkedWords: [],
                        linkedWords: [],
                        notes: "",
                    };

                    obj.id = generateCryptId(obj);
                    dictionaryWordId = obj.id;
                    setDictionaryId(dictionaryWordId);
                    createWord(obj);
                }
            };

            await addWordToDictionary(translateItem);

            createLinkedWords({
                dictionaryId: dictionaryWordId,
                words: translateList.map((item) => item.word),
            });

            saveTagsCallback && saveTagsCallback(translateList);
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

    useEffect(() => {
        if (fullTranslateList.length) {
            const id = fullTranslateList[0].dictionaryWordId;
            if (id) {
                setDictionaryId(id);
            }

            const activeTags = fullTranslateList.filter(
                (item) => item.isActive
            );
            if (activeTags.length) {
                setVisibleSaveBtn(true);
            } else {
                setVisibleSaveBtn(false);
            }
        } else {
            setDictionaryId("");
            setVisibleSaveBtn(false);
        }
    }, [fullTranslateList]);

    return (
        <>
            {fullTranslateList.length ? (
                <>
                    <div className="mb-[20px]">
                        <WordsPanel
                            wordsList={fullTranslateList}
                            selectTag={activateTag}
                            tabs={uniqueList(
                                fullTranslateList
                                    .map((word) => word.type)
                                    .filter((type) => type !== "transcription")
                            )}
                        />
                    </div>
                    {saveTags && (
                        <div className="flex justify-end">
                            <Button
                                variant="contained"
                                size="small"
                                onClick={save}
                                disabled={!isVisibleSaveBtn}
                            >
                                {!forBook
                                    ? "Сохранить"
                                    : dictionaryId
                                    ? "Сохранить"
                                    : "Добавить в словарь"}
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
