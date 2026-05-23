import React, { useRef, useMemo, useEffect, useState } from "react";
import { Color, TextureLoader } from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { usePaintingStore } from "../../stores/usePaintingStore";
import { useAppStatusStore } from "../../stores/useAppStatusStore";

const REFRESH_TEXTURE_URL = "/textures/refresh.png";

useTexture.preload(REFRESH_TEXTURE_URL);

const Frame = React.memo(
  ({ width, height, thickness, color, position, isLoading }) => {
    const frameWidth = useMemo(() => width + thickness * 1, [width, thickness]);
    const frameHeight = useMemo(() => height + thickness * 1, [height, thickness]);
    const materialRef = useRef();
    const tempColor = useRef(new Color(color));

    useFrame((state) => {
      if (!materialRef.current) return;
      if (isLoading) {
        const t = (Math.sin(state.clock.elapsedTime * 5) + 1) / 2;
        tempColor.current.setRGB(0.1 * t, 0.1 * t, 0.1 * t);
        materialRef.current.color.copy(tempColor.current);
      } else {
        materialRef.current.color.set(color);
      }
    });

    return (
      <mesh position={[0, 0, position]}>
        <boxGeometry args={[frameWidth, frameHeight, thickness]} />
        <meshBasicMaterial color={color} ref={materialRef} transparent />
      </mesh>
    );
  },
);

const Picture = React.memo(({ width, height, map }) => {
  const geometryArgs = useMemo(() => [width, height], [width, height]);
  const [texture, setTexture] = useState(null);
  const textureRef = useRef(null);

  useEffect(() => {
    if (!map) {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      setTexture(null);
      return;
    }

    let disposed = false;
    const loader = new TextureLoader();

    loader.load(
      map,
      (loaded) => {
        if (disposed) {
          loaded.dispose();
          return;
        }

        if (textureRef.current && textureRef.current !== loaded) {
          textureRef.current.dispose();
        }

        textureRef.current = loaded;
        setTexture(loaded);
      },
      undefined,
      (err) => console.error("Texture load failed:", err),
    );

    return () => {
      disposed = true;
    };
  }, [map]);

  useEffect(
    () => () => {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    },
    [],
  );

  if (!map || !texture) return null;

  return (
    <mesh position={[0, 0, 0.13]}>
      <planeGeometry args={geometryArgs} />
      <meshBasicMaterial map={texture} transparent color="white" />
    </mesh>
  );
});

const RefreshIcon = React.memo(({ onClick }) => {
  const ref = useRef();
  const texture = useTexture(REFRESH_TEXTURE_URL);

  return (
    <mesh position={[-2.6, 1.5, 0.1]} ref={ref} onClick={onClick}>
      <planeGeometry args={[0.3, 0.3]} />
      <meshStandardMaterial map={texture} color="#111111" transparent />
    </mesh>
  );
});

const ShaderFrame = () => {
  const paintingImage = usePaintingStore((s) => s.paintingImage);
  const fetchPainting = usePaintingStore((s) => s.fetchPainting);
  const loading = usePaintingStore((s) => s.loading);
  const setPaintModalIsOpen = useAppStatusStore((s) => s.setPaintModalIsOpen);

  const pictureWidth = 3;
  const pictureHeight = 2.25;
  const frameThickness = 0.0001;

  return (
    <>
      <group onClick={fetchPainting}>
        <RefreshIcon />
      </group>
      <group onClick={() => setPaintModalIsOpen(true)} scale={1.5}>
        <Frame
          width={pictureWidth}
          height={pictureHeight}
          thickness={frameThickness + 0.1}
          color="black"
          position={0.01}
          isLoading={loading}
        />
        <Frame
          width={pictureWidth}
          height={pictureHeight}
          thickness={frameThickness}
          color="black"
          position={0.12}
        />
        <Picture width={pictureWidth} height={pictureHeight} map={paintingImage} />
      </group>
    </>
  );
};

export default React.memo(ShaderFrame);
