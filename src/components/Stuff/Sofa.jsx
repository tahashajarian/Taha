import React, { useRef } from "react";
import { Box3, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import Asali from "./Asali";
import { useCameraControlStore } from "../../stores/useCameraControlStore";

const Sofa = (props) => {
  const group = useRef();
  const asaliRef = useRef();

  const { nodes, materials } = useGLTF("/models/sofa.glb");
  const { setCameraLookAt, setChessMode, chessMode } =
    useCameraControlStore();

  const handleDeskClick = (e) => {
    e.stopPropagation();
    if (chessMode) return;

    const targetObj = asaliRef.current || group.current;
    if (!targetObj) return;

    const box = new Box3().setFromObject(targetObj);
    if (box.isEmpty()) return;

    const center = new Vector3();
    const size = new Vector3();
    box.getCenter(center);
    box.getSize(size);

    const cameraPos = [
      center.x - 0.07,
      center.y + 2,
      center.z - Math.max(size.z * 0.6, 0.8),
    ];

    const target = [
      center.x - 0.07,
      center.y + size.y * 0.5,
      center.z,
    ];

    setCameraLookAt([...cameraPos, ...target]);
    setChessMode(true);
  };

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      position={[3.5, 0, -5]}
    >
      <group name="Scene">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh_10_228nr.geometry}
          material={materials.sofa}
          scale={0.01}
        />
      </group>

      <group
        position={[0, 0, 1.7]}
        scale={0.6}
        ref={asaliRef}
        onPointerDown={handleDeskClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "default";
        }}
      >
        <Asali />
      </group>
    </group>
  );
};

export default Sofa;

useGLTF.preload("/models/sofa.glb");