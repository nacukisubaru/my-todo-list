import { Box, IconButton, Slider } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
    convertSecoundsToTimeString,
    convertTimeStringToSeconds,
} from "../../../../helpers/dateTimeHelper";
import { useActions } from "../../hooks/useAction";
import { useAppSelector } from "../../hooks/useAppSelector";
import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
interface IProgress {
    loaded: number;
    loadedSeconds: number;
    played: number;
    playedSeconds: number;
}

interface IYoutubeVideoReader {
    videoId: string;
    width?: number;
    timecodes: string[];
    timecodesByString: ITimecodeByString[];
    canSeekVideoByTimecodes: boolean;
    onProgressVideo: (action: string) => void;
    onSeek: (timecode: string) => void;
}

const YoutubeVideoReader: FC<IYoutubeVideoReader> = ({
    videoId,
    width = 600,
    timecodes = [],
    timecodesByString,
    canSeekVideoByTimecodes = false,
    onProgressVideo,
    onSeek
}) => {
    const ref: any = useRef(0);
    const [maxDuration, setMaxDuration] = useState(0);
    const [currentDuration, setCurrentDuration] = useState(0);
    const [isPlaying, setPlay] = useState(false);
    const [isSlide, setSlide] = useState(true);
    const [isInitPlayer, setInitPlayer] = useState(false);
    const [prevTimecodesStrings, setPrevTimecodesStrings] = useState<ITimecodeByString[]>([]);

    const { setSwitchBackBookPage } = useActions();
    const { switchBackBookPage } = useAppSelector(state => state.bookReaderReducer);

    const getTextByTimecode = (timecode: string) => {

        const toHighlightString = (timecodeStrings: ITimecodeByString[], action: string = "add") => {
            timecodeStrings.map((timecode) => {
                const findedSpanIds = timecode.spanIds;
                if (findedSpanIds) {
                    
                    const span = document.getElementById(findedSpanIds);
                    if (span) {
                        if (action === "add") {
                            span.classList.add("highlight");
                        } else if (action === "remove") {
                            span.classList.remove("highlight");
                        }
                    }
                }
            })
        }

        const timecodeStrings = timecodesByString.filter((item) => item.timecode === timecode);
        if (timecodeStrings.length) {
            
            if (prevTimecodesStrings.length) {
                toHighlightString(prevTimecodesStrings, "remove");
            }

            setPrevTimecodesStrings(timecodeStrings);
            toHighlightString(timecodeStrings, "add");

            let timecodeString = timecodeStrings[1];
            if (!timecodeString) {
                timecodeString = timecodeStrings[0];
            }
       
            const span = document.getElementById(timecodeString.spanIds);
            if (span) {
                span.scrollIntoView({ behavior: "smooth", block: 'start'});
            }
        }
    }

    const seek = (event: any) => {
        const target: any = event.target;
        ref.current.seekTo(target.value);
        const timecode = convertSecoundsToTimeString(target.value);
        getTextByTimecode(timecode)
        setPlay(true);
        onSeek(timecode);
    };

    const onProgress = (state: IProgress) => {
        if (isInitPlayer) {
            if (timecodes.length) {
                const lastTimeCode = convertTimeStringToSeconds(timecodes[timecodes.length - 1]);
                const timecode = convertSecoundsToTimeString(state.playedSeconds);
                getTextByTimecode(timecode)
                console.log({sec: Math.round(state.playedSeconds), lastTimeCode})
                if (Math.round(state.playedSeconds) === lastTimeCode && !switchBackBookPage) {                   
                    onProgressVideo("next");
                } else {
                    setSwitchBackBookPage({ isBack: false });
                }
            }
        
            setCurrentDuration(state.playedSeconds);
        } 
    };

    const onPlay = () => {
        if (!isInitPlayer) {
            const duration = ref.current.getDuration();
            setMaxDuration(duration);
            setPlay(true);
            setInitPlayer(true);
            ref.current.seekTo(convertTimeStringToSeconds(timecodes[0]));
        }
    };

    const sliderTimeFormat = (time: number) => {
        return convertSecoundsToTimeString(time);
    };

    useEffect(() => {
        if (isSlide || canSeekVideoByTimecodes) {
            ref.current.seekTo(convertTimeStringToSeconds(timecodes[0]));
            setPlay(true);
            setSlide(false);
            getTextByTimecode(timecodes[0]);
        }
    }, [timecodes, canSeekVideoByTimecodes]);

    const addClassForFrame = () => {
        const elements = document.getElementsByTagName("iframe");
        if (elements.length) {
            elements[0].classList.add("iframe-youtube");
        }
    }

    const rewindBack = async () => {
        const duration = currentDuration - 10;
        const timecode = convertSecoundsToTimeString(duration);
        ref.current.seekTo(duration)
        getTextByTimecode(timecode)
        setCurrentDuration(duration);
        if (duration < convertTimeStringToSeconds(timecodes[0]) ) {
            onSeek(timecode);
        }
    }

    const rewindForward = async() => {
        const lastTimeCode = convertTimeStringToSeconds(timecodes[timecodes.length - 1]);       
        const duration = currentDuration + 10;
        const timecode = convertSecoundsToTimeString(duration);
        ref.current.seekTo(duration)
        getTextByTimecode(timecode)
        setCurrentDuration(duration);
        if (duration >= lastTimeCode ) {
            onSeek(timecode);
        }
    }

    return (
        <>
            <Box>   
                <ReactPlayer
                    url={videoId + '?controls=1'}
                    ref={ref}
                    width={width}
                    height={"unset"}
                    onPlay={onPlay}
                    onProgress={onProgress}
                    playing={isPlaying}
                    onReady={addClassForFrame}
                />

                <div className="flex">
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
               
                    <IconButton size="small" onClick={rewindBack} onTouchStart={rewindBack}>
                        <Replay10Icon />
                    </IconButton>
                   
                    <IconButton size="small" onClick={rewindForward} onTouchStart={rewindForward}>
                        <Forward10Icon />
                    </IconButton>
                </div>
            </Box>
        </>
    );
};

export default YoutubeVideoReader;
