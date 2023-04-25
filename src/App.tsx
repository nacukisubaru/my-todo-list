import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from "./store/store";
import React from "react";
import WorkSpace from "./components/WorkSpace/WorkSpace";
import "./App.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <WorkSpace />,
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
