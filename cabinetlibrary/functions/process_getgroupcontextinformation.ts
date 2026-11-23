process_GetGroupContextInformation(roomData: any, articlePosition: any, groupWidth: number, alignToAssemblyDirection = false): {
  Left: number;
  Right: number;
  DataComplete: boolean;
  WallLength?: number;
  PositionOnWall?: number;
  DirectionX?: number;
  DirectionZ?: number;
} {

  //====================================================================
  // Guard
  //====================================================================

  if (!Array.isArray(roomData?.levels) || !articlePosition || !Number.isFinite(groupWidth) ||
      (alignToAssemblyDirection ? groupWidth < 0 : groupWidth <= 0) ||
      ![articlePosition.x ?? 0, articlePosition.y ?? 0, articlePosition.z ?? 0, articlePosition.rotationY ?? 0].every(Number.isFinite)) {
    return {
      Left: 0,
      Right: 0,
      DataComplete: false
    };
  }

  //====================================================================
  // Helpers
  //====================================================================

  const distance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const normalizeRotation = (rotation: number): number => {
    const normalized = ((rotation % 360) + 360) % 360;
    return Math.round(normalized / 90) * 90 % 360;
  };

  const rotation = normalizeRotation(articlePosition.rotationY ?? 0);

  const cardinalDirection =
    rotation === 0 ? { x: 1, y: 0 } :
    rotation === 90 ? { x: 0, y: 1 } :
    rotation === 180 ? { x: -1, y: 0 } :
    { x: 0, y: -1 };

  // Room contours use (x, -z). Positive group rotation therefore turns
  // the assembly direction toward positive contour y.
  const angle = (articlePosition.rotationY ?? 0) * Math.PI / 180;
  const direction = alignToAssemblyDirection
    ? { x: Math.cos(angle), y: Math.sin(angle) }
    : cardinalDirection;

  //====================================================================
  // Find the best matching wall
  //====================================================================

  let bestWall: any = undefined;
  let bestDistance = Number.MAX_VALUE;
  const groupX = alignToAssemblyDirection ? (articlePosition.x ?? 0) : Math.round(articlePosition.x ?? 0);
  const groupY = alignToAssemblyDirection ? -(articlePosition.z ?? 0) : Math.round((articlePosition.z ?? 0) * -1);

  for (const level of roomData.levels) {

    const segments = level?.segments ?? [];

    for (let i = 1; i < segments.length; i++) {

      const start = segments[i - 1];
      const end = segments[i];

      if (end.type !== 'wall' || ![start.x, start.y, end.x, end.y].every(Number.isFinite)) {
        continue;
      }

      const dx = end.x - start.x;
      const dy = end.y - start.y;

      // Only walls parallel to the group
      const cross = Math.abs(dx * direction.y - dy * direction.x);
      const length = Math.hypot(dx, dy);
      if (alignToAssemblyDirection ? cross > length * 0.000001 : cross > 1) {
        continue;
      }

      const lengthSq = dx * dx + dy * dy;
      if (lengthSq <= 0) {
        continue;
      }

      const t = Math.max(0, Math.min(1,
        ((groupX - start.x) * dx +
        (groupY - start.y) * dy) / lengthSq
      ));

      const projX = start.x + t * dx;
      const projY = start.y + t * dy;

      const dist = distance(
        groupX,
        groupY,
        projX,
        projY
      );

      if (dist < bestDistance) {
        bestDistance = dist;
        bestWall = {
          start,
          end,
          length: Math.sqrt(lengthSq),
          index: i
        };
      }
    }
  }

  //====================================================================
  // No wall found
  //====================================================================

  if (!bestWall) {
    return {
      Left: 0,
      Right: 0,
      DataComplete: false
    };
  }

  //====================================================================
  // Position on wall
  //====================================================================

  // Keep the existing endpoint convention for UseWallWidth. Full-wall mode
  // orients the wall along the group, independent of contour vertex order.
  const forward = (bestWall.end.x - bestWall.start.x) * direction.x +
    (bestWall.end.y - bestWall.start.y) * direction.y;
  const useStoredDirection = alignToAssemblyDirection && forward > 0;
  const wallStart = useStoredDirection ? bestWall.start : bestWall.end;
  const wallEnd = useStoredDirection ? bestWall.end : bestWall.start;

  const wallDx = wallEnd.x - wallStart.x;
  const wallDy = wallEnd.y - wallStart.y;
  const wallLengthSq = wallDx * wallDx + wallDy * wallDy;

  if (wallLengthSq <= 0) {
    return {
      Left: 0,
      Right: 0,
      DataComplete: false
    };
  }

  const wallLength = Math.sqrt(wallLengthSq);

  // Position der Gruppe entlang der gedrehten Wandrichtung
  const t = ((groupX - wallStart.x) * wallDx + (groupY - wallStart.y) * wallDy) / wallLengthSq;
  const positionOnWall = t * wallLength;

  const leftSpace = positionOnWall;
  const rightSpace = wallLength - positionOnWall - groupWidth;

  let debug = '';
  debug += 'SELECTED WALL\n';
  debug += 'start x=' + bestWall.start.x + ', y=' + bestWall.start.y + '\n';
  debug += 'end   x=' + bestWall.end.x + ', y=' + bestWall.end.y + '\n';
  debug += 'length=' + bestWall.length + '\n';
  debug += 'bestDistance=' + bestDistance + '\n\n';

  debug += 'POSITION ON WALL\n';
  debug += 'groupPosX=' + groupX + '\n';
  debug += 'groupPosY=' + groupY + '\n';
  debug += 'groupWidth=' + groupWidth + '\n';
  debug += 'rotation=' + rotation + '\n';
  debug += 'left=' + leftSpace + '\n';
  debug += 'right=' + rightSpace + '\n';

  console.group("Group Context");
  console.log(debug);
  console.groupEnd();

  return {
    Left: Math.max(0, leftSpace),
    Right: Math.max(0, rightSpace),
    DataComplete: true,
    WallLength: wallLength,
    PositionOnWall: positionOnWall,
    DirectionX: wallDx / wallLength,
    DirectionZ: -wallDy / wallLength
  };

}