import { useEffect, useState } from "react";
import Card from "../../../../ui/Cards/Card";
import {
    getDictionaryByUser,
    getDictionarySettings,
    getLanguages,
} from "../../store/services/dictionary/dictionary.slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import SpeedDialButton from "../../../../ui/Buttons/SpeedDialButton";
import DictionaryAddWord from "./DictionaryAddWord";
import { useObserverScroll } from "../../../../hooks/useObserverScroll";
import DictionaryCard from "./DictionaryCard";

const DictionaryWords = () => {
    const dictionary = useAppSelector(
        (state) => state.dictionaryReducer.dictionary
    );

    const page = useAppSelector((state) => state.dictionaryReducer.page);

    const [isVisibleAddWord, setVisibleAddWord] = useState(false);

    const [dictionaryCard, setDictionaryCard] = useState<IDictionary>({
        id: "",
        originalWord: "",
        translatedWord: "",
        languageOriginal: "",
        languageTranslation: "",
        dictionaryExamples: [], 
        isStudy: false
    });
    const [isVisibleCard, setVisibleCard] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getDictionaryByUser({page: 0}));
    }, []);

    useEffect(() => {
        dispatch(getDictionarySettings());
        dispatch(getLanguages());
    }, []);

    const fetchData = () => {
        dispatch(getDictionaryByUser({page}));
    };

    const openAddWord = () => {
        setVisibleAddWord(true);
    };

    const closeAddWord = () => {
        setVisibleAddWord(false);
    };

    const showDictionaryCard = (id: string) => {
        const words = dictionary.filter((word) => {
            if (word.id === id) {
                return word;
            }
        });
        if (words.length) {
            const word = words[0];
            setDictionaryCard({...word});
        }
        setVisibleCard(true);
    };

    const targetRef: any = useObserverScroll(fetchData, page, true);
    return (
        <>
            <div className="display flex justify-center">
                <div>
                    {dictionary &&
                        dictionary.map((word) => {
                            return (
                                <div
                                    className="my-[12px]"
                                    onClick={() => {
                                        showDictionaryCard(word.id);
                                    }}
                                >
                                    <Card width="w-[50vh]">
                                        <div className="display flex justify-between">
                                            <div>
                                                <div>{word.originalWord}</div>
                                                <div>{word.translatedWord}</div>
                                            </div>

                                            <div>
                                                {word.languageOriginal}&#8594;
                                                {word.languageTranslation}
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                    <div className="mt-[50px]" id="reff" ref={targetRef}></div>
                </div>
            </div>

            <DictionaryAddWord
                isVisible={isVisibleAddWord}
                closeAddWord={closeAddWord}
            />

            {isVisibleCard && (
                <DictionaryCard
                    props={dictionaryCard}
                    closeCard={() => {
                        setVisibleCard(false);
                    }}
                />
            )}

            <SpeedDialButton onClick={openAddWord} />
        </>
    );
};

export default DictionaryWords;
