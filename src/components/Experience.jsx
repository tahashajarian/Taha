import { OrbitControls } from "@react-three/drei";
import Woman from "./Woman";
import Taha from "./Taha";
import Chair from "./Chair";
import Desk from "./Desk";
import Monitor from "./Monitor";
import Keyboard from "./Keyboard";

const Experience = () => {
  return (
    <>
      <OrbitControls />
      <ambientLight />
      <directionalLight
        position={[-5, 5, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* <group position={[0, -1, 0]}>
        <Woman />
      </group> */}

      <group position={[0, -1, 0]}>
        <Taha />
        <Chair />
        <group position={[0, 0, 0.8]} scale={[1.2, 0.84, 1]}>
          <Desk />
        </group>
        <group position={[0, 0.7, 1]}>
          <Monitor />
        </group>
        <group  position={[0.15, 0.7, 0.65]}>
          <Keyboard />
        </group>
      </group>

      <mesh
        rotation={[-0.5 * Math.PI, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeBufferGeometry args={[10, 10, 10, 10]} />
        <meshStandardMaterial wireframe />
      </mesh>
    </>
  );
};

export default Experience;
