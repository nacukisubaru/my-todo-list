import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from "./store/store";
import React from "react";
import WorkSpace from "./pages/WorkSpace/WorkSpace";
import StartPage from "./pages/WorkSpace/StartPage";
import "./App.css";
import RegistrationPage from "./pages/Login/RegistrationPage";
import LoginPage from "./pages/Login/LoginPage";

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
]);
function App() {
    return (
      <Provider store={store}>
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
        </Provider>
    );
}

export default App;
