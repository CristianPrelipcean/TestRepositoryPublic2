getMaterialAndProcessingPosition(item?: OM.Base): OM.Position | undefined {
    const positions: OM.Position[] = [];
    function traverse(item2?: OM.Base) {
      if (item2 instanceof OM.Position && item2.positionType === OM.PositionTypeEnum.MaterialAndProcessing) {
        positions.push(item2);
        return;  // We do not have positions inside positions
      }
      if (item2?.items) {
        for (const child of item2.items) {
          traverse(child);
        }
      }
    }
    traverse(item);
    if (positions.length > 0) {
      return positions[0];
    }
    return undefined;
  }