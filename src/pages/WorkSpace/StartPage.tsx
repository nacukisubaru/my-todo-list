import SectionsMenu from "../../components/Sections/SectionsMenu";
import Header from "../../ui/Header/Header";
import { useStartApp } from "../../hooks/useStartApp";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const StartPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/app');
    }, []);

    useStartApp();
    return (
        <>
            <SectionsMenu />
            <Header />
        </>
    );
};

export default StartPage;
