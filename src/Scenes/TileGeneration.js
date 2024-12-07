export function generateTileAttributes(level) {
  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[i].length; j++) {
      const tile = level[i][j];
      generateAttributes(tile);
    }
  }
}

function generateAttributes(tile) {
  tile.sunLevel = Math.floor(Math.random() * 5);
  tile.waterLevel += Math.floor(Math.random() * 5);
  if (tile.waterLevel > 5) {
    tile.waterLevel = 5;
  }
}
