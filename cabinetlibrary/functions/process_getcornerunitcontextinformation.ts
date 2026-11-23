process_GetCornerunitContextInformation(sourceModule: any): {
    ContextVersion: number;
    SideCoverageComplete: boolean;
    SideCoverageLeft: {
        HeightFrom: number;
        HeightTo: number;
        DepthFrom: number;
        DepthTo: number;
    }[];
    SideCoverageRight: {
        HeightFrom: number;
        HeightTo: number;
        DepthFrom: number;
        DepthTo: number;
    }[];
    NeedsVisibleSideLeft: boolean;
    NeedsVisibleSideRight: boolean;
    ReturnPlinthLeft: boolean;
    ReturnPlinthRight: boolean;
    ReturnCeilingFillerLeft: boolean;
    ReturnCeilingFillerRight: boolean;
    DistanceWallLeft: number;
    DistanceWallRight: number;
    DistanceWallBack: number;
    DistanceCeiling: number;
    FirstElement: boolean;
    LastElement: boolean;
    HasDockingLeft: boolean;
    HasDockingRight: boolean;
    HeightPosition: number;
    SlopedCeiling: boolean;
    SlopedCeilingDirection: 'toLeft' | 'toRight' | 'toBack' | null;
    SlopedCeilingAngle: number;
    SlopedCeilingLevel: number;
    DataComplete: boolean;
    SuggestedDirection: 'Left' | 'Right' | null;
    HasCeilingInformation: boolean;
}// HOMAG Digital
// Create: November 2026
// By Ludwig Weber
// Purpose: CabinetLibrary

// Description:
// Reuses room and docking context for mr_CornerunitStraight.
// Measures actual wall segments in cabinet coordinates and suggests a unique corner direction.
// Preserves placed geometry with existing dockings and accepts missing room data.

// Revisions:
// 2026-11-02 | Ludwig Weber | Add standalone Cornerunit context, height and direction-dependent side completion.

//======================================================================

