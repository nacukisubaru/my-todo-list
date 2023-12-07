import { IconButton } from "@mui/material";
import BookIcon from '@mui/icons-material/Book';
import ReplayIcon from '@mui/icons-material/Replay';
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";
import { FC, useState } from "react";

interface IBookWordStage {
    wordId: string
    studyStage: studyStageType
}

const BookWordStage: FC<IBookWordStage> = ({wordId, studyStage}) => {

    const [updStudyStage] = dictionaryApi.useUpdateSudyStageMutation();
    const [studyStageState, setStudyStage] = useState<studyStageType>(studyStage);
    
    const updateStudy = (stage: studyStageType) => {
        setStudyStage(stage);
        updStudyStage({
            studyStage: stage,
            id: wordId
        })
    }

    return (
        <>
            {studyStageState === "BEING_STUDIED" && (            
                <IconButton onClick={() => {updateStudy("STUDIED")}}>
                    <BookIcon />
                </IconButton>
            )}

            {studyStageState === "STUDIED" && (   
                <IconButton onClick={() => {updateStudy("BEING_STUDIED")}}>
                    <ReplayIcon />
                </IconButton>
             )}
        </>
    );
}

export default BookWordStage;