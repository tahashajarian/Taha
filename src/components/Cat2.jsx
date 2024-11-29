// import React, { useEffect, useRef } from "react";
// import { useAnimations, useGLTF } from "@react-three/drei";

// export const Cat2 = (props) => {
//   const group = useRef();
//   const { nodes, materials, animations } = useGLTF('/models/cat2.glb');
//   const { actions, names } = useAnimations(animations, group);

//   useEffect(() => {
//     // Play the first animation if available
//     if (names.length > 0 && actions[names[0]]) {
//       actions[names[1]].play();
//     }
//   }, [actions, names]);
//   console.log({names, actions})

//   return (
//     <group {...props} dispose={null} scale={0.5} ref={group}>
//       <mesh
//         castShadow
//         receiveShadow
//         geometry={nodes.Gato001.geometry}
//         material={materials['Material.003']}
//       />
//       <mesh
//         castShadow
//         receiveShadow
//         geometry={nodes.Gato001_1.geometry}
//         material={materials['Material.004']}
//       />
//       <mesh
//         castShadow
//         receiveShadow
//         geometry={nodes.Gato001_2.geometry}
//         material={materials['Material.005']}
//       />
//     </group>
//   );
// };

// useGLTF.preload("/models/cat.glb");

// export default Cat2;
