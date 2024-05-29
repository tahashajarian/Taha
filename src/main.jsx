import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CharacterAnimationsProvider } from "./contexts/CharacterAnimations";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CharacterAnimationsProvider>
      <App />
    </CharacterAnimationsProvider>
  </React.StrictMode>
);
