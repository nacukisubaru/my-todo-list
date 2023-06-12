import { useEffect, useState } from "react";
import Card from "../../../../ui/Cards/Card";
import { getDictionaryByUser } from "../../store/services/dictionary/dictionary.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import SpeedDialButton from "../../../../ui/Buttons/SpeedDialButton";
import DictionaryAddWord from "./DictionaryAddWord";
import { useObserverScroll } from "../../../../hooks/useObserverScroll";

const DictionaryWords = () => {
    const dictionary = useAppSelector(
        (state) => state.dictionaryReducer.dictionary
    );

    const page = useAppSelector(
        (state) => state.dictionaryReducer.page
    );

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getDictionaryByUser(0));
    }, []);

    const fetchData = () => {
        dispatch(getDictionaryByUser(page));
    }

    const [isVisibleAddWord, setVisibleAddWord] = useState(false);

    const openAddWord = () => {
        setVisibleAddWord(true);
    };

    const closeAddWord = () => {
        setVisibleAddWord(false);
    };

    const targetRef: any = useObserverScroll(fetchData, page, true);
    return (
        <>
            <div className="display flex justify-center">
                <div>
                    {dictionary &&
                        dictionary.map((word) => {
                            return (
                                <div className="my-[12px]">
                                    <Card width="w-[50vh]">
                                        <div>{word.originalWord}</div>
                                        <div>{word.translatedWord}</div>
                                    </Card>
                                </div>
                            );
                        })}
                        <div id="reff" ref={targetRef}></div>
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
