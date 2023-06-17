import { FC } from "react";
import DictionaryWords from "../DictionaryWords/DictionaryWords";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import Trainer from "../TrainerWords/Trainer";

interface EnglishAppProps {
    includeTrainer?: boolean
}

const EnglishApp: FC<EnglishAppProps> = ({
    includeTrainer = false
}) => {

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
