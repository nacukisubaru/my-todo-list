import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { FC } from "react";

interface ISimplePaper {
    width: number,
    height: number,
    children: any
}

const SimplePaper: FC<ISimplePaper> = ({width, height, children}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                    m: 1,
                    width,
                    height,
                },
            }}
        >
            <Paper elevation={3} >
                <Box sx={{
                  paddingLeft: '50px',
                  paddingRight: '50px',
                  paddingTop: '50px',
                  paddingBottom: '50px',
                }}>
                    {children}
                </Box>
            </Paper>
        </Box>
    );
};

export default SimplePaper;