import React, { memo } from "react";
import { useGLTF } from "@react-three/drei";

const Clock = (props) => {
  const { nodes, materials } = useGLTF("/models/clock.glb", "/draco/");

  return (
    <group {...props} scale={0.005} dispose={null}>
      <mesh
        geometry={nodes.repaired_meltedmeltingclock.geometry}
        material={materials.white}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.repaired_meltedmeltingclock_1.geometry}
        material={materials.black}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.repaired_meltedmeltingclock_2.geometry}
        material={materials.orange}
        castShadow
        receiveShadow
      />
    </group>
  );
};

useGLTF.preload("/models/clock.glb", "/draco/");
export default memo(Clock);
