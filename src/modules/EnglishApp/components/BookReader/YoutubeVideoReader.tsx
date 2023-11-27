import { Box, Slider } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
    convertSecoundsToTimeString,
    convertTimeStringToSeconds,
} from "../../../../helpers/dateTimeHelper";
import { useActions } from "../../hooks/useAction";
import { useAppSelector } from "../../hooks/useAppSelector";

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
    onProgressVideo: () => void;
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

    const {setCanUpdateBookPage} = useActions();
    const {canUpdateBookPage} = useAppSelector(state => state.bookReaderReducer);

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
        setCanUpdateBookPage({update: false})
        getTextByTimecode(timecode)
        setPlay(true);
        onSeek(timecode);
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
            ref.current.seekTo(convertTimeStringToSeconds(timecodes[0]));
            setPlay(true);
            setSlide(false);
            getTextByTimecode(timecodes[0])
        }
    }, [timecodes, canUpdateBookPage]);


    return (
        <>
            <Box>
                <ReactPlayer
                    url={videoId + '?autoplay=1'}
                    ref={ref}
                    width={width}
                    height={"500px"}
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
