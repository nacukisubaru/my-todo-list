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
import FilterButton from "../../../../ui/Buttons/FilterButton";
import SpeedDialButton2 from "../../../../ui/Buttons/SpeedDialButton";
import Filter from "../Filter/Filter";
import { useFilter } from "../../hooks/useFilter";

const DictionaryWords = () => {
    const {dictionary, status, filterDictionary} = useAppSelector(
        (state) => state.dictionaryReducer
    );
    const {filtrate} = useFilter();

    const page = useAppSelector((state) => state.dictionaryReducer.page);

    const [isVisibleAddWord, setVisibleAddWord] = useState(false);
    const [filterIsVisible, setVisibleFilter] = useState(false);

    const [dictionaryCard, setDictionaryCard] = useState<IDictionary>({
        id: "",
        originalWord: "",
        translatedWord: "",
        languageOriginal: "",
        languageTranslation: "",
        dictionaryExamples: [],
        isStudy: false,
    });
    const [isVisibleCard, setVisibleCard] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getDictionaryByUser({ page: 0 }));
    }, []);

    useEffect(() => {
        dispatch(getDictionarySettings());
        dispatch(getLanguages());
    }, []);

    const fetchData = () => {
        if (status !== "loading") {
            filtrate(page, false);
        }
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
            setDictionaryCard({ ...word });
        }
        setVisibleCard(true);
    };

    const closeFilter = () => {
        setVisibleFilter(false);
    }

    const targetRef: any = useObserverScroll(fetchData, page, true);
    return (
        <>
            <div className="display flex justify-center mt-[10px]">
                <div className="mr-[7px] w-[30vh] ml-[20px]">
                    <input
                        id="trainerInput"
                        name="trainerInput"
                        type="text"
                        onChange={(e) => {}}
                        className="col-sm block w-full px-[11px] rounded-md border-0 py-1.5 
                    text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                    focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-[12px]"
                    />
                </div>
                <div>
                    <FilterButton onClick={() => {setVisibleFilter(true)}}></FilterButton>
                </div>
            </div>
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

            <Filter isVisible={filterIsVisible} close={closeFilter}></Filter>
            <SpeedDialButton onClick={openAddWord} />
        </>
    );
};

export default DictionaryWords;
