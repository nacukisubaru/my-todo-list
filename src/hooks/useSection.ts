import { useState } from "react";
import { useTaskTree } from "./useTaskTree";
import { sectionsApi } from "../store/services/sections/sections.api";
import { IMutateList } from "../types/ui.types";

export const useSection = () => {
    const [updSection] = sectionsApi.useUpdateMutation();
    const [currentSection, setCurrentSection] = useState(
        {
            id: "",
            name: "",
            sort: 0
        }
    );

    const [sortPosition, setSortPosition] = useState("");

    const { createSection, mutateTask } = useTaskTree();

    const setSectionEdit = (section: any) => {
        setCurrentSection(section);
    }

    const addSection = (name: string, isAnkiSection: boolean = false, subsection: boolean = false) => {
        createSection({
            sectionId: currentSection.id, 
            editFields: {name, isAnkiSection}, 
            sortByPosition: { sortPosition: currentSection.sort, position: sortPosition },
            subsection
        });
    }

    const changeSection = async (mutateList: IMutateList[], sectionId?: string) => {
        if (!sectionId) {
            sectionId = currentSection.id;
        }
        const section = await mutateTask(sectionId, mutateList, true);
        if (section) {
            const {id, name, showSections} = section;
            updSection({id, name, showSections});
        }
    }

    return {
        setCurrentSection,
        setSectionEdit,
        addSection,
        setSortPosition,
        changeSection,
        currentSection,
    }
}