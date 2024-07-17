import React, { useRef, useState, useEffect } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Sound from "./Sound";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform bool isPlaying;
  varying vec2 vUv;
  void main() {
    vec3 color = vec3(1.0); // Default color is white
    if (isPlaying) {
      color = vec3(
        0.5 + 0.5 * cos(2.0 * time + vUv.x * 5.0),
        0.5 + 0.5 * cos(2.0 * time + vUv.y * 5.0 + 2.0),
        0.5 + 0.5 * cos(2.0 * time + vUv.x * 5.0 + 4.0)
      );
    }
    gl_FragColor = vec4(color, 1.0);
  }
`;

const Speaker = (props) => {
  const { nodes } = useGLTF("/models/speaker.glb");
  const circleRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0.0 },
      isPlaying: { value: false },
    },
  });

  useFrame(({ clock }) => {
    if (circleRef.current) {
      circleRef.current.material.uniforms.time.value = clock.getElapsedTime();
      circleRef.current.material.uniforms.isPlaying.value = isPlaying;
    }
  });

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.material = shaderMaterial;
    }
  }, [shaderMaterial]);

  return (
    <group
      {...props}
      dispose={null}
      scale={0.09}
      rotation={[Math.PI, 0, 0]}
      onClick={() => {
        setIsPlaying(!isPlaying);
      }}
    >
      <mesh
        geometry={nodes.Cube.geometry}
        material={
          new THREE.MeshStandardMaterial({
            color: "#333333",
            emissive: 0xffffff, // light yellow emissive color
            emissiveIntensity: isPlaying ? 0.05 : 0, // intensity of the emissive color
          })
        }
      />
      <mesh
        ref={circleRef}
        geometry={nodes.Circle.geometry}
        material={shaderMaterial}
        position={[0, -0.1, 1.277]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.7}
      />
      <Sound
        // url={"/audio/Ludwing Van Beethoven - 5th Symphony 1st Movement.mp3"}
        url={"/audio/Johannes-Brahms-Wiegenlied-Op-49.mp3"}
        isPlaying={isPlaying}
      />
    </group>
  );
};

useGLTF.preload("/models/speaker.glb");
export default Speaker;
