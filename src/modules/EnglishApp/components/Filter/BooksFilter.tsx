import { FC } from "react";
import Modal from "../../../../ui/Modal/Modal";
import DictionaryLanguages from "../DictionaryWords/DictionaryLanguages";
import CheckBoxDefault from "../../../../ui/CheckBox/CheckBoxDefault";
import BasicButton from "../../../../ui/Buttons/BasicButton/BasicButton";
import { useFilter } from "../../hooks/useFilter";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useFilterBooks } from "../../hooks/useFilterBooks";
import { Box } from "@mui/material";
import BasicSelect from "../../../../ui/Selects/BasicSelect";
import { useLangsSelector } from "../../hooks/useLangsSelector";

interface IFilterProps {
    isVisible: boolean;
    close: () => void;
}

const BooksFilter: FC<IFilterProps> = ({ isVisible, close }) => {
    const { booksFilter, setBooksFilter, filtrate } = useFilterBooks();
    const {studyLangsSelector} = useLangsSelector();

    return (
        <>
            {isVisible && (
                <Modal
                    modalSettings={{
                        title: "Фильтр",
                        primaryBtnName: "",
                        secondaryBtnName: "",
                        showButtons: false,
                        isVisible: true,
                        showUpperButtons: true,
                    }}
                    callbacks={{
                        primaryBtnClick: () => {},
                        secondaryBtnClick: close,
                    }}
                    maxWidth="sm:max-w-[32rem]"
                >
                    <Box sx={{ marginBottom: "10px" }}>
                    <BasicSelect
                        options={studyLangsSelector}
                        label="Выбрать язык книги"
                        onChange={(value) => {
                            setBooksFilter({
                                ...booksFilter,
                                langOriginal: value
                            });
                        }}
                        selectedOption={booksFilter.langOriginal ? booksFilter.langOriginal : 'en'}
                    />
                    </Box>
                    <CheckBoxDefault
                        label="Только книги"
                        onChange={(isChecked) => {
                            setBooksFilter({
                                ...booksFilter,
                                booksOnly: isChecked,
                                videoOnly: false
                            });
                        }}
                        checked={booksFilter.booksOnly}
                    />

                    <CheckBoxDefault
                        label="Только видео"
                        onChange={(isChecked) => {
                            setBooksFilter({
                                ...booksFilter,
                                videoOnly: isChecked,
                                booksOnly: false
                            });
                        }}
                        checked={booksFilter.videoOnly}
                    />

                    <CheckBoxDefault
                        label="Только читаемые"
                        onChange={(isChecked) => {
                            setBooksFilter({
                                ...booksFilter,
                                readOnly: isChecked,
                            });
                        }}
                        checked={booksFilter.readOnly}
                    />

                    <div className="display flex justify-end">
                        <BasicButton
                            name="Применить"
                            color="primary"
                            onClick={() => {
                                filtrate();
                            }}
                        />
                    </div>
                </Modal>
            )}
        </>
    );
};

export default BooksFilter;
