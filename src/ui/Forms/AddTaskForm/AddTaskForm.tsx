import { FC, useRef } from "react";
import BasicButton from "../../Buttons/BasicButton/BasicButton";
interface IInputsSettings {
    inputPlaceHolder: string,
    textPlaceHolder: string
}

interface IButtonsSettings {
    primaryButtonName: string,
    secondaryButtonName: string,
    secondaryButtonClick: () => void
    primaryButtonClick: () => void
}

interface IAddTaskForm {
    buttonsSettings: IButtonsSettings,
    inputSettings: IInputsSettings
}

const AddTaskForm: FC<IAddTaskForm> = ({buttonsSettings, inputSettings}) => {
   

    const {primaryButtonName, secondaryButtonName, secondaryButtonClick, primaryButtonClick} = buttonsSettings
    const {inputPlaceHolder, textPlaceHolder} = inputSettings;

    const name:any = useRef();
    const description:any = useRef();

    const sendForm = () => {
        primaryButtonClick
    }

    return (
        <div className="border-solid border-2 border-indigo-600 rounded-xl h-auto">
            <div className="display grid px-[7px] py-[7px] mb-[18px]">
                <input type="text" ref={name} className="hover:outline-none hover:outline-offset-0 active:outline-none active:outline-offset-0 focus:outline-none focus:outline-offset-0" placeholder={inputPlaceHolder}/>
                <textarea ref={description} className="resize-none h-[70px] hover:outline-none hover:outline-offset-0 active:outline-none active:outline-offset-0 focus:outline-none focus:outline-offset-0" placeholder={textPlaceHolder}></textarea>
            </div>
            <div className="display flex justify-end mx-[7px] my-[7px]">
                <span className="mr-[8px]">
                    <BasicButton name={secondaryButtonName} color="secondary" onClick={secondaryButtonClick}/>
                </span>
                <BasicButton name={primaryButtonName} color="primary" onClick={sendForm}/>
            </div>
        </div>
    );
};

export default AddTaskForm;
