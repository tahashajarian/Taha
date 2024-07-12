import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CharacterAnimationsProvider } from "./contexts/CharacterAnimations";
import "./index.css";
import { CameraControlProvider } from "./contexts/CameraControlContext";
import { ModalControlProvider } from "./contexts/ModalControlContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalControlProvider>
      <CameraControlProvider>
        <CharacterAnimationsProvider>
          <App />
        </CharacterAnimationsProvider>
      </CameraControlProvider>
    </ModalControlProvider>
  </React.StrictMode>
);
