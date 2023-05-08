import { useState } from "react"
import { IModalSettings } from "../types/ui.types";

export const useModal = () => {
    const [modalState, setModalState] = useState<IModalSettings>({
        title: "",
        primaryBtnName: "",
        secondaryBtnName: "",
        isVisible: false
    });

    const openModal = () => {
        setModalState({...modalState, isVisible: true});
    }

    const closeModal = () => {
        setModalState({...modalState, isVisible: false});
    }

    return {
        modalState,
        openModal,
        setModalState,
        closeModal
    }
}