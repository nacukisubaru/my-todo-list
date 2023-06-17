import { useNavigate } from "react-router-dom";
import SectionsMenu from "../../components/Sections/SectionsMenu";
import { useStartApp } from "../../hooks/useStartApp";
import { EnglishApp } from "../../modules/EnglishApp";
import BasicButton from "../../ui/Buttons/BasicButton/BasicButton";
import Header from "../../ui/Header/Header";
import { FC } from "react";

interface EnglishAppSpaceProps {
    includeTrainer?: boolean
}

const EnglishAppSpace: FC<EnglishAppSpaceProps> = ({includeTrainer = false}) => {
    const navigate = useNavigate();
    useStartApp();

    const navigateByEnglishApp = () => {
        if (includeTrainer) {
            navigate('/englishApp') 
        } else {
            navigate('/englishApp/trainer')
        }
    }

    return (
        <>
            <SectionsMenu />
            <Header>
                <div className="-mt-[4px] mr-[17px]">
                    <BasicButton
                        name={includeTrainer ? "Словарь": "Тренажёр"}
                        color="secondary"
                        onClick={navigateByEnglishApp}
                    />
                </div>
            </Header>
            <EnglishApp includeTrainer={includeTrainer}></EnglishApp>
        </>
    );
}

export default EnglishAppSpace;