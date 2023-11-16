import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import WordsTagsPanel from "../WordsTagsPanel/WordsTagsPanel";

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
}));

const WordsWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
}));

interface IBookDrawer {
    isOpen: boolean;
    headerBody?: any;
    className?: string;
    width: number;
}

const BookDrawer: FC<IBookDrawer> = ({
    isOpen,
    headerBody,
    className = "",
    width = 320,
}) => {
  
    return (
        <Drawer
            sx={{
                width: width,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: width,
                },
            }}
            variant="persistent"
            anchor="right"
            open={isOpen}
            className={className}
        >
            <DrawerHeader>{headerBody && headerBody}</DrawerHeader>
            <WordsWrapper>
                <WordsTagsPanel
                    renderByTabs={isOpen}
                />
            </WordsWrapper>
        </Drawer>
    );
};

export default BookDrawer;
