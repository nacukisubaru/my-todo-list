import { FC, useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { Button } from "@mui/material";
import Textarea from "../../../../ui/Inputs/Textarea";
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";
import { useDictionary } from "../../hooks/useDictionary";

interface IDictionaryNotesProps {
    notes: string;
    dictionaryId: string;
}

const DictionaryNotes: FC<IDictionaryNotesProps> = ({
    notes,
    dictionaryId,
}) => {
    const [isVisibleTextArea, setVisibleTextArea] = useState(false);
    const [textareaText, setTextareaText] = useState(notes);
    const [isVisibleSaveBtn, setVisibleSaveBtn] = useState(false);
    const [updNotes] = dictionaryApi.useUpdateNotesMutation();
    const { changeDictionaryWord } = useDictionary();

    const showTextArea = () => {
        setVisibleTextArea(true);
    };

    const changeText = (event: React.SyntheticEvent) => {
        const target: any = event.target;
        setTextareaText(target.value);
    };

    const save = () => {
        changeDictionaryWord("notes", textareaText, dictionaryId);
        updNotes({
            id: dictionaryId,
            notes: textareaText,
        });
        setVisibleSaveBtn(false);
    };

    useEffect(() => {
        if (textareaText !== notes) {
            setVisibleSaveBtn(true);
        }
    }, [textareaText]);

    return (
        <div className="mt-[10px]">
            {isVisibleTextArea ? (
                <>
                    <div className="flex">
                        <Textarea
                            placeholder="Напишите что-нибудь"
                            change={changeText}
                            defaultText={textareaText}
                        />
                    </div>
                    {isVisibleSaveBtn && (
                        <div className="flex justify-end mt-[5px]">
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
                <Button variant="contained" size="small" onClick={showTextArea}>
                    <CreateIcon />
                </Button>
            )}
        </div>
    );
};

export default DictionaryNotes;
