check_AB_getDropDownValues_B(attr: Checks.IAB_Attributes, selections: SelectionEntry_B[]): Checks.CheckDropDownEntry[]{
    if (attr.A === 'A1') {
        return [
            { value: selections[0].value, kind: Checks.CheckDropDownEntryKind.Normal }, 
            { value: selections[1].value, kind: Checks.CheckDropDownEntryKind.Invalid }, 
            { value: selections[2].value, kind: Checks.CheckDropDownEntryKind.Invalid }, 
        ]
    }
    return [
        { value: selections[0].value, kind: Checks.CheckDropDownEntryKind.Invalid }, 
        { value: selections[1].value, kind: Checks.CheckDropDownEntryKind.Normal }, 
        { value: selections[2].value, kind: Checks.CheckDropDownEntryKind.Invalid }, 
    ]
}