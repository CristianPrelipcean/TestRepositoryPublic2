check_test_getDropDownValues_corpusColor(attr: Checks.Itest_Attributes, selections: SelectionEntry_corpusColor[]): Checks.CheckDropDownEntry[]{
    return [
        { value: selections[0].value, kind: Checks.CheckDropDownEntryKind.Normal }, // appears as "without dependencies"
        { value: selections[1].value, kind: Checks.CheckDropDownEntryKind.Normal, showAsNormal: true }, // appears as "without dependencies", not affected by flag
        { value: selections[2].value, kind: Checks.CheckDropDownEntryKind.Conflicting }, // appears as "with dependencies"
        { value: selections[3].value, kind: Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true }, // appears as "without dependencies". When corpusColor is changed to this value, the solve algorithm is triggered
        // { value: selections[4].value, kind: Checks.CheckDropDownEntryKind.Invalid }, // is invalid, is not provided as an option
        // { value: selections[5].value, kind: Checks.CheckDropDownEntryKind.Invalid, showAsNormal: true }, // is invalid, not affected by the flag, is not provided as an option
    ];
}