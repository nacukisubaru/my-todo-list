import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import WordsPanel from "../../ui/WordsPanel/WordsPanel";
import { FC, useEffect, useState } from "react";

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
    translateList: IFullTranslateObject[];
    existTranslatedList?: string[];
}

const BookDrawer: FC<IBookDrawer> = ({
    translateList,
    isOpen,
    headerBody,
    className = "",
    width = 320,
    existTranslatedList
}) => {
    // const [existTranslates, setExistTranslates] = useState();
    // useEffect(() => {
    //     setExistTranslates(existTranslatedList);
    // },[])

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
            {translateList.length > 0 ? (
                <WordsWrapper>
                    <WordsPanel
                        wordsList={translateList.map((translate) => {
                            // if (existTranslates && existTranslates.length && existTranslates.includes(translate.word)) {
                            //     return {...translate, isActive: true}
                            // }
                            return { ...translate, isActive: false };
                        })}
                    />
                </WordsWrapper>
            ) : (<WordsWrapper>Перевод не найден</WordsWrapper>)}
        </Drawer>
    );
};

export default BookDrawer;
