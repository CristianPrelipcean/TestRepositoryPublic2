getAllPositions(item?: OM.Base): OM.Position[] {
    const positions: OM.Position[] = [];
    function traverse(item2?: OM.Base) {
      if (item2 instanceof OM.Position || item2 instanceof OM.ConfigurationPosition) {
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
    return positions;
  }