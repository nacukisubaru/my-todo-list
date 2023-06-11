import { FC } from "react";
import DictionaryWords from "../DictionaryWords/DictionaryWords";
import { Provider } from "react-redux";
import { store } from "../../store/store";

const EnglishApp: FC = () => {

    return (<>
        <Provider store={store}>
            <DictionaryWords></DictionaryWords>
        </Provider>
    </>);
}

export default EnglishApp;
