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
    let Text = '${color}'
    const ErrorMessage = GlobalFunc.find_ErrorList("Error 13008", 1);
    logError(ErrorMessage.Message(Text));
  }

  // Get all boards based on the mapping
  for (const m of mappings) {
    const materialCode = m.BoardId;
    if (!materialCode) continue;

    const libs = ct_tab_BoardLibrary.filter(b => b.in_MaterialCode === materialCode);
    if (libs.length === 0) {
      let Text = 'materialCode: ' + '${materialCode}' + 'color: ' + '${color}';
      const ErrorMessage = GlobalFunc.find_ErrorList("Error 13009", 1);
      logError(ErrorMessage.Message(Text));
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
        let Text = 'materialCode: ' + '${m.BoardId}';
        const ErrorMessage = GlobalFunc.find_ErrorList("Error 13010", 1);
        logError(ErrorMessage.Message(Text));
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