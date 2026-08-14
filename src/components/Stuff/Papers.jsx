import React, { memo, useEffect, useMemo } from "react";
import * as THREE from "three";

const PAPER_COUNT = 10;
const PAPER_NOTES = [
  ["A QUIET NIGHT", "rain on the window", "and an old song"],
  ["LITTLE THINGS", "warm tea / soft light", "the cat is dreaming"],
  ["NOTE TO SELF", "take the long way home", "look at the moon"],
  ["SEA STUDY", "listen to the waves", "breathe slowly"],
];

const createPaperTexture = (lines, index) => {
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  context.fillStyle = index % 2 ? "#d8cfb9" : "#eee5cf";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(45, 75, 92, 0.16)";
  context.lineWidth = 1;
  for (let y = 40; y < 238; y += 22) {
    context.beginPath();
    context.moveTo(14, y);
    context.lineTo(178, y);
    context.stroke();
  }

  context.fillStyle = "#23394a";
  context.font = "bold 19px sans-serif";
  context.fillText(lines[0], 16, 30);
  context.font = "15px monospace";
  context.fillText(lines[1], 16, 68);
  context.font = "12px monospace";
  context.fillText(lines[2], 16, 96);

  context.strokeStyle = "#a46332";
  context.lineWidth = 3;
  context.beginPath();
  if (index === 0) {
    context.moveTo(35, 145);
    context.bezierCurveTo(62, 112, 95, 182, 145, 132);
    context.bezierCurveTo(120, 180, 73, 174, 35, 145);
  } else if (index === 1) {
    context.rect(36, 128, 45, 31);
    context.moveTo(82, 143);
    context.lineTo(145, 125);
    context.moveTo(82, 143);
    context.lineTo(145, 174);
  } else if (index === 2) {
    context.arc(92, 160, 34, 0.2, Math.PI * 1.85);
    context.moveTo(72, 160);
    context.lineTo(86, 174);
    context.lineTo(118, 137);
  } else {
    for (let y = 130; y < 200; y += 18) {
      context.moveTo(20, y);
      context.bezierCurveTo(55, y - 24, 95, y + 24, 170, y - 5);
    }
  }
  context.stroke();

  if (index === 2) {
    context.strokeStyle = "rgba(93, 52, 24, 0.32)";
    context.lineWidth = 5;
    context.beginPath();
    context.arc(150, 215, 22, 0, Math.PI * 2);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 2;
  return texture;
};

const Papers = () => {
  const geometry = useMemo(() => new THREE.PlaneGeometry(0.2, 0.3), []);
  const materials = useMemo(
    () =>
      PAPER_NOTES.map(
        (notes, index) =>
          new THREE.MeshStandardMaterial({
            map: createPaperTexture(notes, index),
            roughness: 0.94,
          }),
      ),
    [],
  );
  const papers = useMemo(
    () =>
      Array.from({ length: PAPER_COUNT }, (_, index) => ({
        rotation: [0, 0, Math.PI + ((index * 37) % 23 - 11) * 0.012],
        position: [
          ((index % 3) - 1) * 0.018,
          ((Math.floor(index / 3) % 3) - 1) * 0.014,
          index * 0.001,
        ],
        material: materials[index % materials.length],
      })),
    [materials],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      materials.forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
    },
    [geometry, materials],
  );

  return (
    <group>
      <Pen />
      {papers.map((paper, index) => (
        <mesh key={index} geometry={geometry} {...paper} />
      ))}
    </group>
  );
};

const Pen = () => (
  <mesh position={[0, 0, 0.011]}>
    <cylinderGeometry args={[0.005, 0.005, 0.118, 8]} />
    <meshStandardMaterial color="#1a2430" metalness={0.35} roughness={0.4} />
  </mesh>
);

export default memo(Papers);
