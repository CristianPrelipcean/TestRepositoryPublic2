check_doorCheck_getDropDownValues_doorWidth(attr: Checks.IdoorCheck_Attributes): Checks.CheckDropDownRange | undefined{
    const widthConstraints = new Map<string, { min: number; max: number }>([
        ["wood", { min: 1000, max: 2000 }],
        ["steel", { min: 1000, max: 1500 }],
        ["glass", { min: 500, max: 1200 }],
        ["aluminium", { min: 1500, max: 2000 }],
    ]);

    const material = attr.doorMaterial ?? "";
    const widthConstraint = widthConstraints.get(material);

    if (widthConstraint === undefined) {
        return undefined;
    }

    let { min, max } = widthConstraint;

    // clamp min width by max height-to-width ratio
    const maxHeightToWidthRatio = 2;
    if (attr.doorHeight !== undefined && attr.doorHeight > 0) {
        const minWidthByRatio = Math.ceil(attr.doorHeight / maxHeightToWidthRatio);
        min = Math.max(min, minWidthByRatio);
    }

    if (min > max) {
        return undefined;
    }

    const result = { min, max };
    return result;
}