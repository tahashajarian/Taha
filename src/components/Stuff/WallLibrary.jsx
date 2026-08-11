const WallLibrary = ({ position }) => (
  <mesh position={position} rotation={[0, Math.PI / 2, 0]}>
    <boxGeometry args={[2, 0.07, 0.3]} />
    <meshStandardMaterial
      color="#0b0705"
      emissive="#4b2411"
      emissiveIntensity={0.32}
      roughness={0.82}
    />
  </mesh>
);

export default WallLibrary;
