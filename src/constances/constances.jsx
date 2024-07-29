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