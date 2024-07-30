import React from "react";
import { wallHeight, wallSize } from "../constances/constances";
import FloatingPoint from "./FloatingLight";
import RectAreaLightComponent from "./RectArealLightComponent";

const FlightPoints = () => {
  return (
    <>
      <FloatingPoint
        color="red"
        position={[-wallSize / 2 + 0.5, 1, 1]}
        amplitude={0.5}
        frequency={0.5}
      />
      <FloatingPoint
        color="green"
        position={[-wallSize / 2 + 0.5, 1, -3]}
        amplitude={0.5}
        frequency={0.75}
      />
      <FloatingPoint
        color="blue"
        position={[-wallSize / 2 + 0.5, 2, 3]}
        amplitude={0.5}
        frequency={0.4}
      />
      <FloatingPoint
        color="yellow"
        position={[-wallSize / 2 + 0.5, 2, -1]}
        amplitude={0.5}
        frequency={0.7}
      />
      <RectAreaLightComponent
        color={"blue"}
        intensity={50}
        width={wallSize - 0.1}
        height={0.1}
        position={[-wallSize / 2 + 0.05, wallHeight - 0.01, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <RectAreaLightComponent
        color={"blue"}
        intensity={50}
        width={wallSize - 0.1}
        height={0.1}
        position={[wallSize / 2 - 0.05, wallHeight - 0.01, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
     <RectAreaLightComponent
        color={"blue"}
        intensity={50}
        width={wallSize - 0.1}
        height={0.1}
        position={[0, wallHeight - 0.01, -wallSize/2 + 0.05]}
        rotation={[0, 0, 0]}
      />
      <RectAreaLightComponent
        color={"blue"}
        intensity={50}
        width={wallSize - 0.1}
        height={0.1}
        position={[0, wallHeight - 0.01, wallSize/2 - 0.05]}
        rotation={[Math.PI, 0, 0]}
      />
    </>
  );
};

export default FlightPoints;
