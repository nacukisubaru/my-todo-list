import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getSections } from "../../store/services/sections/sections.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useActions } from "../../hooks/useActions";
import { todoApi } from "../../store/services/todo/todo.api";
import { useSection } from "../../hooks/useSection";
import { useModal } from "../../hooks/useModal";
import BurgerMenu from "../../ui/BurgerMenu/BurgerMenu";
import TodoSectionsList from "../TodoSections/TodoSectionsList";
import Modal from "../../ui/Modal/Modal";


const WorkSpace = () => {
    const { sections } = useAppSelector((state) => state.sectionsReducer);
    const { setSectionId } = useActions();
    const dispatch = useDispatch();
    const updPositions = todoApi.useUpdTodosPositionsQuery({});
    const { setSectionEdit, setSortPosition, addSection } = useSection();
    const { modalState, setModalState, closeModal } = useModal();
    const [sectionName, setNameSection] = useState("");

    useEffect(() => {
        const get = async () => {
            await updPositions.refetch();
            await dispatch(getSections());
        };
        get();
        
    }, []);

    const choiseSection = (id: string) => {
        setSectionId({ sectionId: id });
    };

    const openAddProject = () => {
        setModalState({
            title: "Добавить проект",
            primaryBtnName: "Добавить",
            secondaryBtnName: "Отмена",
            isVisible: true,
        });
    };

    const openEditProject = () => {
        setModalState({
            title: "Изменить проект",
            primaryBtnName: "Изменить",
            secondaryBtnName: "Отмена",
            isVisible: true,
        });
    };

    return (
        <>
            <Modal
                modalSettings={{ ...modalState }}
                callbacks={{
                    primaryBtnClick: () => {
                        addSection(sectionName);
                    },
                    secondaryBtnClick: closeModal,
                }}
            >
                <div>
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(target) => {setNameSection(target.target.value)}}
                        value={sectionName}
                    ></input>
                </div>
            </Modal>
            <BurgerMenu
                items={sections}
                setId={choiseSection}
                menu={[
                    {
                        name: "Добавить раздел выше",
                        onClick: () => {
                            openAddProject();
                            setSortPosition("upper");
                        },
                    },
                    {
                        name: "Добавить раздел ниже",
                        onClick: () => { 
                            openAddProject();
                            setSortPosition("lower");
                        }
                    },
                    {
                        name: "Изменить раздел",
                        onClick: openEditProject,
                    },
                ]}
                toolCallback={setSectionEdit}
            />
            <TodoSectionsList />
        </>
    );
};

export default WorkSpace;
