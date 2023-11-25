import { FC, useState } from "react";
import Modal from "../../../../ui/Modal/Modal";
import { Box, TextField } from "@mui/material";
import InputFileUpload from "../../../../ui/Upload/InputFileUpload";
import { bookReaderApi } from "../../store/services/book-reader/book-reader.api";
import { useForm } from "react-hook-form";
import BasicSelect from "../../../../ui/Selects/BasicSelect";
import { useFilterBooks } from "../../hooks/useFilterBooks";
import { useLangsSelector } from "../../hooks/useLangsSelector";

interface IAddBook {
    isOpen: boolean;
    close: () => void;
}

const AddBook: FC<IAddBook> = ({ isOpen, close }) => {
    const [addBook] = bookReaderApi.useCreateBookMutation();
    const [currentFile, setFile] = useState("");
    const { register, getValues, reset } = useForm();
    const {langsForStudySelector, studyLangsSelector} = useLangsSelector();
    const [bookLang, setBookLang] = useState("en");
    const [translateLang, setTranslateLang] = useState("ru");
    const {filtrate} = useFilterBooks();

    const createBook = async () => {
        if (currentFile) {
            const name = getValues("name");
            const url = getValues("url");

            const formData: any = new FormData();
            formData.append("file", currentFile);
            formData.append("name", name);
            formData.append("langOriginal", bookLang);
            formData.append("langTranslation", translateLang);
            if (url) {
                formData.append("videoUrl", url);
                formData.append("isVideo", "true");
            } else {
                formData.append("isVideo", "false");
            }

            await addBook(formData);
            filtrate(1, false);
            resetData();
        }
    };

    const resetData = () => {
        setFile("");
        reset();
        setBookLang("en");
        setTranslateLang("ru");
    }

    const uploadFile = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
        }
    };

    const changeBookLang = (value: string) => {
        setBookLang(value);
    };

    const changeTranslationLang = (value: string) => {
        setTranslateLang(value);
    };

    const closeForm = () => {
        close();
        resetData();
    }


    return (
        <>
            <Modal
                modalSettings={{
                    title: "Добавить книгу",
                    primaryBtnName: "Создать",
                    secondaryBtnName: "Отмена",
                    isVisible: isOpen,
                }}
                maxWidth="sm:max-w-[32rem]"
                callbacks={{
                    primaryBtnClick: createBook,
                    secondaryBtnClick: closeForm,
                }}
            >
                <Box sx={{ marginBottom: "10px" }}>
                    <TextField
                        label="Название книги"
                        {...register("name")}
                        fullWidth
                    />
                </Box>
                <Box sx={{ marginBottom: "10px" }}>
                    <TextField
                        label="Ссылка на видео"
                        {...register("url")}
                        fullWidth
                    />
                </Box>
                <Box sx={{ marginBottom: "10px" }}>
                    <BasicSelect
                        options={studyLangsSelector}
                        label="Выбрать язык книги"
                        onChange={changeBookLang}
                        selectedOption={bookLang}
                    />
                </Box>
                <Box sx={{ marginBottom: "10px" }}>
                    <BasicSelect
                        options={langsForStudySelector}
                        label="Выбрать язык перевода"
                        onChange={changeTranslationLang}
                        selectedOption={translateLang}
                    />
                </Box>
                <Box sx={{ marginBottom: "10px" }}>
                    <a href="https://downsub.com/" target="_blank">Скачать субтитры</a>
                </Box>
                <InputFileUpload onChange={uploadFile} />
            </Modal>
        </>
    );
};

export default AddBook;
