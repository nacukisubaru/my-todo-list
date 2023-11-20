import { FC, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import BookReader from "../BookReader/BookReader";
import BookList from "../BookReader/BookList";
import Settings from "../Settings/Settings";

interface EnglishBooksAppProps {
    includeBook?: boolean
}

const EnglishBooksApp: FC<EnglishBooksAppProps> = ({
    includeBook = false,
}) => {  
    const {speak} = useSpeechSynthesis();
    const [openModalSettings, setOpenModalSettings] = useState(false);
    useEffect(() => {
        speak('test', 'en-GB', true);
    }, []);
   
    return (<>
        <Provider store={store}>
            {includeBook ? (
                <BookReader />
            ): (
                <BookList />
            )}
            <Settings close={()=>{setOpenModalSettings(false)}} isOpen={openModalSettings}></Settings>
        </Provider>
    </>);
}

export default EnglishBooksApp;