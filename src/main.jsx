import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CharacterAnimationsProvider } from "./contexts/CharacterAnimations";
import "./index.css";
import { CameraControlProvider } from "./contexts/CameraControlContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CameraControlProvider>
      <CharacterAnimationsProvider>
        <App />
      </CharacterAnimationsProvider>
    </CameraControlProvider>
  </React.StrictMode>
);
