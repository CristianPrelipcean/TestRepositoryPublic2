process_StorageunitColumnGeometry(m: any, context: any, width: number, depth: number, movement: number = 0, bounds: any = null){
    // HOMAG Digital
    // Create: October 2026
    // By Ludwig Weber
    // Purpose: CabinetLibrary

    // Description:
    // process_StorageunitColumnGeometry implements the cabinet column-wrap feature.

    // Revisions:
// 2026-11-04 | Ludwig Weber | Translate diagnostic stages and explanatory messages into English.
    // 2026-11-03 | Ludwig Weber | Integrate r10 with the current live library.

    //======================================================================
    // Column-wrap calculation
    //======================================================================
    const EPS = 0.001;
    type Rect = { X0: number; X1: number; Z0: number; Z1: number };
    type Part = {
        Role: string;
        Side: string;
        X: number;
        Y: number;
        Z: number;
        Width: number;
        Height: number;
        Depth: number;
    };
    type Region = { Id: string; X0: number; X1: number };
    const result = {
        Version: 1,
        IsComplete: true,
        Errors: [] as string[],
        Class: 'None',
        PlanningDepth: depth,
        EffectiveDepth: depth,
        RearOffset: 0,
        ClearanceRect: undefined as Rect | undefined,
        CutRect: undefined as Rect | undefined,
        SolidShelfExclusion: undefined as Rect | undefined,
        AdjustableShelfExclusion: undefined as Rect | undefined,
        Parts: [] as Part[],
        BackwallRegions: [] as Region[],
        MinDepth: 0,
        MinWeb: 0,
        MinBackwall: 0,
        GapSide: 0,
        GapFront: 0,
        LeftThickness: 0,
        RightThickness: 0,
        PanelThickness: 0,
        Reasons: [] as string[],
        Checks: { LeftRest: 0, RightRest: 0, LeftBackwalls: [] as number[], RightBackwalls: [] as number[] },
    };
    const standardGeometry = JSON.stringify(result);
    function fail(message: string) {
        return JSON.parse(standardGeometry);
    }
    try {
    if (!context || context.Version !== 1 || context.IsComplete !== true)
        return fail('Context is incomplete.');
    if (context.HasIntersection !== true) return result;
    if (![width, depth, movement].every(Number.isFinite) || width <= 0 || depth <= 0)
        return fail('Carcase frame is invalid.');
    const settings = [
        m.mod_ColumnGapSide,
        m.mod_ColumnGapFront,
        m.mod_ColumnMinRemainingDepth,
        m.mod_ColumnMinWebWidth,
        m.mod_ColumnMinBackwallWidth,
    ];
    if (!settings.every((v: number) => Number.isFinite(v) && v >= 0))
        return fail('Installation clearances or minimum dimensions are invalid.');
    const [gs, gf, minDepth, minWeb, minBackwall] = settings;
    result.GapSide = gs;
    result.GapFront = gf;
    result.MinDepth = minDepth;
    result.MinWeb = minWeb;
    result.MinBackwall = minBackwall;
    const raw = context.RawRect;
    if (
        !raw ||
        ![raw.X0, raw.X1, raw.Z0, raw.Z1].every(Number.isFinite) ||
        raw.X1 <= raw.X0 ||
        raw.Z1 <= raw.Z0
    )
        return fail('Detected intersection has no valid area.');
    if (Math.abs(raw.Z0) > EPS) return fail('Detected intrusion is not open at the rear of the carcase.');
    const xL = Math.max(0, raw.X0 - movement - gs);
    const xR = Math.min(width, raw.X1 - movement + gs);
    const d = raw.Z1 + gf;
    if (xR <= xL + EPS || d <= EPS)
        return fail('Detected intrusion is lost during coordinate transfer.');
    if (d >= depth - EPS)
        return fail(
            'Intrusion including installation clearance reaches the front edge: ' + d + ' mm at ' + depth + ' mm depth.',
        );
    result.ClearanceRect = { X0: xL, X1: xR, Z0: 0, Z1: d };
    function fullWidth(reason: string) {
        result.Class = 'FullWidth';
        result.EffectiveDepth = depth - d;
        result.RearOffset = d;
        result.CutRect = undefined;
        result.SolidShelfExclusion = undefined;
        result.AdjustableShelfExclusion = undefined;
        result.Parts = [];
        result.BackwallRegions = [];
        result.Reasons.push(reason);
        if (result.EffectiveDepth < minDepth - EPS)
            return fail(
                'Full-width adaptation is also invalid. Remaining depth: ' +
                    result.EffectiveDepth +
                    ' mm; minimum remaining depth: ' +
                    minDepth +
                    ' mm.',
            );
        return result;
    }
    let keepLeft = xL >= 100 - EPS;
    let keepRight = width - xR >= 100 - EPS;
    if (!keepLeft) result.Reasons.push('Left clearance ' + xL + ' mm is less than 100 mm.');
    if (!keepRight) result.Reasons.push('Right clearance ' + (width - xR) + ' mm is less than 100 mm.');
    if (!keepLeft && !keepRight) return fullWidth('Both remaining side regions are omitted.');
    const tL = m.mod_SidepanelrightThk,
        tR = m.mod_SidepanelleftThk,
        p = m.mod_PanelblindThk;
    if (![tL, tR, p].every((v: number) => Number.isFinite(v) && v > 0))
        return fail('Internal panel thicknesses are invalid.');
    result.LeftThickness = tL;
    result.RightThickness = tR;
    result.PanelThickness = p;
    const innerL = bounds ? bounds.X0 : m.mod_SidepanelleftThk;
    const innerR = bounds ? bounds.X1 : width - m.mod_SidepanelrightThk;
    const yb = bounds ? bounds.Y0 : m.mod_ShelfbtmThk;
    const yt = bounds ? bounds.Y1 : m.mod_CarcaseHeight - m.mod_ShelftopThk;
    const backZ = bounds ? bounds.BackZ : 0;
    if (![innerL, innerR, yb, yt, backZ].every(Number.isFinite) || innerR <= innerL || yt <= yb)
        return fail('Calculated internal dimensions of the standard carcase are invalid.');
    const leftReturnX = xL - tL;
    const rightReturnEnd = xR + tR;
    const leftRest = leftReturnX - innerL;
    const rightRest = innerR - rightReturnEnd;
    result.Checks.LeftRest = leftRest;
    result.Checks.RightRest = rightRest;
    // The final plan may provide the already resolved vertical sections.
    // Without this list, evaluate the module standard backwall construction.
    function backwallWidths(side: string, clearWidth: number): number[] {
        const supplied = side === 'Left' ? bounds?.LeftBackwallWidths : bounds?.RightBackwallWidths;
        if (supplied !== undefined) {
            if (!Array.isArray(supplied) || !supplied.every((v: number) => Number.isFinite(v) && v >= 0))
                throw new Error('Invalid calculated backwall widths for ' + side + '.');
            return supplied.slice();
        }
        const sections = bounds?.BackwallSections ?? [
            {
                Construction: m.mod_CarcaseBackwallConstruction,
                Position: m.mod_BackwallPos,
                Thickness: m.mod_BackwallThk,
                PartBottom: 'ShelfBtm',
                PartTop: 'ShelfTop',
                Height: yt - yb,
            },
        ];
        if (!Array.isArray(sections)) throw new Error('Backwall sections are invalid.');
        const widths: number[] = [];
        for (const section of sections) {
            if (section.Construction === 'NoBackwall') continue;
            if (
                typeof section.Construction !== 'string' ||
                !section.Construction ||
                ![section.Position, section.Thickness, section.Height].every(Number.isFinite) ||
                typeof section.PartBottom !== 'string' ||
                typeof section.PartTop !== 'string'
            )
                throw new Error('Backwall section is not fully resolved.');
            const row = GlobalFunc.find_BackwallConstruction(
                section.Construction,
                'LeftSidePanel',
                section.PartBottom,
                'RightSidePanel',
                section.PartTop,
                m.mod_CarcaseVisBack,
            );
            if (!row)
                throw new Error('No standard backwall construction for ' + section.Construction + '.');
            const actualWidth = row.Width(m, clearWidth, section.Height, section.Position, section.Thickness);
            if (!Number.isFinite(actualWidth) || actualWidth < 0)
                throw new Error('Backwall calculation does not return a valid width.');
            widths.push(actualWidth);
        }
        return widths;
    }
    function sideAllowed(side: string, rest: number): boolean {
        if (rest <= EPS || rest < minWeb - EPS) {
            result.Reasons.push(
                side + ': remaining region ' + rest + ' mm is below the minimum web width of ' + minWeb + ' mm.',
            );
            return false;
        }
        const widths = backwallWidths(side, rest);
        if (side === 'Left') result.Checks.LeftBackwalls = widths;
        else result.Checks.RightBackwalls = widths;
        const invalid = widths.find((value: number) => value <= EPS || value < minBackwall - EPS);
        if (invalid !== undefined) {
            result.Reasons.push(
                side +
                    ': backwall width ' +
                    invalid +
                    ' mm is below the minimum width of ' +
                    minBackwall +
                    ' mm.',
            );
            return false;
        }
        return true;
    }
    try {
        if (keepLeft) keepLeft = sideAllowed('Left', leftRest);
        if (keepRight) keepRight = sideAllowed('Right', rightRest);
    } catch (error: unknown) {
        return fail(error instanceof Error ? error.message : String(error));
    }
    if (!keepLeft && !keepRight)
        return fullWidth('No sufficiently large remaining side region is available.');
    const localDepth = depth - d - p;
    if (localDepth < minDepth - EPS || localDepth < minWeb - EPS || d <= backZ + EPS) {
        return fullWidth(
            'Local adaptation is invalid; remaining depth ' +
                localDepth +
                ' mm, minimum remaining depth ' +
                minDepth +
                ' mm, minimum web width ' +
                minWeb +
                ' mm.',
        );
    }
    result.Class = keepLeft ? (keepRight ? 'Middle' : 'Right') : 'Left';
    const cut: Rect = { X0: keepLeft ? xL : 0, X1: keepRight ? xR : width, Z0: 0, Z1: d };
    result.CutRect = cut;
    result.SolidShelfExclusion = cut;
    let panelL = innerL,
        panelR = innerR;
    if (keepLeft) {
        panelL = leftReturnX;
        result.Parts.push({
            Role: 'ReturnLeft',
            Side: 'Right',
            X: panelL,
            Y: yb,
            Z: backZ,
            Width: tL,
            Height: yt - yb,
            Depth: d - backZ,
        });
        result.BackwallRegions.push({ Id: 'Left', X0: innerL, X1: panelL });
    }
    if (keepRight) {
        panelR = rightReturnEnd;
        result.Parts.push({
            Role: 'ReturnRight',
            Side: 'Left',
            X: xR,
            Y: yb,
            Z: backZ,
            Width: tR,
            Height: yt - yb,
            Depth: d - backZ,
        });
        result.BackwallRegions.push({ Id: 'Right', X0: panelR, X1: innerR });
    }
    if (panelR <= panelL + EPS) return fullWidth('No positive width is available for the blind panel.');
    result.Parts.push({
        Role: 'FrontPanel',
        Side: '',
        X: panelL,
        Y: yb,
        Z: d,
        Width: panelR - panelL,
        Height: yt - yb,
        Depth: p,
    });
    result.AdjustableShelfExclusion = {
        X0: keepLeft ? panelL : 0,
        X1: keepRight ? panelR : width,
        Z0: 0,
        Z1: d + p,
    };
    return result;
    } catch {
        return JSON.parse(standardGeometry);
    }
}
