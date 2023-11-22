import { Box, Slider } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
    convertSecoundsToTimeString,
    convertTimeStringToSeconds,
} from "../../../../helpers/dateTimeHelper";

interface IProgress {
    loaded: number;
    loadedSeconds: number;
    played: number;
    playedSeconds: number;
}

interface IYoutubeVideoReader {
    videoId: string;
    width?: number;
    timecode: string;
    timecodes: string[];
    timecodesByString: ITimecodeByString[];
    onProgressVideo: () => void;
    onSeek: (timecode: string) => void;
}

const YoutubeVideoReader: FC<IYoutubeVideoReader> = ({
    videoId,
    width = 600,
    timecodes = [],
    timecodesByString,
    onProgressVideo,
    onSeek
}) => {
    const ref: any = useRef(0);
    const [maxDuration, setMaxDuration] = useState(0);
    const [currentDuration, setCurrentDuration] = useState(0);
    const [isPlaying, setPlay] = useState(false);
    const [isSlide, setSlide] = useState(false);

    const getTextByTimecode = (timecode: string) => {
        const timecodeString = timecodesByString.filter((item) => item.timecode === timecode);
        if (timecodeString[0]) {
            const findedText = timecodeString[0].text;
            console.log({findedText});
        }
    }

    const seek = (event: any) => {
        const target: any = event.target;
        
        ref.current.seekTo(target.value);
        const timecode = convertSecoundsToTimeString(target.value);
        getTextByTimecode(target.value)
        setPlay(true);
        onSeek(timecode);
        setSlide(true);
    };

    const onProgress = (state: IProgress) => {
        if (timecodes.length) {
            const lastTimeCode = timecodes[timecodes.length - 1];
            const timecode = convertSecoundsToTimeString(state.playedSeconds);
            getTextByTimecode(timecode)
            if (
                convertSecoundsToTimeString(state.playedSeconds) ===
                lastTimeCode
            ) {
                onProgressVideo();
                setSlide(false);
            }
        }
        setCurrentDuration(state.playedSeconds);
    };

    const onPlay = () => {
        const duration = ref.current.getDuration();
        setMaxDuration(duration);
    };

    const sliderTimeFormat = (time: number) => {
        return convertSecoundsToTimeString(time);
    };

    useEffect(() => {
        if (!isSlide) {
            ref.current.seekTo(convertTimeStringToSeconds(timecodes[0]));
            setPlay(true);
            setSlide(false);
        }
    }, [timecodes]);


    return (
        <>
            <Box>
                <ReactPlayer
                    url={videoId + '?autoplay=1'}
                    ref={ref}
                    width={width}
                    height={"400px"}
                    onPlay={onPlay}
                    onProgress={onProgress}
                    playing={isPlaying}
                />

                <Slider
                    disabled={false}
                    marks={false}
                    max={maxDuration}
                    min={0}
                    value={currentDuration}
                    valueLabelFormat={sliderTimeFormat}
                    onChange={seek}
                    size="medium"
                    valueLabelDisplay="on"
                />
            </Box>
        </>
    );
};

export default YoutubeVideoReader;
