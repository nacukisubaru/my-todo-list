import { IconButton } from "@mui/material";
import BookIcon from '@mui/icons-material/Book';
import ReplayIcon from '@mui/icons-material/Replay';
import { dictionaryApi } from "../../store/services/dictionary/dictionary.api";
import { FC, useState } from "react";
import StudyStageButton from "../../ui/Buttons/StudyStageButton";

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
                <StudyStageButton updateStudy={() => {updateStudy("STUDIED")}}>
                    <BookIcon />
                </StudyStageButton>
            )}

            {studyStageState === "STUDIED" && (
                 <StudyStageButton updateStudy={() => {updateStudy("BEING_STUDIED")}}>
                   <ReplayIcon />
                </StudyStageButton>
             )}
        </>
    );
}

export default BookWordStage;