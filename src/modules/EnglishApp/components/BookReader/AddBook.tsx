import { FC } from "react";
import Modal from "../../../../ui/Modal/Modal";

interface IAddBook {
    isOpen: boolean;
    close: () => void
}

const AddBook: FC<IAddBook> = ({ isOpen, close }) => {

    const createBook = () => {

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
                    secondaryBtnClick: close,
                }}
            >sdf</Modal>
        </>
    );
};

export default AddBook;
