import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AllContextProvider from "./contexts/AllContextProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AllContextProvider>
      <App />
    </AllContextProvider>
  </React.StrictMode>
);
