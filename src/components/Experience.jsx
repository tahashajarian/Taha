import { OrbitControls } from "@react-three/drei";
import Woman from "./Woman";
import Taha from "./Taha";
import Chair from "./Chair";
import Desk from "./Desk";
import Monitor from "./Monitor";
import Keyboard from "./Keyboard";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import Mouse from "./Mouse";



const Experience = () => {
  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.4}/>
      <directionalLight
        position={[-5, 5, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* <rectAreaLight
        args={[0xff0000, 1, 10, 10]}
        // width={2}
        // height={2}
        lookAt={[0, 1, 0]}
        position={[0, -2, -2]}
      /> */}
      <RGBLight />
      <group position={[0, 0, 0]}>
        <Taha />
        <Chair />
        <group position={[0, 0, 0.8]} scale={[1.2, 0.84, 1]}>
          <Desk />
        </group>
        <group position={[0, 0.7, 1]}>
          <Monitor />
        </group>
        <group position={[-0.26, 0.7, 0.68]} scale={[1, 1.2, 1]}>
          <Mouse />
        </group>
        <group position={[0.1, 0.715, 0.65]}>
          <Keyboard />
        </group>
      </group>
      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[16, 16, 25, 25]} />
        <meshStandardMaterial wireframe />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0, 2, -8]} receiveShadow>
        <planeGeometry args={[16, 4, 25, 25]} />
        <meshStandardMaterial wireframe />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0, 2, 8]} receiveShadow>
        <planeGeometry args={[16, 4, 25, 25]} />
        <meshStandardMaterial wireframe />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-8, 2, 0]} receiveShadow>
        <planeGeometry args={[16, 4, 25, 25]} />
        <meshStandardMaterial wireframe />
      </mesh>
      <mesh rotation={[0, - Math.PI / 2, 0]} position={[8, 2, 0]} receiveShadow>
        <planeGeometry args={[16, 4, 25, 25]} />
        <meshStandardMaterial wireframe />
      </mesh>
    </>
  );
};

export default Experience;


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
        position={[0.1, 0.75, 0.7]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.5}
        height={0.04}
        intensity={5}
        color="red"
        ref={lightRefR}
      />
      <rectAreaLight
        position={[0.1, 0.75, 0.65]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.5}
        height={0.05}
        intensity={5}
        color="blue"
        ref={lightRefB}
      />
      <rectAreaLight
        position={[0.1, 0.75, 0.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.5}
        height={0.04}
        intensity={5}
        color="green"
        ref={lightRefG}
      />
    </group>
  );
};

