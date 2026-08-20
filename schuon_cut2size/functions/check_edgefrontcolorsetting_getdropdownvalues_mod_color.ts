check_EdgeFrontColorSetting_getDropDownValues_mod_Color(attr: Checks.IEdgeFrontColorSetting_Attributes, selections: SelectionEntry_mod_Color[]): Checks.CheckDropDownEntry[]{
    if (GlobalFunc.allPropertiesDefined(attr)) {
        const result: Checks.CheckDropDownEntry[] = [];
        const matches = ct_ctab_EdgeColorSettings.filter(x => x.EdgeColor === attr.mod_EdgeFrontColor && x.in_Edgebanding === attr.mod_EdgeFrontClass);
        for (const selection of selections) {
            const isMatched = matches.find(m => m.in_BoardColor === selection.value) !== undefined;
            result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
        }
        return result;
    }

    let matches = ct_ctab_EdgeColorSettings;
    if (attr.mod_EdgeFrontClass !== undefined) {
        matches = matches.filter(x => x.in_Edgebanding === attr.mod_EdgeFrontClass);
    }
    if (attr.mod_EdgeFrontColor !== undefined) {
      matches = matches.filter(x => x.EdgeColor === attr.mod_EdgeFrontColor);
    }

    const result: Checks.CheckDropDownEntry[] = [];
    for (const selection of selections) {
        const isMatched = matches.find(m => m.in_BoardColor === selection.value) !== undefined;
        result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
    }
    return result;
}