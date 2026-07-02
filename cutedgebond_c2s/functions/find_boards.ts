find_Boards(color: string): Array<{
  materialCode: string;
  thickness: number;
  minThickness: number;
  maxThickness: number;
  density: number;
  grain: string;
  length: number;
  width: number
}> {

  const results: Array<{
    materialCode: string;
    thickness: number;
    minThickness: number;
    maxThickness: number;
    density: number;
    grain: string;
    length: number;
    width: number;
  }> = [];

  // Map all the possible boards of this color
  const mappings = ct_tab_BoardMapping.filter(m => m.in_Color === color);

  if (mappings.length === 0) {
    logWarning(`ops_FindBoards: No BoardMapping for color='${color}'`);
    return [];
  }

  // Get all boards based on the mapping
  for (const m of mappings) {
    const materialCode = m.BoardId;
    if (!materialCode) continue;

    const libs = ct_tab_BoardLibrary.filter(b => b.in_MaterialCode === materialCode);
    if (libs.length === 0) {
      logWarning(`ops_FindBoards: No BoardLibrary entries for materialCode='${materialCode}' (color='${color}')`);
      continue;
    }

    for (const lib of libs) {

      if (
          lib.in_MaterialCode === undefined ||
          lib.Thickness === undefined ||
          lib.Density === undefined ||
          lib.Grain === undefined ||
          lib.Length === undefined ||
          lib.Width === undefined
      ) {
          logError(`BoardLibrary entry incomplete for materialCode='${m.BoardId}'`);
          continue;
      }

      results.push({
          materialCode: lib.in_MaterialCode,
          thickness: lib.Thickness,
          minThickness: m.in_ThkMin,
          maxThickness: m.in_ThkMax,
          density: lib.Density,
          grain: lib.Grain,
          length: lib.Length,
          width: lib.Width,
      });
    }
    
  }

  // Sorting
  const out = Array.from(results.values());
  out.sort((a, b) => a.thickness - b.thickness);

  return out;
}