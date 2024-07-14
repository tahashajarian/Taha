import React from "react";
import { AppStatusContextProvider } from "./AppStatusContext";
import { CameraControlProvider } from "./CameraControlContext";
import { CharacterAnimationsProvider } from "./CharacterAnimations";
import { PaintingContextProvider } from "./PaintingContext";

const AllContextProvider = ({ children }) => {
  return (
    <AppStatusContextProvider>
      <CameraControlProvider>
        <PaintingContextProvider>
          <CharacterAnimationsProvider>{children}</CharacterAnimationsProvider>
        </PaintingContextProvider>
      </CameraControlProvider>
    </AppStatusContextProvider>
  );
};

export default AllContextProvider;
