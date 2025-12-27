export const wallSize = 12;
export const wallHeight = 4;
export const tablePosition = [0, 0, 0];
export const tableRotation = [0, 0, 0];
export const cameraLookAtConst = [3.5, 1.5, -1, 0, 0.7, 0.9];
export const cameraLookAtDefault = [0, 3, 8, 0, 0.7, 0];
export const cameraIdle = [0, 2, 5, 0, 0.8, 0];
export const bookColors = [
  "#8B4513", // SaddleBrown
  "#A0522D", // Sienna
  "#D2B48C", // Tan
  "#F4A460", // SandyBrown
  "#CD853F", // Peru
  "#DEB887", // BurlyWood
  "#BC8F8F", // RosyBrown
  "#F5DEB3", // Wheat
  "#DAA520", // GoldenRod
  "#808080", // Gray
  "#556B2F", // DarkOliveGreen
  "#8B0000", // DarkRed
];

export const randomColor = () =>
  bookColors[Math.floor(Math.random() * bookColors.length)];

const segments = 1;

export const wallData = [
  {
    pos: [0, wallHeight, 0],
    rot: [0.5 * Math.PI, 0, 0],
    args: [wallSize, wallSize, segments, segments],
  },
  {
    pos: [0, wallHeight / 2, wallSize / 2],
    rot: [Math.PI, 0, 0],
    args: [wallSize, wallHeight, segments, segments],
    windowPosition: [0, 0], // Center of the window
    windowSize: [3.5, 2], // Window size
  },
  {
    pos: [0, wallHeight / 2, -wallSize / 2],
    rot: [0, 0, 0],
    args: [wallSize, wallHeight, segments, segments],
  },
  {
    pos: [-wallSize / 2, wallHeight / 2, 0],
    rot: [0, Math.PI / 2, 0],
    args: [wallSize, wallHeight, segments, segments],
  },
  {
    pos: [wallSize / 2, wallHeight / 2, 0],
    rot: [0, -Math.PI / 2, 0],
    args: [wallSize, wallHeight, segments, segments],
  },
];
