import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import Book from "./Book";
import { Chess } from "./chess/Chess";

const Asali = ({
  onChessPointerDown,
  onChessPointerOver,
  onChessPointerOut,
  ...props
}) => {
  const { nodes, materials } = useGLTF("/models/asali.glb", "/draco/");
  return (
    <group castShadow receiveShadow {...props} dispose={null}>
      <group scale={1.5} position={[1.0, 1.08, 0]}>
        <Book
          clickAble={false}
          position={[0, 0.05, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <Book
          clickAble={false}
          position={[0, 0.1, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <Book
          clickAble={false}
          position={[0, 0.15, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>
      <Chess
        onPointerDown={onChessPointerDown}
        onPointerOver={onChessPointerOver}
        onPointerOut={onChessPointerOut}
      />
      <mesh
        scale={1.6}
        castShadow
        receiveShadow
        geometry={nodes.table001.geometry}
        material={materials.table}
      />
    </group>
  );
};

useGLTF.preload("/models/asali.glb", "/draco/");

export default Asali;
