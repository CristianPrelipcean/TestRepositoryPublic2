check_doorCheck_getDropDownValues_doorMaterial(attr: Checks.IdoorCheck_Attributes, selections: SelectionEntry_doorMaterial[]): Checks.CheckDropDownEntry[]{
    type MaterialConstraint = { min: number; max: number };

    function isInRange(x: number, constraint: MaterialConstraint): boolean {
        return constraint.min <= x && x <= constraint.max;
    }

    const widthConstraints = new Map<string, MaterialConstraint>([
        ["wood", { min: 1000, max: 2000 }],
        ["steel", { min: 1000, max: 1500 }],
        ["glass", { min: 500, max: 1200 }],
        ["aluminium", { min: 1500, max: 2000 }],
    ]);

    const heightConstraints = new Map<string, MaterialConstraint>([
        ["wood", { min: 2000, max: 3000 }],
        ["steel", { min: 2000, max: 2500 }],
        ["glass", { min: 1500, max: 2200 }],
        ["aluminium", { min: 2500, max: 3000 }],
    ]);

    const result: Checks.CheckDropDownEntry[] = [];

    for (const selection of selections) {
        const key = selection.value ?? "";
        const widthConstraint = widthConstraints.get(key);
        const heightConstraint = heightConstraints.get(key);

        const widthOk = widthConstraint !== undefined
            && attr.doorWidth !== undefined
            && isInRange(attr.doorWidth, widthConstraint);

        const heightOk = heightConstraint !== undefined
            && attr.doorHeight !== undefined
            && isInRange(attr.doorHeight, heightConstraint);

        const maxHeightToWidthRatio = 2;
        const ratioOk = attr.doorWidth !== undefined && attr.doorHeight !== undefined
            && (attr.doorHeight / attr.doorWidth) <= maxHeightToWidthRatio;

        const kind = (widthOk && heightOk && ratioOk)
            ? Checks.CheckDropDownEntryKind.Normal
            : Checks.CheckDropDownEntryKind.Conflicting;

        result.push({ value: selection.value, kind });
    }

    return result;
}