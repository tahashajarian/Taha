/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const portalFragmentShader = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uIntensity; // multiplies color intensity
varying vec2 vUv;

// Hash & noise
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p); vec2 f=fract(p);
  float a=hash(i); float b=hash(i+vec2(1.0,0.0));
  float c=hash(i+vec2(0.0,1.0)); float d=hash(i+vec2(1.0,1.0));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v=0.0,a=0.5;
  for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;}
  return v;
}

void main(){
  vec2 uv = vUv*2.0-1.0; // center at 0
  float len = length(uv);
  float angle = atan(uv.y, uv.x);

  // swirling fractal noise
  float t = uTime*0.5;
  float swirl = fbm(vec2(angle*3.0 + t, len*5.0 + t*0.7));

  // color gradient
  vec3 col = vec3(0.1,0.8,0.2)*0.5 + vec3(0.0,1.0,0.0)*swirl;

  // apply intensity
  col *= uIntensity;

  // alpha fade out edges
  float alpha = smoothstep(1.0, 0.6, len);
  gl_FragColor = vec4(col, alpha);
}
`;

const portalVertexShader = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

const PortalShader = () => {
  const materialRef = useRef(null);

  const shaderMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: portalVertexShader,
      fragmentShader: portalFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 1.0 },
      },
      transparent: true,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materialRef.current = mat;
    return mat;
  }, []);

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;
    // adjust intensity based on channeledCardsQty
    materialRef.current.uniforms.uIntensity.value = 0.5 + 0.2 * 1; // tweak multiplier as you like
  });

  return (
    <mesh>
      <planeGeometry args={[0.4, 0.4]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
};

export default PortalShader;
