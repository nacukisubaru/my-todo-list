import { useEffect, useState } from "react";
import Card from "../../../../ui/Cards/Card";
import {
    getDictionaryByUser,
    getLanguages,
} from "../../store/services/dictionary/dictionary.slice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import SpeedDialButton from "../../../../ui/Buttons/SpeedDialButton";
import DictionaryAddWord from "./DictionaryAddWord";
import { useObserverScroll } from "../../../../hooks/useObserverScroll";
import DictionaryCard from "./DictionaryCard";
import FilterButton from "../../../../ui/Buttons/FilterButton";
import Filter from "../Filter/Filter";
import { useFilter } from "../../hooks/useFilter";
import SearchInput from "../../../../ui/Inputs/SearchInput";
import { useActions } from "../../hooks/useAction";
import useLocalStorageState from "use-local-storage-state";
import { setTitle } from "../../../../helpers/domHelper";

const DictionaryWords = () => {
    const { dictionary, status } = useAppSelector(
        (state) => state.dictionaryReducer
    );
    const { dictionaryActiveSettings, filterDictionary } = useAppSelector(
        (state) => state.dictionaryReducer
    );
    const { filtrate, setDictionaryFilter } = useFilter();
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
        linkedWords: [],
        studyStage: "NOT_STUDIED",
        notes: "",
        dictionaryLinkedWords: [],
    });
    const [isVisibleCard, setVisibleCard] = useState(false);

    const dispatch = useAppDispatch();
    const { resetDictionary } = useActions();
    const [filterStorage] = useLocalStorageState("filter", {
        defaultValue: [filterDictionary],
    });

    useEffect(() => {
        const actions = async () => {
            await dispatch(getLanguages());
        };
        actions();
        setDictionaryFilter(filterStorage[0]);
        setTitle("Словарь");
    }, []);

    useEffect(() => {
        if (dictionaryActiveSettings.sourceLanguage) {
            filtrate();
        }
    }, [dictionaryActiveSettings]);

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
    };

    const filterBySearchString = async (text: string) => {
        await resetDictionary();
        const res = await dispatch(
            getDictionaryByUser({
                page: 0,
                searchByOriginal: text,
                languageOriginal: filterDictionary.languageOriginal
                    ? filterDictionary.languageOriginal.map(
                          (lang: ILanguage) => lang.code
                      )
                    : [],
                languageTranslation: filterDictionary.languageTranslation
                    ? filterDictionary.languageTranslation.map(
                          (lang: ILanguage) => lang.code
                      )
                    : [],
            })
        );
        if (
            res.payload &&
            res.payload.statusCode &&
            res.payload.statusCode === 404
        ) {
            await resetDictionary();
            dispatch(
                getDictionaryByUser({
                    page: 0,
                    searchByTranslate: text,
                    languageOriginal: filterDictionary.languageOriginal
                        ? filterDictionary.languageOriginal.map(
                              (lang: ILanguage) => lang.code
                          )
                        : [],
                    languageTranslation: filterDictionary.languageTranslation
                        ? filterDictionary.languageTranslation.map(
                              (lang: ILanguage) => lang.code
                          )
                        : [],
                })
            );
        }
        // setDictionaryFilter({
        //     page: 0,
        //     // languageOriginal: [],
        //     // languageTranslation: [],
        //     studyStage: [],
        //     searchByOriginal: "",
        //     searchByTranslate: "",
        // });
    };

    const targetRef: any = useObserverScroll(fetchData, page, true);
    return (
        <>
            <div className="display flex justify-center mt-[10px]">
                <div className="mr-[7px]">
                    <SearchInput search={filterBySearchString}></SearchInput>
                </div>
                <div className="mt-[13px]">
                    <FilterButton
                        onClick={() => {
                            setVisibleFilter(true);
                        }}
                    ></FilterButton>
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
                    <div
                        className="-mt-[100px]"
                        id="reff"
                        ref={targetRef}
                    ></div>
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
