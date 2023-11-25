import { FC, useEffect } from "react";
import DictionaryWords from "../DictionaryWords/DictionaryWords";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import Trainer from "../TrainerWords/Trainer";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import Settings from "../Settings/Settings";
import BookReader from "../BookReader/BookReader";
interface EnglishAppProps {
    includeTrainer?: boolean,
    includeBook?: boolean,
    openSettings: boolean,
    closeSettings: () => void
}

const EnglishApp: FC<EnglishAppProps> = ({
    includeTrainer = false,
    includeBook = false,
    openSettings,
    closeSettings
}) => {  
    const {speak} = useSpeechSynthesis();
    useEffect(() => {
        speak('test', 'en-GB', true);
    }, []);
   
    return (<>
        <Provider store={store}>
            {includeTrainer && (
                <Trainer></Trainer>
            )}

            {includeBook && (
                <BookReader />
            )}

            {!includeBook && !includeTrainer && (
                <DictionaryWords />
            )}
            
            <Settings close={closeSettings} isOpen={openSettings}></Settings>
        </Provider>
    </>);
}

export default EnglishApp;
