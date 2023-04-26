import { FC } from "react";
import ToolButton from "./ToolButton";

interface ICallbacks {
    clickEditBtn: () => void
}

interface IToolTaskPanelProps {
    callbacks: ICallbacks
}

const ToolTaskPanel: FC<IToolTaskPanelProps> = ({callbacks}) => {
    const {clickEditBtn} = callbacks;
    return (
        <div className="display flex">
            <ToolButton onClick={clickEditBtn}>
                <svg width="24" height="24">
                    <g fill="none" fillRule="evenodd">
                        <path
                            fill="currentColor"
                            d="M9.5 19h10a.5.5 0 110 1h-10a.5.5 0 110-1z"
                        ></path>
                        <path
                            stroke="currentColor"
                            d="M4.42 16.03a1.5 1.5 0 00-.43.9l-.22 2.02a.5.5 0 00.55.55l2.02-.21a1.5 1.5 0 00.9-.44L18.7 7.4a1.5 1.5 0 000-2.12l-.7-.7a1.5 1.5 0 00-2.13 0L4.42 16.02z"
                        ></path>
                    </g>
                </svg>
            </ToolButton>
            <ToolButton onClick={() => {}}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                </svg>
            </ToolButton>
        </div>
    );
};

export default ToolTaskPanel;