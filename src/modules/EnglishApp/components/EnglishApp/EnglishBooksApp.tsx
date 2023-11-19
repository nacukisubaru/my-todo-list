import { FC, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import BookReader from "../BookReader/BookReader";
import BookList from "../BookReader/BookList";

interface EnglishBooksAppProps {
    includeBook?: boolean
}

const EnglishBooksApp: FC<EnglishBooksAppProps> = ({
    includeBook = false,
}) => {  
    const {speak} = useSpeechSynthesis();
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
        </Provider>
    </>);
}

export default EnglishBooksApp;