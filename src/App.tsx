import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";

import { Provider } from 'react-redux';
import { store } from "./store/store";
import TodoSections from "./components/TodoSections/TodoSections";

const router = createBrowserRouter([
    {
        path: "/",
        element: <TodoSections />,
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
