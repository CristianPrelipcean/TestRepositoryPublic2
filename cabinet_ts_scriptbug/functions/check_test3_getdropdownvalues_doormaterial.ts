check_test3_getDropDownValues_doorMaterial(attr: Checks.Itest3_Attributes, selections: SelectionEntry_doorMaterial[]): Checks.CheckDropDownEntry[]{
type MaterialConstraint = { min: number; max: number };

    function isInRange(x: number, constraint: MaterialConstraint): boolean {
        return constraint.min <= x && x <= constraint.max;
    }

    const heightConstraints = new Map<string, MaterialConstraint>([
        ["wood",      { min: 2000, max: 3000 }],
        ["steel",     { min: 2000, max: 2500 }],
        ["glass",     { min: 1500, max: 2200 }],
        ["aluminium", { min: 2500, max: 3000 }],
    ]);

    const thicknessConstraints = new Map<string, MaterialConstraint>([
        ["wood",      { min: 16, max: 25 }],
        ["steel",     { min: 16, max: 19 }],
        ["glass",     { min: 6,  max: 16 }],
        ["aluminium", { min: 19, max: 25 }],
    ]);

    const result: Checks.CheckDropDownEntry[] = [];

    for (const selection of selections) {
        const key = selection.value ?? "";
        const heightConstraint = heightConstraints.get(key);
        const thicknessConstraint = thicknessConstraints.get(key);

        const heightOk = heightConstraint !== undefined
            && attr.doorHeight !== undefined
            && isInRange(attr.doorHeight, heightConstraint);

        const thicknessOk = thicknessConstraint !== undefined
            && attr.thickness !== undefined
            && isInRange(attr.thickness, thicknessConstraint);

        const maxHeightToThicknessRatio = 200;
        const ratioOk = attr.thickness !== undefined && attr.doorHeight !== undefined
            && (attr.doorHeight / attr.thickness) <= maxHeightToThicknessRatio;

        const kind = (heightOk && thicknessOk && ratioOk)
            ? Checks.CheckDropDownEntryKind.Normal
            : Checks.CheckDropDownEntryKind.Conflicting;

        result.push({ value: selection.value, kind });
    }

    return result;
}