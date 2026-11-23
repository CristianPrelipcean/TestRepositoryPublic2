process_StorageunitColumnPlan(root: any, carcase: any, context: any, width: number, depth: number, movement: number = 0){
    // HOMAG Digital
    // Create: October 2026
    // By Ludwig Weber
    // Purpose: CabinetLibrary

    // Description:
    // process_StorageunitColumnPlan implements the cabinet column-wrap feature.

    // Revisions:
// 2026-11-04 | Ludwig Weber | Translate diagnostic stages and explanatory messages into English.
    // 2026-11-03 | Ludwig Weber | Integrate r10 with the current live library.

    //======================================================================
    // Column-wrap calculation
    //======================================================================
    // Resolve the final construction without creating any real HI child module.
    const neutral = GlobalFunc.process_StorageunitColumnGeometry(
        root,
        { Version: 1, IsComplete: true, HasIntersection: false },
        width,
        depth,
        movement,
    );
    function fail(message: string) {
        (neutral as any).IsFinalPlan = true;
        return neutral;
    }
    if (!context || context.Version !== 1 || context.IsComplete !== true)
        return fail('Context is incomplete.');
    if (!context.HasIntersection) {
        (neutral as any).IsFinalPlan = true;
        return neutral;
    }
    const plan: any = { g: root.g };
    plan.mod_BackHeight = carcase.mod_BackHeight ?? root.mod_BackHeight;
    plan.mod_BackwallFixedHeight = root.mod_BackwallFixedHeight ?? carcase.mod_BackwallFixedHeight;
    plan.mod_BackwallPos = root.mod_BackwallPos ?? carcase.mod_BackwallPos;
    plan.mod_BackwallThk = root.mod_BackwallThk ?? carcase.mod_BackwallThk;
    plan.mod_CarcaseBackwallConstruction =
        root.mod_CarcaseBackwallConstruction ?? carcase.mod_CarcaseBackwallConstruction;
    plan.mod_CarcaseConnectionLeftBtm =
        root.mod_CarcaseConnectionLeftBtm ?? carcase.mod_CarcaseConnectionLeftBtm;
    plan.mod_CarcaseConnectionLeftTop =
        root.mod_CarcaseConnectionLeftTop ?? carcase.mod_CarcaseConnectionLeftTop;
    plan.mod_CarcaseConnectionRightBtm =
        root.mod_CarcaseConnectionRightBtm ?? carcase.mod_CarcaseConnectionRightBtm;
    plan.mod_CarcaseConnectionRightTop =
        root.mod_CarcaseConnectionRightTop ?? carcase.mod_CarcaseConnectionRightTop;
    plan.mod_CarcaseDepth = carcase.mod_CarcaseDepth ?? root.mod_CarcaseDepth;
    plan.mod_CarcaseFrontConstruction_matrix =
        root.mod_CarcaseFrontConstruction_matrix ?? carcase.mod_CarcaseFrontConstruction_matrix;
    plan.mod_CarcaseHeight = carcase.mod_CarcaseHeight ?? root.mod_CarcaseHeight;
    plan.mod_CarcaseShelfbtmConstruction =
        root.mod_CarcaseShelfbtmConstruction ?? carcase.mod_CarcaseShelfbtmConstruction;
    plan.mod_CarcaseShelfbtmOversizeLeft =
        root.mod_CarcaseShelfbtmOversizeLeft ?? carcase.mod_CarcaseShelfbtmOversizeLeft;
    plan.mod_CarcaseShelfbtmOversizeRight =
        root.mod_CarcaseShelfbtmOversizeRight ?? carcase.mod_CarcaseShelfbtmOversizeRight;
    plan.mod_CarcaseShelftopConstruction =
        root.mod_CarcaseShelftopConstruction ?? carcase.mod_CarcaseShelftopConstruction;
    plan.mod_CarcaseShelftopOversizeLeft =
        root.mod_CarcaseShelftopOversizeLeft ?? carcase.mod_CarcaseShelftopOversizeLeft;
    plan.mod_CarcaseShelftopOversizeRight =
        root.mod_CarcaseShelftopOversizeRight ?? carcase.mod_CarcaseShelftopOversizeRight;
    plan.mod_CarcaseSidepanelleftOversizeBtm =
        root.mod_CarcaseSidepanelleftOversizeBtm ?? carcase.mod_CarcaseSidepanelleftOversizeBtm;
    plan.mod_CarcaseSidepanelleftOversizeTop =
        root.mod_CarcaseSidepanelleftOversizeTop ?? carcase.mod_CarcaseSidepanelleftOversizeTop;
    plan.mod_CarcaseSidepanelrightOversizeBtm =
        root.mod_CarcaseSidepanelrightOversizeBtm ?? carcase.mod_CarcaseSidepanelrightOversizeBtm;
    plan.mod_CarcaseSidepanelrightOversizeTop =
        root.mod_CarcaseSidepanelrightOversizeTop ?? carcase.mod_CarcaseSidepanelrightOversizeTop;
    plan.mod_CarcaseVisBack = root.mod_CarcaseVisBack ?? carcase.mod_CarcaseVisBack;
    plan.mod_CarcaseVisBtm = root.mod_CarcaseVisBtm ?? carcase.mod_CarcaseVisBtm;
    plan.mod_CarcaseVisLeft = carcase.mod_CarcaseVisLeft ?? root.mod_CarcaseVisLeft;
    plan.mod_CarcaseVisRight = carcase.mod_CarcaseVisRight ?? root.mod_CarcaseVisRight;
    plan.mod_CarcaseVisTop = root.mod_CarcaseVisTop ?? carcase.mod_CarcaseVisTop;
    plan.mod_CarcaseWidth = carcase.mod_CarcaseWidth ?? root.mod_CarcaseWidth;
    plan.mod_ColumnGapFront = root.mod_ColumnGapFront ?? carcase.mod_ColumnGapFront;
    plan.mod_ColumnGapSide = root.mod_ColumnGapSide ?? carcase.mod_ColumnGapSide;
    plan.mod_ColumnMinBackwallWidth = root.mod_ColumnMinBackwallWidth ?? carcase.mod_ColumnMinBackwallWidth;
    plan.mod_ColumnMinRemainingDepth =
        root.mod_ColumnMinRemainingDepth ?? carcase.mod_ColumnMinRemainingDepth;
    plan.mod_ColumnMinWebWidth = root.mod_ColumnMinWebWidth ?? carcase.mod_ColumnMinWebWidth;
    plan.mod_FingergripTop = carcase.mod_FingergripTop ?? root.mod_FingergripTop;
    plan.mod_FingergripType_matrix = carcase.mod_FingergripType_matrix ?? root.mod_FingergripType_matrix;
    plan.mod_FrontAreaInfoList = carcase.mod_FrontAreaInfoList ?? root.mod_FrontAreaInfoList;
    plan.mod_HobHeightBlockedSpace = carcase.mod_HobHeightBlockedSpace ?? root.mod_HobHeightBlockedSpace;
    plan.mod_LastFrontHeight = carcase.mod_LastFrontHeight ?? root.mod_LastFrontHeight;
    plan.mod_LastFrontName = carcase.mod_LastFrontName ?? root.mod_LastFrontName;
    plan.mod_PanelblindThk = root.mod_PanelblindThk ?? carcase.mod_PanelblindThk;
    plan.mod_RailhortopbackThk = root.mod_RailhortopbackThk ?? carcase.mod_RailhortopbackThk;
    plan.mod_RailhortopfrontThk = root.mod_RailhortopfrontThk ?? carcase.mod_RailhortopfrontThk;
    plan.mod_RailverttopbackThk = root.mod_RailverttopbackThk ?? carcase.mod_RailverttopbackThk;
    plan.mod_RailverttopfrontThk = root.mod_RailverttopfrontThk ?? carcase.mod_RailverttopfrontThk;
    plan.mod_ShelfbtmThk = root.mod_ShelfbtmThk ?? carcase.mod_ShelfbtmThk;
    plan.mod_ShelffixedInfoList = carcase.mod_ShelffixedInfoList ?? root.mod_ShelffixedInfoList;
    plan.mod_ShelffixedThk = root.mod_ShelffixedThk ?? carcase.mod_ShelffixedThk;
    plan.mod_ShelftopThk = root.mod_ShelftopThk ?? carcase.mod_ShelftopThk;
    plan.mod_SidepanelleftThk = root.mod_SidepanelleftThk ?? carcase.mod_SidepanelleftThk;
    plan.mod_SidepanelleftType = carcase.mod_SidepanelleftType ?? root.mod_SidepanelleftType;
    plan.mod_SidepanelrightThk = root.mod_SidepanelrightThk ?? carcase.mod_SidepanelrightThk;
    plan.mod_SidepanelrightType = carcase.mod_SidepanelrightType ?? root.mod_SidepanelrightType;
    plan.mod_SlopeAngle = carcase.mod_SlopeAngle ?? root.mod_SlopeAngle;
    plan.mod_SlopedCeilingConstruction =
        root.mod_SlopedCeilingConstruction ?? carcase.mod_SlopedCeilingConstruction;
    plan.mod_TopDepth = carcase.mod_TopDepth ?? root.mod_TopDepth;
    plan.mod_CarcaseWidth = width;
    plan.mod_CarcaseDepth = depth;
    plan.mod_CarcaseMovement = movement;
    // Standard construction is measured with a neutral feature, including NoBackwall handling.
    plan.mod_ColumnWrapInfo = [
        JSON.stringify({ Version: 1, IsComplete: true, Class: 'None', MinBackwall: 0 }),
    ];
    const previews: { Type: string; Module: any }[] = [];
    function preview(type: string): any {
        const child: any = {
            mod_Originpos: [],
            Origin: [0, 0, 0],
            setOrigin(x: number, y: number, z: number) {
                this.Origin = [x, y, z];
            },
        };
        previews.push({ Type: type, Module: child });
        return child;
    }
    plan.addOD_M_mc_StorageunitSidepanel01 = () => preview('Side');
    plan.addOD_M_mc_StorageunitShelfbtm01 = () => preview('Bottom');
    plan.addOD_M_mc_StorageunitShelftop01 = () => preview('Top');
    plan.addOD_M_mc_StorageunitShelftop02 = () => preview('Top02');
    plan.addOD_M_mc_StorageunitShelftop03 = () => preview('Top03');
    plan.addOD_M_mc_StorageunitShelftop04 = () => preview('Top04');
    plan.addOD_M_mc_StorageunitShelffixed01 = () => preview('Fixed');
    plan.addOD_M_mc_StorageunitBackwall01 = () => preview('Backwall');
    try {
        const frontList: any[] = plan.mod_FrontAreaInfoList ?? [];
        const first = frontList.length ? JSON.parse(frontList[0]) : null;
        const last = frontList.length ? JSON.parse(frontList[frontList.length - 1]) : null;
        const firstConstruction = first?.BackwallConstruction ?? plan.mod_CarcaseBackwallConstruction;
        const firstPosition = first?.BackwallPosition ?? plan.mod_BackwallPos;
        const lastConstruction = last?.BackwallConstruction ?? plan.mod_CarcaseBackwallConstruction;
        const lastPosition = last?.BackwallPosition ?? plan.mod_BackwallPos;
        const left = JSON.parse(
            GlobalFunc.process_StorageunitSidepanelConstruction(
                plan,
                'Left',
                firstConstruction,
                firstPosition,
            ),
        );
        const right = JSON.parse(
            GlobalFunc.process_StorageunitSidepanelConstruction(
                plan,
                'Right',
                firstConstruction,
                firstPosition,
            ),
        );
        const bottom = JSON.parse(
            GlobalFunc.process_StorageunitShelfbtmConstruction(plan, firstConstruction, firstPosition),
        );
        const top = JSON.parse(
            GlobalFunc.process_StorageunitShelftopConstruction(plan, lastConstruction, lastPosition),
        );
        const fixed = GlobalFunc.process_StorageunitShelffixedConstruction(plan);
        const bounds = {
            X0: left.BwSp,
            X1: right.BwSp,
            Y0: bottom.BwBtm,
            Y1: top.BwTop,
            BackZ: Math.min(left.DepthPos, right.DepthPos),
            LeftBackwallWidths: [] as number[],
            RightBackwallWidths: [] as number[],
        };
        const gap = plan.mod_ColumnGapSide;
        if (!context.RawRect || !Number.isFinite(gap)) return fail('Intrusion or installation clearance is missing.');
        const xL = Math.max(0, context.RawRect.X0 - movement - gap);
        const xR = Math.min(width, context.RawRect.X1 - movement + gap);
        const leftEnd = xL - plan.mod_SidepanelrightThk;
        const rightStart = xR + plan.mod_SidepanelleftThk;
        function widths(x0: number, x1: number): number[] {
            if (x1 <= x0 + 0.001) return [0];
            const list = JSON.parse(
                GlobalFunc.process_StorageunitBackwallConstruction(
                    plan,
                    'LeftSidePanel',
                    'RightSidePanel',
                    bottom.BtmPart,
                    top.TopPart,
                    bounds.Y1 - bounds.Y0,
                    x1 - x0,
                    x0,
                    bounds.Y0,
                    fixed,
                ),
            );
            return list.map((entry: any) => entry.Width);
        }
        // Avoid irrelevant lookups for a side that the mandatory 100mm rule already removes.
        bounds.LeftBackwallWidths = xL >= 100 - 0.001 ? widths(bounds.X0, leftEnd) : [];
        bounds.RightBackwallWidths = width - xR >= 100 - 0.001 ? widths(rightStart, bounds.X1) : [];
        const final = GlobalFunc.process_StorageunitColumnGeometry(
            plan,
            context,
            width,
            depth,
            movement,
            bounds,
        );
        if (!final.IsComplete) return final;
        (final as any).IsFinalPlan = true;
        (final as any).PlanningBounds = bounds;
        (final as any).StandardParts = { Left: left, Right: right, Bottom: bottom, Top: top };
        return final;
    } catch (error: unknown) {
        return fail(error instanceof Error ? error.message : String(error));
    }
}
