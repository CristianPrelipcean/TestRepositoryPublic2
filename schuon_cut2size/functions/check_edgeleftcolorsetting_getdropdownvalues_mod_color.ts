check_EdgeLeftColorSetting_getDropDownValues_mod_Color(attr: Checks.IEdgeLeftColorSetting_Attributes, selections: SelectionEntry_mod_Color[]): Checks.CheckDropDownEntry[]{
    if (GlobalFunc.allPropertiesDefined(attr)) {
        const result: Checks.CheckDropDownEntry[] = [];
        const matches = ct_ctab_EdgeColorSettings.filter(x => x.EdgeColor === attr.mod_EdgeLeftColor && x.in_Edgebanding === attr.mod_EdgeLeftClass);
        for (const selection of selections) {
            const isMatched = matches.find(m => m.in_BoardColor === selection.value) !== undefined;
            result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting, showAsNormal: true });
        }
        return result;
    }

    let matches = ct_ctab_EdgeColorSettings;
    if (attr.mod_EdgeLeftClass !== undefined) {
        matches = matches.filter(x => x.in_Edgebanding === attr.mod_EdgeLeftClass);
    }
    if (attr.mod_EdgeLeftColor !== undefined) {
      matches = matches.filter(x => x.EdgeColor === attr.mod_EdgeLeftColor);
    }

    const result: Checks.CheckDropDownEntry[] = [];
    for (const selection of selections) {
        const isMatched = matches.find(m => m.in_BoardColor === selection.value) !== undefined;
        result.push({ value: selection.value, kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting });
    }
    return result;
}