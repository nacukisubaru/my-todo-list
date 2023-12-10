import { useNavigate } from "react-router-dom";
import SectionsMenu from "../../components/Sections/SectionsMenu";
import { useStartApp } from "../../hooks/useStartApp";
import { EnglishApp, EnglishBooksApp } from "../../modules/EnglishApp";
import BasicButton from "../../ui/Buttons/BasicButton/BasicButton";
import Header from "../../ui/Header/Header";
import SettingsIcon from "@mui/icons-material/Settings";
import { FC, useState } from "react";
import { Button } from "@mui/material";

interface EnglishAppSpaceProps {
    includeTrainer?: boolean;
    includeBook?: boolean;
    includeBooksList?: boolean;
    headerBtn?: string
}

const EnglishAppSpace: FC<EnglishAppSpaceProps> = ({
    includeTrainer = false,
    includeBook = false,
    includeBooksList,
    headerBtn
}) => {
    const navigate = useNavigate();
    useStartApp();

    const navigateByEnglishApp = () => {
        navigate("/englishApp");
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
                        {headerBtn && (
                            <BasicButton
                              name={headerBtn}
                              color="secondary"
                              onClick={navigateByEnglishApp}
                            />
                        )}
                        <Button
                            variant="text"
                            size="small"
                            onClick={openSettings}
                        >
                            <SettingsIcon style={{ color: "white" }} />
                        </Button>
                    </div>
                </Header>
            )}

            {includeBook ? (
                <EnglishBooksApp includeBook={true} />
            ) : (
                includeBooksList && <EnglishBooksApp includeBook={false} />
            )}

            {!includeBook && !includeBooksList && (
                <EnglishApp
                    includeTrainer={includeTrainer}
                    includeBook={includeBook}
                    openSettings={openModalSettings}
                    closeSettings={closeSettings}
                />
            )}
        </>
    );
};

export default EnglishAppSpace;
