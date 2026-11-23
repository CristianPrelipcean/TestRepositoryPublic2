process_StorageunitColumnShelfShape(info: any, x: number, z: number, width: number, depth: number, adjustable: boolean = false, gap: number = 0){
    // HOMAG Digital
    // Create: October 2026
    // By Ludwig Weber
    // Purpose: CabinetLibrary

    // Description:
    // process_StorageunitColumnShelfShape implements the cabinet column-wrap feature.

    // Revisions:
    // 2026-11-03 | Ludwig Weber | Integrate r10 with the current live library.

    //======================================================================
    // Column-wrap calculation
    //======================================================================
    const EPS = 0.001;
    if (!info || info.Version !== 1 || !info.IsComplete)
        throw new Error('Column wrap: invalid geometry passed to shelf.');
    if (info.Class === 'None' || info.Class === 'FullWidth') return '';
    const rect = adjustable ? info.AdjustableShelfExclusion : info.SolidShelfExclusion;
    if (!rect) throw new Error('Column wrap: shelf exclusion is missing.');
    if (![x, z, width, depth, gap].every(Number.isFinite) || width <= 0 || depth <= 0 || gap < 0)
        throw new Error('Column wrap: invalid shelf bounds.');
    const a = Math.max(0, rect.X0 - gap - x),
        b = Math.min(width, rect.X1 + gap - x),
        h = rect.Z1 + (adjustable ? gap : 0) - z;
    if (b <= a + EPS || h <= EPS || rect.Z0 > z + depth - EPS) return '';
    if (h >= depth - EPS)
        throw new Error('Column wrap: shelf is fully cut or split into disconnected pieces.');
    const left = a > EPS,
        right = b < width - EPS;
    if (!left && !right)
        throw new Error('Column wrap: shelf has no rear material; unsupported local full-width cut.');
    if (
        (left && a < info.MinWeb - EPS) ||
        (right && width - b < info.MinWeb - EPS) ||
        depth - h < info.MinWeb - EPS
    )
        throw new Error('Column wrap: shelf web below user minimum.');
    const f = (v: number) => String(Math.round(v * 1000000) / 1000000);
    if (!left)
        return `M 0 ${f(h)} L ${f(b)} ${f(h)} L ${f(b)} 0 L ${f(width)} 0 L ${f(width)} ${f(depth)} L 0 ${f(depth)} Z`;
    if (!right)
        return `M 0 0 L ${f(a)} 0 L ${f(a)} ${f(h)} L ${f(width)} ${f(h)} L ${f(width)} ${f(depth)} L 0 ${f(depth)} Z`;
    return `M 0 0 L ${f(a)} 0 L ${f(a)} ${f(h)} L ${f(b)} ${f(h)} L ${f(b)} 0 L ${f(width)} 0 L ${f(width)} ${f(depth)} L 0 ${f(depth)} Z`;
}
