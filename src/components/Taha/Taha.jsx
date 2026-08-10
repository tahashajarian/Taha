import React, { useEffect, useMemo } from "react";
import * as THREE from "three";

const SoftCharacterShadow = () => {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(32, 32, 2, 32, 32, 30);
    gradient.addColorStop(0, "rgba(0,0,0,0.65)");
    gradient.addColorStop(0.55, "rgba(0,0,0,0.3)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);

    const next = new THREE.CanvasTexture(canvas);
    next.colorSpace = THREE.SRGBColorSpace;
    return next;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh
      position={[0, 0.012, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[0.48, 0.32, 1]}
      renderOrder={1}
    >
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.5}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
};

const Taha = ({ charRef, nodes, materials }) => {
  return (
    <group
      receiveShadow
      castShadow
      ref={charRef}
      dispose={null}
      frustumCulled={false}
    >
      <SoftCharacterShadow />
      <group receiveShadow castShadow name="Scene">
        <group
          receiveShadow
          castShadow
          name="Armature001"
          frustumCulled={false}
        >
          <skinnedMesh
            name="EyeLeft"
            geometry={nodes.EyeLeft.geometry}
            material={materials["Wolf3D_Eye.011"]}
            skeleton={nodes.EyeLeft.skeleton}
            morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
            morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
            frustumCulled={false}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="EyeRight"
            geometry={nodes.EyeRight.geometry}
            material={materials["Wolf3D_Eye.011"]}
            skeleton={nodes.EyeRight.skeleton}
            morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
            morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
            frustumCulled={false}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="Wolf3D_Body"
            geometry={nodes.Wolf3D_Body.geometry}
            material={materials["Wolf3D_Body.011"]}
            skeleton={nodes.Wolf3D_Body.skeleton}
            frustumCulled={false}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="Wolf3D_Glasses"
            geometry={nodes.Wolf3D_Glasses.geometry}
            material={materials["Wolf3D_Glasses.011"]}
            skeleton={nodes.Wolf3D_Glasses.skeleton}
            frustumCulled={false}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="Wolf3D_Hair"
            geometry={nodes.Wolf3D_Hair.geometry}
            material={materials["Wolf3D_Hair.011"]}
            skeleton={nodes.Wolf3D_Hair.skeleton}
            frustumCulled={false}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="Wolf3D_Head"
            geometry={nodes.Wolf3D_Head.geometry}
            material={materials["Wolf3D_Skin.011"]}
            skeleton={nodes.Wolf3D_Head.skeleton}
            morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
            morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
            frustumCulled={false}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="Wolf3D_Outfit_Bottom"
            geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
            material={materials["Wolf3D_Outfit_Bottom.011"]}
            skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
            frustumCulled={false}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="Wolf3D_Outfit_Footwear"
            geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
            material={materials["Wolf3D_Outfit_Footwear.011"]}
            skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
            frustumCulled={false}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="Wolf3D_Outfit_Top001"
            geometry={nodes.Wolf3D_Outfit_Top001.geometry}
            material={materials["Wolf3D_Outfit_Top.011"]}
            skeleton={nodes.Wolf3D_Outfit_Top001.skeleton}
            frustumCulled={false}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="Wolf3D_Teeth"
            geometry={nodes.Wolf3D_Teeth.geometry}
            material={materials["Wolf3D_Teeth.011"]}
            skeleton={nodes.Wolf3D_Teeth.skeleton}
            morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
            morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
            frustumCulled={false}
            castShadow
            receiveShadow
          />
          <primitive object={nodes.Hips} />
        </group>
      </group>
    </group>
  );
};

export default React.memo(Taha);
