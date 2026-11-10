check_doorCheck_getDropDownValues_doorHeight(attr: Checks.IdoorCheck_Attributes): Checks.CheckDropDownRange | undefined{
    const heightConstraints = new Map<string, { min: number; max: number }>([
        ["wood", { min: 2000, max: 3000 }],
        ["steel", { min: 2000, max: 2500 }],
        ["glass", { min: 1500, max: 2200 }],
        ["aluminium", { min: 2500, max: 3000 }],
    ]);

    const material = attr.doorMaterial ?? "";
    const heightConstraint = heightConstraints.get(material);

    if (heightConstraint === undefined) {
        return undefined;
    }

    let { min, max } = heightConstraint;

    // clamp max height by max height-to-width ratio
    const maxHeightToWidthRatio = 2;
    if (attr.doorWidth !== undefined && attr.doorWidth > 0) {
        const maxHeightByRatio = Math.floor(attr.doorWidth * maxHeightToWidthRatio);
        max = Math.min(max, maxHeightByRatio);
    }

    if (min > max) {
        return undefined;
    }

    const result = { min, max };
    return result;
}