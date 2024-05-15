import { OrbitControls } from "@react-three/drei";
import Woman from "./Woman";
import Taha from "./Taha";

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
