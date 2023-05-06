import { useState } from "react";
import { useTaskTree } from "./useTaskTree";

export const useSection = () => {
    const [currentSection, setCurrentSection] = useState(
        {
            id: "",
            sort: 0
        }
    );
    const [sortPosition, setSortPosition] = useState("");

    const { createSection } = useTaskTree();

    const setSectionEdit = (section: any) => {
        setCurrentSection(section);
    }

    const addSection = (name: string) => {
        createSection(currentSection.id, name, { sortPosition: currentSection.sort, position: sortPosition });
    }

    return {
        setCurrentSection,
        setSectionEdit,
        addSection,
        setSortPosition,
        currentSection,
    }
}