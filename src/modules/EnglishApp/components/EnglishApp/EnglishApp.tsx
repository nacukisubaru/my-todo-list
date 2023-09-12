import { FC, useEffect } from "react";
import DictionaryWords from "../DictionaryWords/DictionaryWords";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import Trainer from "../TrainerWords/Trainer";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import Settings from "../Settings/Settings";

interface EnglishAppProps {
    includeTrainer?: boolean,
    openSettings: boolean,
    closeSettings: () => void
}

const EnglishApp: FC<EnglishAppProps> = ({
    includeTrainer = false,
    openSettings,
    closeSettings
}) => {
    const {speak} = useSpeechSynthesis();
    useEffect(() => {
        speak('test', 'en-GB', true);
    }, []);
   
    return (<>
        <Provider store={store}>
            {includeTrainer ? (
                <Trainer></Trainer>
            ): (
                <>
                    <DictionaryWords></DictionaryWords>
                    {openSettings && (
                        <Settings close={closeSettings}></Settings>
                    )}
                </>
            )}
        </Provider>
    </>);
}

export default EnglishApp;
