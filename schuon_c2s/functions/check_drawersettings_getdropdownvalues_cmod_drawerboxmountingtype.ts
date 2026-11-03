check_DrawerSettings_getDropDownValues_cmod_DrawerBoxMountingType(attr: Checks.IDrawerSettings_Attributes, selections: SelectionEntry_cmod_DrawerBoxMountingType[]): Checks.CheckDropDownEntry[]{
  if (GlobalFunc.allPropertiesDefined(attr)) {
    const result: Checks.CheckDropDownEntry[] = [];

    const DrawerBoxTypeMatches = ct_ctab_DrawerSettings.filter(x => x.in_DrawerType === attr.cmod_DrawerBoxType);
    const matches = ct_ctab_DrawerSettings.filter(x => x.in_DrawerType === attr.cmod_DrawerBoxType && x.in_DrawerHeight === attr.cmod_DrawerBoxHeight);
    for (const selection of selections) {
      const isDrawerBoxTypeMatched = DrawerBoxTypeMatches.find(m => m.in_DrawerBoxMountingType === selection.value) !== undefined;
      if (!isDrawerBoxTypeMatched)
      {
        result.push({ value: selection.value, kind: Checks.CheckDropDownEntryKind.Invalid });
        continue;
      }
      // if I reach this stage, it means that the supplier is matched. I am considering now if the in_HingeProgram is conflicting
      const isMatched = matches.find(m => m.in_DrawerBoxMountingType === selection.value) !== undefined;
      result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true});
    }
    return result;
  }

  let matches = ct_ctab_DrawerSettings;
  if (attr.cmod_DrawerBoxHeight !== undefined) {
    matches = matches.filter(x => x.in_DrawerHeight === attr.cmod_DrawerBoxHeight);
  }

  if (attr.cmod_DrawerBoxType !== undefined) {
    matches = matches.filter(x => x.in_DrawerType === attr.cmod_DrawerBoxType);
  }
  
  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
    const isMatched = matches.find(m => m.in_DrawerBoxMountingType === selection.value) !== undefined;
    // this is used for solving. the only reason to mark something as invalid is to not be shown as a suggestion.
    result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }
  return result;
}