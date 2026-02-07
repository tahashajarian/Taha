const WallLibrary = ({ position }) => (
  <mesh position={position} rotation={[0, Math.PI / 2, 0]}>
    <boxGeometry args={[2, 0.07, 0.3]} />
    <meshBasicMaterial color={"#010101"} />
  </mesh>
);

export default WallLibrary;
