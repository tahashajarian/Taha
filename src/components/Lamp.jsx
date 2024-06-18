import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

const Lamp = (props) => {
  const { nodes, materials } = useGLTF("/models/lamp.glb");
  const shinyEmissiveMaterial = new MeshStandardMaterial({
    color: 0xffaaaa, // white base color
    roughness: 0.1, // low roughness for shininess
    metalness: 0.9, // high metalness for reflective look
    emissive: 0xffaaaa, // light yellow emissive color
    emissiveIntensity: 2, // intensity of the emissive color
  });
  return (
    <group {...props} dispose={null} scale={0.2}>
      <group position={[0, 3.4, 0.489]} scale={[0.875, 1.5, 0.875]}>
        <mesh
          
          
          geometry={nodes.Цилиндр012.geometry}
          material={shinyEmissiveMaterial}
        />
        <mesh
          
          
          geometry={nodes.Цилиндр012_1.geometry}
          material={materials["Matte Black"]}
        />
      </group>
      <pointLight
        distance={4}
        decay={1}
        power={10}
        position={[0, 4, 0]}
        color={"#ffaaaa"}
        intensity={0.9}
      />
    </group>
  );
};

useGLTF.preload("/models/lamp.glb");
export default Lamp;

// import React, { useRef } from "react";
// import { useGLTF } from "@react-three/drei";

// const Lamp = () => {
//   const group = useRef();
//   const { nodes } = useGLTF("/models/lamp.glb");

//   // Create a shiny and emissive material

//   return (
//     <group ref={group} dispose={null}>
//       <mesh
//         geometry={nodes.lamp.geometry}
//         material={shinyEmissiveMaterial}
//         
//         
//       />
//       <pointLight
//         position={[0, 0.5, 0]}
//         intensity={1}
//         distance={5}
//         decay={2}
//         color={0xffffaa}
//       />
//     </group>
//   );
// };

// export default Lamp;
