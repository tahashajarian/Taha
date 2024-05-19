import React, { useRef } from "react";

import { useGLTF, useAnimations } from "@react-three/drei";
import Asali from "./Asali";

const Sofa = (props) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/sofa.glb");
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null} position={[3.5, 0, -5]}>
      <group name="Scene">
        <mesh
          name="mesh_10_228nr"
          castShadow
          receiveShadow
          geometry={nodes.mesh_10_228nr.geometry}
          material={materials.sofa}
          scale={0.01}
        />
        {/* <mesh
          name="mesh_10_228nr"
          castShadow
          receiveShadow
          geometry={nodes.mesh_10_228nr.geometry}
          material={materials.sofa}
          scale={0.0115}
          position={[3.2, 0, 0]}
        /> */}
      </group>
      <group position={[0, 0, 1.7]} scale={0.6}>
        <Asali />
      </group>
    </group>
  );
};

export default Sofa;

useGLTF.preload("/models/sofa.glb");
