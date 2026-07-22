check_DecorThickness_getDropDownValues_mod_Thickness(attr: Checks.IDecorThickness_Attributes, selections: SelectionEntry_mod_Thickness[]): Checks.CheckDropDownEntry[]{
     const mod_Color = attr.mod_Color;
    const toDropDownEntries = (thicknesses: Array<string | number>): Checks.CheckDropDownEntry[] =>
        thicknesses.map(thickness => ({
            kind: Checks.CheckDropDownEntryKind.Normal,
            value: thickness,
            label: thickness.toString()
        }));
    const getUniqueSortedThicknesses = (values: Array<string | number | undefined>): Array<string | number> =>
        [...new Set(values.filter((value): value is string | number => value !== undefined))]
            .sort((a, b) => Number(a) - Number(b));
    const allThicknesses = getUniqueSortedThicknesses(
        ct_tab_BoardLibrary.map(x => x.Thickness)
    );
    if (!mod_Color) {
        return toDropDownEntries(allThicknesses);
    }
    const boardIdsForSelectedDecor = new Set(
        ct_tab_BoardMapping
            .filter(x => x.in_Color === mod_Color && !!x.BoardId)
            .map(x => x.BoardId as string)
    );
    if (boardIdsForSelectedDecor.size === 0) {
        return [];
    }
    const thicknessesForSelectedDecor = getUniqueSortedThicknesses(
        ct_tab_BoardLibrary
            .filter(x => !!x.in_MaterialCode && boardIdsForSelectedDecor.has(x.in_MaterialCode))
            .map(x => x.Thickness)
    );
    return toDropDownEntries(thicknessesForSelectedDecor);

}