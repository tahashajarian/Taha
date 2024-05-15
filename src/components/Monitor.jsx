import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Monitor = (props) => {
  const { nodes, materials } = useGLTF("/models/monitor.glb");
  return (
    <group {...props} dispose={null}>
      <group
        position={[0.002, 0.337, -0.061]}
        rotation={[Math.PI / 2, 0, 3.14]}
        scale={[0.6, 0.3, 0.25]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane002.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane002_1.geometry}
          material={materials["Material.002"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane002_2.geometry}
          material={materials["Material.007"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane002_3.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane002_4.geometry}
          material={materials["Material.004"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane002_5.geometry}
          material={materials["Material.005"]}
        />
      </group>
      <group
        position={[0.001, 0.212, -0.007]}
        rotation={[Math.PI, -0.002, Math.PI]}
        scale={[0.215, 0.215, 0.18]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder.geometry}
          material={materials["Material.007"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder_1.geometry}
          material={materials["Material.009"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder_2.geometry}
          material={materials["Material.008"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder_3.geometry}
          material={materials["Material.006"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder_4.geometry}
          material={materials["Material.010"]}
        />
      </group>
    </group>
  );
};

useGLTF.preload("/models/monitor.glb");

export default Monitor;
