process_StorageunitColumnContext(module: any){
    // HOMAG Digital
    // Create: October 2026
    // By Ludwig Weber
    // Purpose: CabinetLibrary

    // Description:
    // process_StorageunitColumnContext implements the cabinet column-wrap feature.

    // Revisions:
// 2026-11-04 | Ludwig Weber | Translate diagnostic stages and explanatory messages into English.
    // 2026-11-03 | Ludwig Weber | Integrate r10 with the current live library.

    //======================================================================
    // Column-wrap calculation
    //======================================================================
    // Evaluate only contour segments inside the cabinet rectangle.
    const EPS = 0.001;
    type Point = { x: number; z: number };
    type Rect = { X0: number; X1: number; Z0: number; Z1: number };
    type Edge = { a: number; b: number };
    const result = {
        Version: 1,
        IsComplete: true,
        HasIntersection: false,
        Errors: [] as string[],
        RawRect: undefined as Rect | undefined,
    };
    function fail(message: string) {
        return { Version: 1, IsComplete: true, HasIntersection: false, Errors: [] as string[] };
    }
    try {
    const contours = module.getRoomContours() ?? [];
    if (contours.length === 0) return result;
    const position = module.getArticlePos();
    const context = module.getContextModule(module._id);
    const rotation = context?._articlePos?.rotationY ?? position?.rotationY ?? 0;
    const width = module.mod_Width;
    const depth = module.mod_Depth;
    if (
        !position ||
        ![position.x, position.z, rotation, width, depth].every(Number.isFinite) ||
        width <= 0 ||
        depth <= 0
    ) {
        return fail('Position or cabinet dimensions are invalid.');
    }
    const valid = contours.filter(
        (c: any) => Number.isFinite(c?.level) && Array.isArray(c?.segments) && c.segments.length >= 3,
    );
    if (valid.length === 0) return fail('No readable context contour is available.');
    const level = Math.min(...valid.map((c: any) => c.level));
    const rings = valid.filter((c: any) => Math.abs(c.level - level) <= EPS);
    const angle = (rotation * Math.PI) / 180;
    const cs = Math.cos(angle);
    const sn = Math.sin(angle);
    const nodes: Point[] = [];
    const edges: Edge[] = [];
    const equal = (a: Point, b: Point): boolean => Math.hypot(a.x - b.x, a.z - b.z) <= EPS;
    const onBoundary = (p: Point): boolean =>
        Math.abs(p.x) <= EPS ||
        Math.abs(p.x - width) <= EPS ||
        Math.abs(p.z) <= EPS ||
        Math.abs(p.z - depth) <= EPS;
    function node(p: Point): number {
        const i = nodes.findIndex((q: Point) => equal(p, q));
        if (i >= 0) return i;
        nodes.push(p);
        return nodes.length - 1;
    }
    function clip(a: Point, b: Point): [Point, Point] | undefined {
        let lo = 0,
            hi = 1;
        for (const [av, delta, max] of [
            [a.x, b.x - a.x, width],
            [a.z, b.z - a.z, depth],
        ]) {
            if (Math.abs(delta) <= EPS) {
                if (av < -EPS || av > max + EPS) return undefined;
            } else {
                const t0 = -av / delta,
                    t1 = (max - av) / delta;
                lo = Math.max(lo, Math.min(t0, t1));
                hi = Math.min(hi, Math.max(t0, t1));
                if (lo > hi) return undefined;
            }
        }
        const at = (t: number): Point => ({
            x: Math.max(0, Math.min(width, a.x + t * (b.x - a.x))),
            z: Math.max(0, Math.min(depth, a.z + t * (b.z - a.z))),
        });
        const p = at(lo),
            q = at(hi);
        if (equal(p, q)) return undefined;
        return [p, q];
    }
    for (const ring of rings) {
        const points: Point[] = [];
        for (const segment of ring.segments) {
            if (!Number.isFinite(segment.x) || !Number.isFinite(segment.y))
                return fail('Contour point is invalid.');
            if ((segment.radius ?? 0) !== 0 || (segment.r ?? 0) !== 0 || (segment.bulge ?? 0) !== 0)
                return fail('Curved contour cannot be evaluated as a rectangular intrusion.');
            const dx = segment.x - position.x,
                dz = segment.y - position.z;
            points.push({ x: cs * dx - sn * dz, z: sn * dx + cs * dz });
        }
        // Remove duplicate points and zero-area backtracks A -> B -> A.
        let changed = true;
        while (changed && points.length >= 3) {
            changed = false;
            for (let i = 0; i < points.length; i++) {
                const prev = points[(i + points.length - 1) % points.length],
                    next = points[(i + 1) % points.length];
                if (equal(points[i], next) || equal(prev, next)) {
                    points.splice(i, 1);
                    changed = true;
                    break;
                }
            }
        }
        if (points.length < 3) return fail('Contour cannot be evaluated as a closed boundary after cleanup.');
        for (let i = 0; i < points.length; i++) {
            const clipped = clip(points[i], points[(i + 1) % points.length]);
            if (!clipped) continue;
            let [p, q] = clipped;
            // Contact along a cabinet edge alone is not an intrusion.
            if (
                (Math.abs(p.x) <= EPS && Math.abs(q.x) <= EPS) ||
                (Math.abs(p.x - width) <= EPS && Math.abs(q.x - width) <= EPS) ||
                (Math.abs(p.z) <= EPS && Math.abs(q.z) <= EPS) ||
                (Math.abs(p.z - depth) <= EPS && Math.abs(q.z - depth) <= EPS)
            )
                continue;
            if (Math.abs(p.x - q.x) > EPS && Math.abs(p.z - q.z) > EPS)
                return fail('An intruding contour segment is not parallel to the carcase axes.');
            if (Math.abs(p.x - q.x) <= EPS) q = { x: p.x, z: q.z };
            else q = { x: q.x, z: p.z };
            const a = node(p),
                b = node(q);
            if (!edges.some((e: Edge) => (e.a === a && e.b === b) || (e.a === b && e.b === a)))
                edges.push({ a, b });
        }
    }
    if (edges.length === 0) return result;
    // Collect connected intruding contour segments.
    const remaining = new Set<number>(edges.map((_: Edge, i: number) => i));
    const components: number[][] = [];
    while (remaining.size > 0) {
        const first = remaining.values().next().value as number;
        const component: number[] = [];
        const queue: number[] = [first];
        remaining.delete(first);
        while (queue.length > 0) {
            const i = queue.pop()!;
            component.push(i);
            const e = edges[i];
            for (const j of Array.from(remaining)) {
                const f = edges[j];
                if (e.a === f.a || e.a === f.b || e.b === f.a || e.b === f.b) {
                    remaining.delete(j);
                    queue.push(j);
                }
            }
        }
        components.push(component);
    }
    if (components.length !== 1)
        return fail('Multiple separate intrusions detected; no shared bounding rectangle was created.');
    const selected = components[0].map((i: number) => edges[i]);
    const used = Array.from(new Set<number>(selected.flatMap((e: Edge) => [e.a, e.b])));
    for (const i of used) {
        const degree = selected.filter((e: Edge) => e.a === i || e.b === i).length;
        if (degree > 2 || (degree === 1 && !onBoundary(nodes[i])))
            return fail('Intruding contour branches or ends inside the carcase.');
    }
    const rect: Rect = {
        X0: Math.min(...used.map((i: number) => nodes[i].x)),
        X1: Math.max(...used.map((i: number) => nodes[i].x)),
        Z0: Math.min(...used.map((i: number) => nodes[i].z)),
        Z1: Math.max(...used.map((i: number) => nodes[i].z)),
    };
    // Close a crossing line towards the back for a rear intrusion.
    if (rect.X0 <= EPS && rect.X1 >= width - EPS && rect.Z1 - rect.Z0 <= EPS) rect.Z0 = 0;
    if (rect.X1 - rect.X0 <= EPS || rect.Z1 - rect.Z0 <= EPS)
        return fail('Intruding contour does not define a rectangular area with positive dimensions.');
    if (rect.Z0 > EPS)
        return fail(
            'Side intrusion without a connection to the rear edge detected; its position is not supported by the current carcase logic.',
        );
    if (rect.Z1 >= depth - EPS) return fail('Intrusion reaches the front edge of the carcase.');
    for (const e of selected) {
        const p = nodes[e.a],
            q = nodes[e.b];
        const onSide =
            (Math.abs(p.x - rect.X0) <= EPS && Math.abs(q.x - rect.X0) <= EPS) ||
            (Math.abs(p.x - rect.X1) <= EPS && Math.abs(q.x - rect.X1) <= EPS) ||
            (Math.abs(p.z - rect.Z0) <= EPS && Math.abs(q.z - rect.Z0) <= EPS) ||
            (Math.abs(p.z - rect.Z1) <= EPS && Math.abs(q.z - rect.Z1) <= EPS);
        if (!onSide) return fail('Intruding contour does not describe a single rectangle.');
    }
    function covered(vertical: boolean, fixed: number, start: number, end: number): boolean {
        // The rectangle may close along the cabinet boundary.
        if (
            vertical
                ? Math.abs(fixed) <= EPS || Math.abs(fixed - width) <= EPS
                : Math.abs(fixed) <= EPS || Math.abs(fixed - depth) <= EPS
        )
            return true;
        const intervals: number[][] = [];
        for (const e of selected) {
            const p = nodes[e.a],
                q = nodes[e.b];
            const f0 = vertical ? p.x : p.z,
                f1 = vertical ? q.x : q.z;
            if (Math.abs(f0 - fixed) <= EPS && Math.abs(f1 - fixed) <= EPS) {
                const v0 = vertical ? p.z : p.x,
                    v1 = vertical ? q.z : q.x;
                intervals.push([Math.min(v0, v1), Math.max(v0, v1)]);
            }
        }
        intervals.sort((a: number[], b: number[]) => a[0] - b[0]);
        let reached = start;
        for (const interval of intervals) {
            if (interval[0] > reached + EPS) return false;
            reached = Math.max(reached, interval[1]);
        }
        return reached >= end - EPS;
    }
    if (
        !covered(true, rect.X0, rect.Z0, rect.Z1) ||
        !covered(true, rect.X1, rect.Z0, rect.Z1) ||
        !covered(false, rect.Z0, rect.X0, rect.X1) ||
        !covered(false, rect.Z1, rect.X0, rect.X1)
    )
        return fail('Contour does not fully enclose the intrusion area.');
    result.HasIntersection = true;
    result.RawRect = rect;
    return result;
    } catch {
        return { Version: 1, IsComplete: true, HasIntersection: false, Errors: [] as string[] };
    }
}
