import { FC } from "react";
import { IconButton, Toolbar, Typography } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface IBookToolBar {
    setPrevPage: () => void;
    openPages: () => void;
    setNextPage: () => void;
    updateRead: (isRead: boolean) => void;
    updateBookMarker: () => void;
    currentPage: number;
    bookmarker?: any;
    isRead: boolean;
}

const BookToolBar: FC<IBookToolBar> = ({
    setNextPage,
    setPrevPage,
    openPages,
    updateRead,
    updateBookMarker,
    currentPage,
    bookmarker,
    isRead,
}) => {
    return (
        <>
            <div className="flex justify-between">
                <Toolbar>
                    <div className="lg:block hidden">
                        <IconButton
                            onClick={setPrevPage}
                            sx={{ color: "white" }}
                        >
                            <ArrowBackIosNewIcon />
                        </IconButton>
                    </div>

                    <div className="lg:hidden block">
                        <IconButton
                            onTouchStart={setPrevPage}
                            sx={{ color: "white" }}
                        >
                            <ArrowBackIosNewIcon />
                        </IconButton>
                    </div>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        onClick={openPages}
                        onTouchStart={openPages}
                        className="cursor-pointer"
                    >
                        {currentPage}
                    </Typography>
                    <div className="lg:block hidden">
                        <IconButton
                            onClick={setNextPage}
                            sx={{ color: "white" }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </div>

                    <div className="lg:hidden block">
                        <IconButton
                            onTouchStart={setNextPage}
                            sx={{ color: "white" }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </div>
                </Toolbar>
                <Toolbar>
                    <div className="mr-[10px]">
                        {bookmarker && bookmarker == currentPage ? (
                            <div className="cursor-pointer">
                                <BookmarkIcon />
                            </div>
                        ) : (
                            <>
                                <div
                                    className="cursor-pointer lg:block hidden"
                                    onClick={updateBookMarker}
                                >
                                    <BookmarkBorderIcon />
                                </div>
                                <div
                                    className="cursor-pointer lg:hidden block"
                                    onTouchStart={updateBookMarker}
                                >
                                    <BookmarkBorderIcon />
                                </div>
                            </>
                        )}
                    </div>

                    {isRead ? (
                        <>
                            <div
                                className="cursor-pointer lg:block hidden"
                                onClick={() => {
                                    updateRead(false);
                                }}
                            >
                                <StarIcon />
                            </div>

                            <div
                                className="cursor-pointer lg:hidden block"
                                onTouchStart={() => {
                                    updateRead(false);
                                }}
                            >
                                <StarIcon />
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="cursor-pointer lg:block hidden"
                                onClick={() => {
                                    updateRead(true);
                                }}
                            >
                                <StarBorderIcon />
                            </div>

                            <div
                                className="cursor-pointer lg:hidden block"
                                onTouchStart={() => {
                                    updateRead(true);
                                }}
                            >
                                <StarBorderIcon />
                            </div>
                        </>
                        
                    )}
                </Toolbar>
            </div>
        </>
    );
};

export default BookToolBar;
