check_DecorThickness_getDropDownValues_mod_Color(attr: Checks.IDecorThickness_Attributes, selections: SelectionEntry_mod_Color[]): Checks.CheckDropDownEntry[]{
   
    const mod_Thickness = attr.mod_Thickness;
    const toDropDownEntries = (colors: string[]): Checks.CheckDropDownEntry[] =>
        colors.map(color => ({
            kind: Checks.CheckDropDownEntryKind.Normal,
            value: color,
            label: color
        }));
    const allColors = [
        ...new Set(
            ct_tab_BoardMapping
                .map(x => x.in_Color)
                .filter((color): color is string => !!color)
        )
    ];
    if (mod_Thickness === undefined) {
        return toDropDownEntries(allColors);
    }
    const colorsForSelectedThickness = [
        ...new Set(
            ct_tab_BoardMapping
                .filter(x => x.in_Color && mod_Thickness >= x.in_ThkMin && mod_Thickness <= x.in_ThkMax)
                .map(x => x.in_Color as string)
        )
    ];
    return toDropDownEntries(colorsForSelectedThickness);

}