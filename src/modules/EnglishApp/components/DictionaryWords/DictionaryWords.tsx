import { useEffect, useState } from "react";
import Card from "../../../../ui/Cards/Card";
import { getDictionaryByUser } from "../../store/services/dictionary/dictionary.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import SpeedDialButton from "../../../../ui/Buttons/SpeedDialButton";
import DictionaryAddWord from "./DictionaryAddWord";

const DictionaryWords = () => {
    const dictionary = useAppSelector(
        (state) => state.dictionaryReducer.dictionary
    );

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getDictionaryByUser(0));
    }, []);

    const [isVisibleAddWord, setVisibleAddWord] = useState(false);

    const openAddWord = () => {
        setVisibleAddWord(true);
    };

    const closeAddWord = () => {
        setVisibleAddWord(false);
    };

    return (
        <>
            <div className="display flex justify-center">
                <div>
                    {dictionary &&
                        dictionary.map((word) => {
                            return (
                                <Card width="w-[165vh]">
                                    <div>{word.originalWord}</div>
                                    <div>{word.translatedWord}</div>
                                </Card>
                            );
                        })}
                </div>
            </div>

            <DictionaryAddWord
                isVisible={isVisibleAddWord}
                closeAddWord={closeAddWord}
            />
            <SpeedDialButton onClick={openAddWord} />
        </>
    );
};

export default DictionaryWords;
