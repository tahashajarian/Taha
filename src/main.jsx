import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CharacterAnimationsProvider } from "./contexts/CharacterAnimations";
import "./index.css";
import { CameraControlProvider } from "./contexts/CameraControlContext";
import { AppStatusContextProvider } from "./contexts/AppStatusContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppStatusContextProvider>
      <CameraControlProvider>
        <CharacterAnimationsProvider>
          <App />
        </CharacterAnimationsProvider>
      </CameraControlProvider>
    </AppStatusContextProvider>
  </React.StrictMode>
);
