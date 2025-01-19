import React, { Suspense } from "react";
import * as THREE from "three";
import { useLayoutEffect, useRef } from "react";
import {
  extend,
  useFrame,
  useLoader,
  ReactThreeFiber,
} from "@react-three/fiber";
import { FireMaterial } from "./FireShaderMaterial";
import { wallSize } from "../../../constances/constances";
import Fireplace from "../../Stuff/Fireplace.jsx";

export default function FireCube() {
  return (
    <group position={[-wallSize/2 + 0.7, 0, wallSize/2 - 2]}>

      <Fireplace />
      <group position={[0, 1, 0]}>

      <Fire scale={4} color={new THREE.Color(0x000000)} />;
      </group>
    </group>
  );
}
extend({ FireMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      fireMaterial: ReactThreeFiber.Object3DNode<
        FireMaterial,
        typeof FireMaterial
      >;
    }
  }
}
extend({ FireMaterial });


function Fire({ color, ...props }) {
  const ref = useRef<THREE.Mesh & { material: FireMaterial }>(null);
  const texture = useLoader(THREE.TextureLoader as any, "/textures/fire.png");
  useFrame((state) => {
    if (ref.current) {
      const invModelMatrix = ref.current.material.uniforms.invModelMatrix.value;
      ref.current.updateMatrixWorld();
      invModelMatrix.copy(ref.current.matrixWorld).invert();
      ref.current.material.uniforms.time.value = state.clock.elapsedTime;
      ref.current.material.uniforms.invModelMatrix.value = invModelMatrix;
      ref.current.material.uniforms.scale.value = ref.current.scale;
    }
  });
  useLayoutEffect(() => {
    // texture.magFilter = texture.minFilter = THREE.LinearFilter;
    // texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    if (ref.current) {
      ref.current.material.uniforms.fireTex.value = texture;
      ref.current.material.uniforms.color.value =
        color || new THREE.Color(0xeeeeee);
      ref.current.material.uniforms.invModelMatrix.value = new THREE.Matrix4();
      ref.current.material.uniforms.scale.value = new THREE.Vector3(1, 1, 1);
      ref.current.material.uniforms.seed.value = Math.random() * 19.19;
    }
  }, []);
  return (
    <mesh
      ref={ref}
      {...props}
      scale={new THREE.Vector3(1.2, 2, 1.2)}
      position={[0, 0, 0]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <fireMaterial
        transparent
        opacity={1}
        // depthWrite={false}
        // depthTest={false}
        side={THREE.DoubleSide}

      />
    </mesh>
  );
}
