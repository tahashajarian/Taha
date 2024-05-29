import { createContext, useContext, useState } from "react";

const CameraControlContext = createContext({});

export const CameraControlProvider = (props) => {
  const [cameraLookAt, setCameraLookAt] = useState();

  return (
    <CameraControlContext.Provider
      value={{
        cameraLookAt,
        setCameraLookAt,
      }}
    >
      {props.children}
    </CameraControlContext.Provider>
  );
};

export const useCameraControl = () => {
  return useContext(CameraControlContext);
};
