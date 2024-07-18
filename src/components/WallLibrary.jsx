const WallLibrary = ({ position }) => (
  <mesh position={position} rotation={[0, Math.PI / 2, 0]}>
    <boxGeometry args={[2, 0.04, 0.3]} />
    <meshBasicMaterial color={"orange"} />
  </mesh>
);

export default WallLibrary;
