import { FC, useEffect, useState } from "react";
import Modal from "../../../../ui/Modal/Modal";
import { Button } from "@mui/material";

interface IBookPages {
    countPages: number;
    isOpen: boolean;
    close: () => void;
    onClick: (page: number) => void;
}

const BookPages: FC<IBookPages> = ({ countPages = 0, isOpen, close, onClick }) => {
    const [pagesList, setPagesList] = useState<number[]>([]);

    useEffect(() => {
        if (countPages) {
            let page = 0;
            const pagesList = [];
            do {
                page++;
                pagesList.push(page);
            } while (page < countPages);

            setPagesList(pagesList);
        }
    }, [countPages]);

    return (
        <Modal
            modalSettings={{ title: 'Выбрать страницу', oppositeTitle: '', isVisible: isOpen, showButtons: false, showUpperButtons: true }}
            callbacks={{
                primaryBtnClick: () => {},
                secondaryBtnClick: close,
            }}
        >
            <div className="flex justify-around flex-wrap">
            {pagesList.length > 0 && pagesList.map((page) => {
                return <Button variant="contained" size="small" onClick={()=>{onClick(page)}} onTouchStart={()=>{onClick(page)}}>{page}</Button>;
            })}
            </div>
        </Modal>
    );
};

export default BookPages;
