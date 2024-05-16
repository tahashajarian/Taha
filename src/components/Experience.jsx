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



const Experience = () => {
  return (
    <>
      <OrbitControls />
      {/* <ambientLight /> */}
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
        <group position={[0.15, 0.7, 0.65]}>
          <Keyboard />
        </group>
      </group>
      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeBufferGeometry args={[16, 16, 25, 25]} />
        <meshStandardMaterial wireframe />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0, 2, -8]} receiveShadow>
        <planeBufferGeometry args={[16, 4, 25, 25]} />
        <meshStandardMaterial wireframe />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0, 2, 8]} receiveShadow>
        <planeBufferGeometry args={[16, 4, 25, 25]} />
        <meshStandardMaterial wireframe />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-8, 2, 0]} receiveShadow>
        <planeBufferGeometry args={[16, 4, 25, 25]} />
        <meshStandardMaterial wireframe />
      </mesh>
      <mesh rotation={[0, - Math.PI / 2, 0]} position={[8, 2, 0]} receiveShadow>
        <planeBufferGeometry args={[16, 4, 25, 25]} />
        <meshStandardMaterial wireframe />
      </mesh>
    </>
  );
};

export default Experience;


const RGBLight = () => {
  const lightRef = useRef();
  
  // useFrame(() => {
  //   // Rotate the light
  //   if (lightRef.current) {
  //     lightRef.current.rotation.x += 0.01;
  //     lightRef.current.rotation.y += 0.01;
  //   }
  // });

  return (
    <>
      <rectAreaLight
        position={[0.15, 0.74, 0.66]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.5}
        height={0.06}
        intensity={10}
        color="red"
      />
      <rectAreaLight
        position={[0.15, 0.74, 0.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.5}
        height={0.06}
        intensity={10}
        color="blue"
      />
      <rectAreaLight
        position={[0.15, 0.74, 0.7]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={0.5}
        height={0.06}
        intensity={10}
        color="green"
      />

      <rectAreaLight
        position={[0, 1.05, 0.79]}
        rotation={[0, -Math.PI, 0]}
        width={1.2}
        height={0.5}
        intensity={10}
        color="white"
      />
      {/* Add the helper */}
      {/* {lightRef.current && <RectAreaLightHelper  light={lightRef.current} />} */}
      {/* <mesh position={[0, 1.05, 0.85]} rotation={[0, -Math.PI, 0]}>
        <planeBufferGeometry args={[1.2, 0.5]} />
        <meshStandardMaterial color="red" />
      </mesh> */}
    </>
  );
};