import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import WorkSpace from "./pages/WorkSpace/WorkSpace";
import StartPage from "./pages/WorkSpace/StartPage";
import RegistrationPage from "./pages/Login/RegistrationPage";
import LoginPage from "./pages/Login/LoginPage";
import EnglishAppSpace from "./pages/WorkSpace/EnglishAppSpace";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material";

const router = createBrowserRouter([
    {
        path: "/",
        element: <StartPage />,
    },
    {
        path: "/app",
        element: <StartPage />,
    },
    {
        path: "/app/section/:sectionId",
        element: <WorkSpace />,
    },
    {
        path: "/app/section/:sectionId/task/:todoId",
        element: <WorkSpace />,
    },
    {
        path: "/app/registration",
        element: <RegistrationPage />,
    },
    {
        path: "/app/login",
        element: <LoginPage />,
    },
    {
        path: "/englishApp",
        element: <EnglishAppSpace />,
    },
    {
        path: "/englishApp/trainer",
        element: <EnglishAppSpace includeTrainer={true} headerBtn="Словарь" />,
    },
    {
        path: "/englishApp/books",
        element: (
            <EnglishAppSpace includeBooksList={true} headerBtn="Словарь" />
        ),
    },
    {
        path: "/englishApp/books/:id",
        element: <EnglishAppSpace includeBook={true} headerBtn="Словарь" />,
    },
]);

const theme = createTheme({
    palette: {
        primary: {
            main: "#009688",
        },
        text: {
            primary: "#000000",
            secondary: "#757575",
        },
    },
    components: {
      MuiIconButton: {
        defaultProps: {
            style: {outline: 'none'}
        }
      }
    }
});

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
    );
}

export default App;
