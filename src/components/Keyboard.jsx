import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Keyboard = (props) => {
  const { nodes, materials } = useGLTF("/models/keyboard.glb");
  return (
    <group {...props} dispose={null}>
      <RGBLight />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials.klawisze}
        scale={1}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
};

useGLTF.preload("/models/keyboard.glb");

export default Keyboard;

const RGBLight = () => {
  const lightRefR = useRef();
  const lightRefG = useRef();
  const lightRefB = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const r = (Math.sin(time * 2) + 1) / 2; // oscillate between 0 and 1
    const g = (Math.sin(time * 2 + Math.PI / 2) + 1) / 2; // 90 degrees phase shift
    const b = (Math.sin(time * 2 + Math.PI) + 1) / 2; // 180 degrees phase shift

    if (lightRefR.current) lightRefR.current.color.setRGB(r, 0, 0);
    if (lightRefG.current) lightRefG.current.color.setRGB(0, g, 0);
    if (lightRefB.current) lightRefB.current.color.setRGB(0, 0, b);
  });

  return (
    <group>
      <rectAreaLight
        position={[0.0, 0.03, 0.04]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.45}
        height={0.04}
        intensity={10}
        color="red"
        ref={lightRefR}
      />
      <rectAreaLight
        position={[0.0, 0.03, 0.0]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.45}
        height={0.06}
        intensity={10}
        color="blue"
        ref={lightRefB}
      />
      <rectAreaLight
        position={[0.0, 0.03, -0.04]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.45}
        height={0.04}
        intensity={10}
        color="green"
        ref={lightRefG}
      />
    </group>
  );
};
