import { useFrame } from "@react-three/fiber";
import React, { useMemo } from "react";
import { Color, ShaderMaterial } from "three";

const PortalShaderPlane = ({ args = [1, 1], position = [0, 0, 0] }) => {
  // Custom vertex shader (simple pass-through)
  const portalVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Custom fragment shader for portal effect
  const portalFragmentShader = `
    varying vec2 vUv;
    uniform float time;
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform float strength;

    float rand(vec2 n) {
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float noise(vec2 p){
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);

      float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
    }

    float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100);
      // Rotate to reduce axial bias
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
      for (int i = 0; i < 5; ++i) {
        v += a * noise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv;
      float distort = 0.1; // Distortion amount
      float speed = 1.0; // Animation speed
      float distortTime = time * speed;
      uv += distort * vec2(cos(distortTime + uv.y), sin(distortTime + uv.x));

      // Create a smooth gradient between colorA and colorB
      vec3 gradientColor = mix(colorA, colorB, uv.x * uv.y);

      // Add some noise for variation
      vec3 noise = vec3(
        0.5 + 0.5 * sin(distortTime * 2.0),
        0.5 + 0.5 * cos(distortTime * 1.7),
        0.5 + 0.5 * sin(distortTime * 1.3)
      );

      // Final color with noise and strength adjustment
      vec3 finalColor = gradientColor + noise * 0.2;
      gl_FragColor = vec4(finalColor, strength);
    }
  `;

  // Shader material setup
  const portalMaterial = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: portalVertexShader,
      fragmentShader: portalFragmentShader,
      uniforms: {
        time: { value: 0 },
        colorA: { value: new Color("#ff0099") }, // Adjust colors as needed
        colorB: { value: new Color("#22aaff") }, // Adjust colors as needed
        strength: { value: 0.2 }, // Adjust the strength of the effect
      },
      transparent: true,
    });
  }, []);

  // Animation loop
  useFrame(({ clock }) => {
    portalMaterial.uniforms.time.value = clock.elapsedTime;
  });

  return (
    <mesh position={position}>
      <planeGeometry args={args} />
      <primitive object={portalMaterial} />
    </mesh>
  );
};

export default PortalShaderPlane;
