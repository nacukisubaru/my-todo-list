import { styled } from "@mui/material";
import Pagination, { PaginationProps } from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { FC } from "react";

interface IPaginationButtonsProps {
    count: number;
    colorNumbers: string;
    onClick: (page: number) => void;
}

interface MyPaginationProps extends PaginationProps {
    colorNumbers: string
}

const MyPagination = styled(Pagination)<MyPaginationProps>(({colorNumbers = "white"}) => ({
    ul: {
        "& .MuiPaginationItem-root": {
            color: colorNumbers,
        },
    },
}));

const PaginationButtons: FC<IPaginationButtonsProps> = ({ count, colorNumbers, onClick }) => {
    return (
        <Stack spacing={2}>
            <MyPagination 
                count={count}
                colorNumbers={colorNumbers} 
                onChange={(_, value) => {onClick(value)}}
                siblingCount={0}
            />
        </Stack>
    );
};

export default PaginationButtons;
