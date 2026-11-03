check_DrawerSettings_getDropDownValues_cmod_DrawerBoxType(attr: Checks.IDrawerSettings_Attributes, selections: SelectionEntry_cmod_DrawerBoxType[]): Checks.CheckDropDownEntry[]{
if (GlobalFunc.allPropertiesDefined(attr)) {
    const result: Checks.CheckDropDownEntry[] = [];
    const matches = ct_ctab_DrawerSettings.filter(x => x.in_DrawerType === attr.cmod_DrawerBoxType && x.in_DrawerHeight === attr.cmod_DrawerBoxHeight && x.in_DrawerBoxMountingType === attr.cmod_DrawerBoxMountingType);
    for (const selection of selections) {
        const isMatched = matches.find(m => m.in_DrawerType === selection.value) !== undefined;
        // here we do invalid, to make sure other colors do not appear. once we start hiding attributes, maybe this can be rethought
        result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
    }

    return result;
  }

  let matches = ct_ctab_DrawerSettings;
  if (attr.cmod_DrawerBoxHeight !== undefined) {
    matches = matches.filter(x => x.in_DrawerHeight === attr.cmod_DrawerBoxHeight);
  }

  if (attr.cmod_DrawerBoxMountingType !== undefined) {
    matches = matches.filter(x => x.in_DrawerBoxMountingType === attr.cmod_DrawerBoxMountingType);
  }

  const result: Checks.CheckDropDownEntry[] = [];
  for (const selection of selections) {
    const isMatched = matches.find(m => m.in_DrawerType === selection.value) !== undefined;
    result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
  }
  return result;
}