check_TypeBoardDimensions_getDropDownValues_mod_Program(attr: Checks.ITypeBoardDimensions_Attributes, selections: SelectionEntry_mod_Program[]): Checks.CheckDropDownEntry[]{
 if (GlobalFunc.allPropertiesDefined(attr)) {
    const result: Checks.CheckDropDownEntry[] = [];

    const ProgramMatches = ct_ctab_BoardDimensionSettings.filter(x => x.in_TypeElement === attr.mod_TypeElement);
    const matches = ct_ctab_BoardDimensionSettings.filter(x => x.in_TypeElement === attr.mod_TypeElement && x.in_TopColor === attr.mod_Color &&  x.in_BtmColor === attr.mod_BtmColor && x.in_Grain === attr.mod_PartGrain && x.in_PartThk === attr.mod_Thickness)
    for (const selection of selections) {

      const isProgramMatches = ProgramMatches.find(m => m.in_Program === (selection.value)) !== undefined;
      if (!isProgramMatches) {
        result.push({ value: selection.value, kind: Checks.CheckDropDownEntryKind.Invalid });
        continue
      }
      // Search for more values
        const isMatched = matches.find(m => m.in_Program === selection.value) !== undefined;
        // here we do invalid, to make sure other colors do not appear. once we start hiding attributes, maybe this can be rethought
      result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal:true });
    }
    return result;
  }

  let matches = ct_ctab_BoardDimensionSettings;
    if (attr.mod_TypeElement !== undefined) {
    matches = matches.filter(x => x.in_TypeElement === attr.mod_TypeElement);
  }
  if (attr.mod_Color !== undefined) {
    matches = matches.filter(x => x.in_TopColor === attr.mod_Color);
  }
  if (attr.mod_BtmColor !== undefined) {
    matches = matches.filter(x => x.in_BtmColor === attr.mod_BtmColor);
  }
  if (attr.mod_PartGrain !== undefined) {
    matches = matches.filter(x => x.in_Grain === attr.mod_PartGrain);
  }
  if (attr.mod_Thickness !== undefined) {
    matches = matches.filter(x => x.in_PartThk === attr.mod_Thickness);
  }

  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
    const isMatched = matches.find(m => m.in_Program === selection.value) !== undefined;
    result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }
  return result;
}