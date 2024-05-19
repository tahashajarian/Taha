import React from "react";

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[-5, 5, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
};

export default Lights;
