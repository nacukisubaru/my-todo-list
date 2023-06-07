import { FC } from "react";

interface ICheckBox {
    label?: string;
    checked?: boolean;
    strikethrough?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    checkCallback: (checked: boolean) => void;
}

const CheckBox: FC<ICheckBox> = ({
    label,
    checked = false,
    strikethrough = true,
    disabled = false,
    onClick,
    checkCallback,
}) => {
    const check = (isChecked: boolean) => {
        if (!disabled) {
            if (isChecked) {
                checkCallback(false);
            } else {
                checkCallback(true);
            }
        }
    };

    const clickLabel = () => {
        if (!disabled) {
            onClick && onClick();
        }
    };

    return (
        <>
            <div className="display inline-grid">
                {checked && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-[15px] h-[15px] absolute ml-[2px] mt-[2px] cursor-pointer text-white font-bold"
                        onClick={() => {
                            check(checked);
                        }}
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                        />
                    </svg>
                )}

                <input
                    className={`appearance-none w-[18px] h-[18px] rounded-xl border border-gray-950 border-solid cursor-pointer ${
                        checked ? "bg-gray-500" : ""
                    }`}
                    onClick={() => {
                        check(checked);
                    }}
                    type="checkbox"
                />
                {label && (
                    <div className="-mt-[21px] ml-[24px]">
                        <label
                            className={` cursor-pointer ${
                                checked && strikethrough && "line-through"
                            }`}
                            onClick={clickLabel}
                        >
                            {label}
                        </label>
                    </div>
                )}
            </div>
        </>
    );
};

export default CheckBox;
