import { useState } from "react";
import { useActions } from "../../hooks/useActions";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useModal } from "../../hooks/useModal";
import { useSection } from "../../hooks/useSection";
import Modal from "../../ui/Modal/Modal";
import BurgerMenu from "../../ui/BurgerMenu/BurgerMenu";
import { ISection, ITodoItem } from "../../types/todo.types";

const SectionsMenu = () => {
    const { sections } = useAppSelector((state) => state.sectionsReducer);
    const { setSectionId, setCurrentProject } = useActions();
    const {
        setSectionEdit,
        setSortPosition,
        addSection,
        changeSection
    } = useSection();

    const { modalState, setModalState, closeModal } = useModal();
    const [action, setAction] = useState("create");
    const [sectionName, setNameSection] = useState("");

    const choiseSection = (item: ISection) => {
        setSectionId({ sectionId: item.id });
        setCurrentProject({project: item});
    };

    const openAddSection = (position: string, section: ITodoItem) => {
        setSectionEdit(section);
        setSortPosition(position);
        setModalState({
            title: "Добавить раздел",
            primaryBtnName: "Добавить",
            secondaryBtnName: "Отмена",
            isVisible: true,
        });
        setAction("create");
    };

    const openEditSection = async (section: ITodoItem) => {
        setNameSection(section.name);
        setSectionEdit(section);
        setModalState({
            title: "Изменить раздел",
            primaryBtnName: "Изменить",
            secondaryBtnName: "Отмена",
            isVisible: true,
        });
        setAction("change");
    };

    const openAddSubsection = (section: ITodoItem) => {
        setSectionEdit(section);
        setSortPosition("lower");
        setModalState({
            title: "Добавить подраздел",
            primaryBtnName: "Добавить",
            secondaryBtnName: "Отмена",
            isVisible: true,
        });
        setAction("createSubsection");
    }

    const applyActionSection = () => {
        switch (action) {
            case "create":
                addSection(sectionName);
            break;
            case "createSubsection":
                addSection(sectionName, true);
            break;
            case "change":
                changeSection([{ field: "name", value: sectionName }]);
            break;
        }
        setNameSection("");
        closeModal();
    };

    const closeEditSection = () => {
        closeModal();
        setNameSection("");
    }

    const toggleArrow = async (sectionId: string, isVisibleSections: boolean) => {
        changeSection([{ field: "showSections", value: isVisibleSections }], sectionId);
    }

    return (
        <>
            <Modal
                modalSettings={{ ...modalState }}
                callbacks={{
                    primaryBtnClick: applyActionSection,
                    secondaryBtnClick: closeEditSection,
                }}
            >
                <div>
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(target) => {
                            setNameSection(target.target.value);
                        }}
                        value={sectionName}
                    ></input>
                </div>
            </Modal>
            <BurgerMenu
                items={sections}
                setItem={choiseSection}
                menu={[
                    {
                        name: "Добавить раздел выше",
                        onClick: (item) => {
                            openAddSection("upper", item);
                        },
                    },
                    {
                        name: "Добавить раздел ниже",
                        onClick: (item) => {
                            openAddSection("lower", item);
                        },
                    },
                    {
                        name: "Изменить раздел",
                        onClick: (item) => { openEditSection(item); },
                    },
                    {
                        name: "Добавить подраздел",
                        onClick: (item) => { openAddSubsection(item); },
                    },
                ]}
                toggleArrow={toggleArrow}
            />
        </>
    );
};

export default SectionsMenu;
