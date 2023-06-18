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
import Filter from "../Filter/Filter";
import { useFilter } from "../../hooks/useFilter";
import SearchInput from "../../../../ui/Inputs/SearchInput";
import { useActions } from "../../hooks/useAction";

const DictionaryWords = () => {
    const {dictionary, status} = useAppSelector(
        (state) => state.dictionaryReducer
    );
    const {filtrate, setDictionaryFilter} = useFilter();
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
        studyStage: "NOT_STUDIED"
    });
    const [isVisibleCard, setVisibleCard] = useState(false);

    const dispatch = useDispatch();
    const {resetDictionary} = useActions();

    useEffect(() => {
        filtrate();
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

    const filterBySearchString = async (text: string) => {
        await resetDictionary();
        const res = await dispatch(getDictionaryByUser({ 
            page: 0,
            searchByOriginal: text,
        }));
        if (res.payload && res.payload.statusCode && res.payload.statusCode === 404) {
            await resetDictionary();
            dispatch(getDictionaryByUser({ 
                page: 0,
                searchByTranslate: text
            }));
        }
        setDictionaryFilter({
            page: 0,
            languageOriginal: [],
            languageTranslation: [],
            studyStage: [],
            searchByOriginal: '',
            searchByTranslate: ''
        });
    }

    const targetRef: any = useObserverScroll(fetchData, page, true);
    return (
        <>
        
            <div className="display flex justify-center mt-[10px]">
                <div className="mr-[7px]">
                    <SearchInput search={filterBySearchString}></SearchInput>
                </div>
                <div className="mt-[13px]">
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
