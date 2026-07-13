check_checkABC_getDropDownValues_A(attr: Checks.IcheckABC_Attributes, selections: SelectionEntry_A[]): Checks.CheckDropDownEntry[]{
  if (attr.B === 'B1') {
    return [{ value: selections[0].value, kind: Checks.CheckDropDownEntryKind.Normal }]; // A1 normal
  }
  return [{ value: selections[1].value, kind: Checks.CheckDropDownEntryKind.Normal }]; // A2 normal
}