//======================================================================
// process_GetCornerunitContextInformation
//======================================================================
{
    //======================================================================
    // Read the shared room and docking context
    //======================================================================
    const ownContext = sourceModule?.getContextModule(sourceModule._id);
    const configuredDirection = sourceModule?.mod_CarcaseDirectionSelection;
    const direction =
        configuredDirection === 'Left' || configuredDirection === 'Right'
            ? configuredDirection
            : sourceModule?.mod_CarcaseDirection;
    const sideDockings = (ownContext?._contextData?.dockedRoots ?? [])
        .filter((docking: { ownDockingVector: Dock }) =>
            direction === 'Left'
                ? docking.ownDockingVector === Dock.RightBottom || docking.ownDockingVector === Dock.RightTop
                : docking.ownDockingVector === Dock.LeftBottom || docking.ownDockingVector === Dock.LeftTop,
        )
        .flatMap((docking: { ownDockingVector: Dock; dockedRoots?: { id: string }[] }) => {
            const neighbours = docking.dockedRoots ?? [];
            return neighbours.length
                ? neighbours.map((neighbour: { id: string }) => ({
                      ownDockingVector: docking.ownDockingVector,
                      dockedRoots: [neighbour],
                  }))
                : [docking];
        });
    // The perpendicular docking belongs to the wall-running leg, not the free carcase side.
    // Expand all actual neighbours so combined coverage is evaluated by the shared algorithm.
    const contextSource = sourceModule
        ? {
              _id: sourceModule._id,
              mod_Width: sourceModule.mod_Width,
              mod_Height: sourceModule.mod_Height,
              mod_Depth: sourceModule.mod_Depth,
              getArticlePos: () => sourceModule.getArticlePos(),
              getRoomContours: () => sourceModule.getRoomContours(),
              getContextModule: (id: string) =>
                  id === sourceModule._id && ownContext
                      ? {
                            _articlePos: ownContext._articlePos,
                            _contextData: { dockedRoots: sideDockings },
                        }
                      : sourceModule.getContextModule(id),
          }
        : sourceModule;
    const shared = GlobalFunc.process_GetModuleContextInformation(contextSource);
    const result = {
        ...shared,
        SuggestedDirection: null as 'Left' | 'Right' | null,
        HasCeilingInformation: false,
    };
    if (!sourceModule) return result;
    const contours = sourceModule.getRoomContours() ?? [];
    const position = sourceModule.getArticlePos();
    const rotation = ownContext?._articlePos?.rotationY ?? 0;
    const width = sourceModule.mod_Width;
    const depth = sourceModule.mod_Depth;
    if (
        !position ||
        ![position.x, position.z, rotation, width, depth].every(
            (value: unknown) => typeof value === 'number' && Number.isFinite(value),
        ) ||
        width <= 0 ||
        depth <= 0
    )
        return result;

    interface Point {
        x: number;
        z: number;
    }
    interface Segment {
        a: Point;
        b: Point;
    }
    interface RoomContour {
        level: number;
        segments: { x: number; y: number; angle?: number }[];
    }
    const validContours: RoomContour[] = contours.filter(
        (contour: RoomContour) =>
            contour &&
            Number.isFinite(contour.level) &&
            Array.isArray(contour.segments) &&
            contour.segments.length >= 3 &&
            contour.segments.every(
                (point: { x: number; y: number }) => Number.isFinite(point.x) && Number.isFinite(point.y),
            ),
    );
    if (!validContours.length) return result;
    const base = validContours.reduce((a: RoomContour, b: RoomContour) => (a.level < b.level ? a : b));
    result.HasCeilingInformation = validContours.some((contour: RoomContour) => contour.level > base.level);

    //======================================================================
    // Transform actual wall segments to the cabinet coordinate system
    //======================================================================
    const radians = (rotation * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const points = base.segments.map((point: { x: number; y: number }): Point => {
        const dx = point.x - position.x;
        const dz = point.y - position.z;
        return { x: cos * dx - sin * dz, z: sin * dx + cos * dz };
    });
    const walls: Segment[] = [];
    for (let index = 0; index < points.length; index++) {
        const a = points[index];
        const b = points[(index + 1) % points.length];
        if (a && b) walls.push({ a, b });
    }
    const tolerance = 1;
    const maxCornerDistance = 300;

    //======================================================================
    // Measure wall distances on the actual carcase side planes
    //======================================================================

    //======================================================================
    // nearestWall
    //======================================================================
    function nearestWall(axis: 'x' | 'z', coordinate: number, edge: number, sign: number): number {
        let nearest = Infinity;
        for (const wall of walls) {
            const from = axis === 'x' ? wall.a.z : wall.a.x;
            const to = axis === 'x' ? wall.b.z : wall.b.x;
            if (Math.abs(to - from) < 0.001) continue;
            const fraction = (coordinate - from) / (to - from);
            if (fraction < 0 || fraction > 1) continue;
            const start = axis === 'x' ? wall.a.x : wall.a.z;
            const end = axis === 'x' ? wall.b.x : wall.b.z;
            const distance = sign * (start + fraction * (end - start) - edge);
            if (distance >= -tolerance) nearest = Math.min(nearest, Math.max(0, distance));
        }
        return Number.isFinite(nearest) ? nearest : 999;
    }
    result.DistanceWallLeft = nearestWall('x', depth / 2, 0, -1);
    result.DistanceWallRight = nearestWall('x', depth / 2, width, 1);
    result.DistanceWallBack = nearestWall('z', width / 2, 0, -1);

    //======================================================================
    // Suggest a direction only for one connected rear corner
    //======================================================================
    // Existing dockings constrain the placed geometry; changing direction must not break them.
    const hasDockings = (ownContext?._contextData?.dockedRoots ?? []).some(
        (docking: { dockedRoots?: { id: string }[] }) => (docking.dockedRoots?.length ?? 0) > 0,
    );
    if (hasDockings) return result;

    //======================================================================
    // hasCorner
    //======================================================================
    function hasCorner(side: 'Left' | 'Right'): boolean {
        for (const back of walls) {
            if (Math.abs(back.a.z - back.b.z) > tolerance) continue;
            const backZ = (back.a.z + back.b.z) / 2;
            if (backZ > tolerance || backZ < -maxCornerDistance) continue;
            if (Math.min(back.a.x, back.b.x) > width / 2 || Math.max(back.a.x, back.b.x) < width / 2)
                continue;
            for (const wall of walls) {
                if (Math.abs(wall.a.x - wall.b.x) > tolerance) continue;
                const wallX = (wall.a.x + wall.b.x) / 2;
                const distance = side === 'Left' ? -wallX : wallX - width;
                if (distance < -tolerance || distance > maxCornerDistance) continue;
                if (Math.max(wall.a.z, wall.b.z) < depth / 2) continue;
                const connected = [wall.a, wall.b].some((point: Point) =>
                    [back.a, back.b].some(
                        (other: Point) => Math.hypot(point.x - other.x, point.z - other.z) <= tolerance,
                    ),
                );
                if (connected) return true;
            }
        }
        return false;
    }
    const left = hasCorner('Left');
    const right = hasCorner('Right');
    if (left !== right) result.SuggestedDirection = left ? 'Left' : 'Right';
    return result;
}
