check_AB_getDropDownValues_A(attr: Checks.IAB_Attributes, selections: SelectionEntry_A[]): Checks.CheckDropDownEntry[]{
    return [
        {value: selections[0].value, kind: Checks.CheckDropDownEntryKind.Normal}, 
        {value: selections[1].value, kind: Checks.CheckDropDownEntryKind.Normal}, 
        {value: selections[2].value, kind: Checks.CheckDropDownEntryKind.Conflicting}, 
    ]
}