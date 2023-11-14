import { useNavigate } from "react-router-dom";
import SectionsMenu from "../../components/Sections/SectionsMenu";
import { useStartApp } from "../../hooks/useStartApp";
import { EnglishApp } from "../../modules/EnglishApp";
import BasicButton from "../../ui/Buttons/BasicButton/BasicButton";
import Header from "../../ui/Header/Header";
import SettingsIcon from "@mui/icons-material/Settings";
import { FC, useState } from "react";
import { Button } from "@mui/material";

interface EnglishAppSpaceProps {
    includeTrainer?: boolean;
    includeBook?: boolean;
}

const EnglishAppSpace: FC<EnglishAppSpaceProps> = ({
    includeTrainer = false,
    includeBook = false
}) => {
    const navigate = useNavigate();
    useStartApp();

    const navigateByEnglishApp = () => {
        if (includeTrainer) {
            navigate("/englishApp");
        } else {
            navigate("/englishApp/trainer");
        }
    };

    const [openModalSettings, setOpenModalSettings] = useState(false);
    const openSettings = () => {
        setOpenModalSettings(true);
    };

    const closeSettings = () => {
        setOpenModalSettings(false);
    };

    return (
        <>
            <SectionsMenu />
            {!includeBook && (
                <Header>
                    <div className="-mt-[4px] mr-[17px] flex">
                        <BasicButton
                            name={includeTrainer ? "Словарь" : "Тренажёр"}
                            color="secondary"
                            onClick={navigateByEnglishApp}
                        />
                        <Button variant="text" size="small" onClick={openSettings}>
                            <SettingsIcon style={{ color: "white" }} />
                        </Button>
                    </div>
                </Header>
            )}
            <EnglishApp
                includeTrainer={includeTrainer}
                includeBook={includeBook}
                openSettings={openModalSettings}
                closeSettings={closeSettings}
            ></EnglishApp>
        </>
    );
};

export default EnglishAppSpace;
