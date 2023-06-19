import { FC, useEffect } from "react";
import DictionaryWords from "../DictionaryWords/DictionaryWords";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import Trainer from "../TrainerWords/Trainer";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";

interface EnglishAppProps {
    includeTrainer?: boolean
}

const EnglishApp: FC<EnglishAppProps> = ({
    includeTrainer = false
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
                <DictionaryWords></DictionaryWords>
            )}
        </Provider>
    </>);
}

export default EnglishApp;
