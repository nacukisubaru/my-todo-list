import { FC } from "react";
import PlayButton from "../../../../ui/Buttons/PlayButton";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";

interface IDictionaryExamplesProps {
    examplesList: string[];
}

const DictionaryExamples: FC<IDictionaryExamplesProps> = ({ examplesList }) => {
    const { speak } = useSpeechSynthesis();
    
    return (
        <>
            {examplesList &&
                examplesList.map((synonim) => {
                    return (
                        <div className="display flex justify-between">
                            <div>{synonim}</div>
                            <div className="display flex">
                                <span className="font-bold">uk</span>
                                <PlayButton
                                    onClick={() => {
                                        speak(synonim, "en-GB");
                                    }}
                                />
                                <span className="font-bold">us</span>
                                <PlayButton
                                    onClick={() => {
                                        speak(synonim, "en-US");
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
        </>
    );
};

export default DictionaryExamples;
