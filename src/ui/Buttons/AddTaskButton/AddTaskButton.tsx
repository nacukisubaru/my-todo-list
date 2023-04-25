import { FC } from "react";

interface IAddTaskButton {
    onClick: () => void
}

const AddTaskButton: FC<IAddTaskButton> = ({onClick}) => {
    return (
        <>
            <button type="button" onClick={onClick}>
                <div className="diplay flex justify-center">
                    <svg className="mr-[12px]" width="13" height="13">
                        <path
                            d="M6 6V.5a.5.5 0 011 0V6h5.5a.5.5 0 110 1H7v5.5a.5.5 0 11-1 0V7H.5a.5.5 0 010-1H6z"
                            fill="currentColor"
                            fill-rule="evenodd"
                        ></path>
                    </svg>
                    <span className="-mt-[6px]">Добавить задачу</span>
                </div>
            </button>
        </>
    );
};

export default AddTaskButton;
