generatePositionNumbers(item: OM.Base, g: IGlobalVars): void {
  function formatPositionNumber(num: number): string {
    return (g.basicPositionNumberPrefix ?? '') +
      Intl.NumberFormat("en-us",
        { maximumFractionDigits: 0, minimumIntegerDigits: g.basicPositionNumberMinDigits, useGrouping: false }
      ).format(num);
  }

  let currentPositionNumber = g.basicPositionNumberStartFrom;
  let groups = GlobalFunc.getAllGroups(item);
  for (const grp of groups) {
    const positions = GlobalFunc.getAllPositions(grp);

    // check if we have already the BOM data present...
    for (const pos of positions) {
      if (pos.isHidden === true) {
        // Skip hidden positions
        continue;
      }

      // Set position number (for all position types)
      pos.name = formatPositionNumber(currentPositionNumber);
      pos.positionNumber = pos.name;
      currentPositionNumber += g.basicPositionNumberStep;
    }
  }
}