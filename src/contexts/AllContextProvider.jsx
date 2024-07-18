import React from "react";
import { AppStatusContextProvider } from "./AppStatusContext";
import { CameraControlProvider } from "./CameraControlContext";
import { CharacterAnimationsProvider } from "./CharacterAnimations";
import { PaintingContextProvider } from "./PaintingContext";
import { ArrowsProvider } from "./ArrowsProvider";

const AllContextProvider = ({ children }) => {
  return (
    <ArrowsProvider>
      <AppStatusContextProvider>
        <CameraControlProvider>
          <PaintingContextProvider>
            <CharacterAnimationsProvider>
              {children}
            </CharacterAnimationsProvider>
          </PaintingContextProvider>
        </CameraControlProvider>
      </AppStatusContextProvider>
    </ArrowsProvider>
  );
};

export default AllContextProvider;
