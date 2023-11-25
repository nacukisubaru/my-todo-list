import { useEffect, useState } from "react";
import { useAppSelector } from "./useAppSelector";

export const useLangsSelector = () => {
    const { studyLangs, langsForStudy } = useAppSelector(
        (state) => state.dictionaryReducer.dictionarySettings
    );
    const [studyLangsSelector, setStudyLangsSelector] = useState<
        { name: string; id: string }[]
    >([]);
    const [langsForStudySelector, setLangsForStudySelector] = useState<
        { name: string; id: string }[]
    >([]);


    useEffect(() => {
        const data = studyLangs.map((item) => {
            return { id: item.code, name: item.isoName };
        });
        setStudyLangsSelector(data);
    }, [studyLangs]);

    useEffect(() => {
        const data = langsForStudy.map((item) => {
            return { id: item.code, name: item.isoName };
        });
        setLangsForStudySelector(data);
    }, [langsForStudy]);

    return {studyLangsSelector, langsForStudySelector}
};
