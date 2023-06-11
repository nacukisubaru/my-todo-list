import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import WorkSpace from "./pages/WorkSpace/WorkSpace";
import StartPage from "./pages/WorkSpace/StartPage";
import RegistrationPage from "./pages/Login/RegistrationPage";
import LoginPage from "./pages/Login/LoginPage";
import EnglishAppSpace from "./pages/WorkSpace/EnglishAppSpace";
import "./App.css";

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
        element: <EnglishAppSpace />
    }
]);
function App() {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

export default App;
