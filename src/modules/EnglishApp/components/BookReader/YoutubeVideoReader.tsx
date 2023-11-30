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
    onProgressVideo: (action: string) => void;
    onSeek: (timecode: string) => void;
}

const YoutubeVideoReader: FC<IYoutubeVideoReader> = ({
    videoId,
    width = 600,
    timecodes = [],
    timecodesByString,
    onProgressVideo,
    onSeek,
}) => {
    const ref: any = useRef(0);
    const [maxDuration, setMaxDuration] = useState(0);
    const [currentDuration, setCurrentDuration] = useState(0);
    const [isPlaying, setPlay] = useState(false);
    const [isSlide, setSlide] = useState(true);
    const [isInitPlayer, setInitPlayer] = useState(false);
    const [prevTimecodesStrings, setPrevTimecodesStrings] = useState<ITimecodeByString[]>([]);
    const [currentActiveSubtitle, setCurrentActiveSubtitle] = useState("");

    const {setCanUpdateBookPage} = useActions();
    const {canUpdateBookPage, switchBackBookPage} = useAppSelector(state => state.bookReaderReducer);

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

            if (timecodeString.spanIds !== currentActiveSubtitle) {
                setCurrentActiveSubtitle(timecodeString.spanIds);
                const span = document.getElementById(timecodeString.spanIds);
                if (span) {
                   span.scrollIntoView({ behavior: "smooth", block: 'start'});
                }
            }
        }
    }

    const seek = (event: any) => {
        const target: any = event.target;
        ref.current.seekTo(target.value);
        const timecode = convertSecoundsToTimeString(target.value);
        setCanUpdateBookPage({update: false});
        getTextByTimecode(timecode)
        setPlay(true);
        onSeek(timecode);
    };

    const onProgress = (state: IProgress) => {
        if (timecodes.length) {
            const lastTimeCode = convertTimeStringToSeconds(timecodes[timecodes.length - 1]);
            const timecode = convertSecoundsToTimeString(state.playedSeconds);
            getTextByTimecode(timecode)

            if (state.playedSeconds > lastTimeCode && !switchBackBookPage) {
                onProgressVideo("next");
            }
        }
     
        setCurrentDuration(state.playedSeconds);
        
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
        if (isSlide || canUpdateBookPage) {
            console.log('sdf')
            ref.current.seekTo(convertTimeStringToSeconds(timecodes[0]));
            setPlay(true);
            setSlide(false);
            //setCanUpdateBookPage({update: true})
            getTextByTimecode(timecodes[0]);
        }
    }, [timecodes, canUpdateBookPage]);


    const addClassForFrame = () => {
        const elements = document.getElementsByTagName("iframe");
        if (elements.length) {
            elements[0].classList.add("iframe-youtube");
        }
    }

    const rewindBack = () => {
        const duration = currentDuration - 10;
        if (duration < convertTimeStringToSeconds(timecodes[0]) ) {
            onProgressVideo("prev");
        }
        ref.current.seekTo(duration)
        const timecode = convertSecoundsToTimeString(duration);
        getTextByTimecode(timecode)
        setCurrentDuration(duration);
    }

    const rewindForward = () => {
        const lastTimeCode = convertTimeStringToSeconds(timecodes[timecodes.length - 1]);
        const duration = currentDuration + 10;
        if (duration >= lastTimeCode ) {
            onProgressVideo("next");
        }
        ref.current.seekTo(duration)
        const timecode = convertSecoundsToTimeString(duration);
        getTextByTimecode(timecode)
        setCurrentDuration(duration); 
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
