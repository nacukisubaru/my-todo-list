import SectionsMenu from "../../components/Sections/SectionsMenu";
import { useStartApp } from "../../hooks/useStartApp";
import { EnglishApp } from "../../modules/EnglishApp";
import Header from "../../ui/Header/Header";

const EnglishAppSpace = () => {
    useStartApp();
    return (
        <>
            <SectionsMenu />
            <Header />
            <EnglishApp></EnglishApp>
        </>
    );
}

export default EnglishAppSpace;