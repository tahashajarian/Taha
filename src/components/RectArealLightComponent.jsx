import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import * as THREE from 'three';

const RectAreaLightComponent = ({ color, intensity, width, height, position, rotation }) => {
  // const light = useRef();

  // useEffect(() => {
  //   if (light.current) {
  //     // Add the light to the scene
  //     const helper = new RectAreaLightHelper(light.current);
  //     light.current.add(helper);

  //     // Update the helper when the light properties change
  //     // helper.update();
  //   }
  // }, [light]);

  return (
    <rectAreaLight
      // ref={light}
      color={color}
      intensity={intensity}
      width={width}
      height={height}
      position={position}
      rotation={rotation}
    />
  );
};

export default RectAreaLightComponent;
