import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import store from "./redux/app/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer autoClose={3000} />
      <App />
    </Provider>
  </React.StrictMode>
);
