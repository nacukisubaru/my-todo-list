import { FC } from "react";
import SimplePaper from "../../../../ui/Paper/SimplePaper";

interface IBookList {}

const BookList: FC<IBookList> = () => {
    return (
        <>
            <div className="flex justify-center mt-[65px]">
                <SimplePaper width={700} height={1000} >
                    
                </SimplePaper>
            </div>
        </>
    );
}

export default BookList;