check_checkABC_getDropDownValues_B(attr: Checks.IcheckABC_Attributes, selections: SelectionEntry_B[]): Checks.CheckDropDownEntry[]{
 if (attr.A === 'A1') {
    return [{ value: selections[0].value, kind: Checks.CheckDropDownEntryKind.Normal }]; // B1 normal
  }
  return [{ value: selections[1].value, kind: Checks.CheckDropDownEntryKind.Normal }]; // B2 normal
}