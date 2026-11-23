process_GroupFillers (group: go_mr_GroupOrchestrator): number {
  // Revision: 2026-11-04 | Ludwig Weber | Validate only docking properties exposed by the HI context API.

  const EPS = 0.01;
  type Point = { x: number; y: number; z: number };
  type Node = { module: OD_M_mr_StorageunitSingle; position: Point; width: number; depth: number; height: number; plinth: number };
  const roots = group.roots.map(item => item.root);
  const cabinets = roots.filter((root): root is OD_M_mr_StorageunitSingle => root instanceof OD_M_mr_StorageunitSingle);
  if (!cabinets.length) return 0;
  const warn = (message: string): void => logWarning('Group fillers: ' + message);
  const ids = new Set<string>();
  for (const root of roots) {
    if (ids.has(root._id)) { warn('duplicate existing root IDs; insertion skipped.'); return 0; }
    ids.add(root._id);
  }
  const incoming = group.getArticlePos();
  const move = group.repositioningData;
  const base = move ? { x: move.posGroup[0], y: move.posGroup[1], z: move.posGroup[2], rotationY: move.posRotationY ?? incoming.rotationY } : incoming;
  if (![base.x, base.y, base.z, base.rotationY ?? 0].every(Number.isFinite)) {
    warn('invalid group placement; insertion skipped.'); return 0;
  }
  if (move && ((move.rootRelRotationY ?? 0) !== 0 || !move.rootId)) {
    warn('rotated reference root is not supported in this first version.'); return 0;
  }
  const angle = (base.rotationY ?? 0) * Math.PI / 180;
  const cs = Math.cos(angle), sn = Math.sin(angle);
  const world = (p: Point): Point => ({ x: base.x + cs * p.x + sn * p.z, y: base.y + p.y, z: base.z - sn * p.x + cs * p.z });
  const levels = (group.roomData?.levels ?? []).filter(level => Number.isFinite(level.level) && Array.isArray(level.segments));
  if (!levels.length) { warn('no usable room contours; insertion skipped.'); return 0; }
  // Height/sloped-wall interpolation is outside this first rectangular version.
  if (levels.some(level => level.segments.some(segment => (segment.angle ?? 0) !== 0))) {
    warn('sloped room contours are not supported in this first version.'); return 0;
  }
  const floor = Math.min(...levels.map(level => level.level));
  const ceiling = Math.max(...levels.map(level => level.level));
  const room = levels.find(level => level.level === floor)!;
  const nodes = new Map<string, Node>();
  for (const module of cabinets) {
    const p = module._articlePos;
    if (!p || ![p.x, p.y, p.z, p.rotationY ?? 0, module.mod_Width, module.mod_Depth].every(Number.isFinite) ||
        Math.abs(((p.rotationY ?? 0) % 360)) > EPS || (module.mod_Width ?? 0) <= 0 || (module.mod_Depth ?? 0) <= 0) {
      warn('only aligned rectangular storage units are supported; insertion skipped.'); return 0;
    }
    const plinth = module.mod_PlacementLevels === 'OnFloor' ? (module.mod_PlinthAreaHeight ?? 0) : 0;
    const height = module.mod_CarcaseHeight ?? module.mod_Height ?? 0;
    if (!Number.isFinite(height) || height <= 0 || !Number.isFinite(plinth) || plinth < 0) {
      warn('invalid cabinet dimensions; insertion skipped.'); return 0;
    }
    nodes.set(module._id, { module, position: { x: p.x, y: p.y, z: p.z }, width: module.mod_Width!, depth: module.mod_Depth!, height, plinth });
  }
  const pointOnDock = (node: Node, dock: Dock, atEnd: boolean): Point | undefined => {
    if (![Dock.LeftBottom, Dock.LeftTop, Dock.RightBottom, Dock.RightTop].includes(dock)) return undefined;
    return {
      x: dock === Dock.RightBottom || dock === Dock.RightTop ? node.width : 0,
      y: dock === Dock.LeftTop || dock === Dock.RightTop ? node.plinth + node.height : 0,
      z: atEnd ? node.depth : -(node.module.mod_CarcaseDistanceWall ?? 0)
    };
  };
  const connections = (node: Node) => node.module._contextData?.dockedRoots ?? [];
  const solved = new Set<string>();
  const solveComponent = (seed: Node): boolean => {
    const queue = [seed]; solved.add(seed.module._id);
    for (let index = 0; index < queue.length; index++) {
      const own = queue[index];
      for (const connection of connections(own)) {
        for (const edge of connection.dockedRoots ?? []) {
          const other = nodes.get(edge.id);
          if (!other) continue; // Existing non-cabinet dockings still occupy the side.
          const mode = edge.mode ?? DockMode.StartStart;
          if ((edge.rotationY ?? 0) !== 0 ||
              (mode !== DockMode.StartStart && mode !== DockMode.EndEnd)) {
            warn('unsupported cabinet docking mode/rotation; insertion skipped.'); return false;
          }
          const a = pointOnDock(own, connection.ownDockingVector, mode === DockMode.EndEnd);
          const b = pointOnDock(other, edge.dockingVector, mode === DockMode.EndEnd);
          const offset = edge.offset ?? [0, 0, 0];
          if (!a || !b || offset.length !== 3 || !offset.every(Number.isFinite)) {
            warn('unsupported cabinet docking vectors or offsets; insertion skipped.'); return false;
          }
          const position = { x: own.position.x + a.x - b.x + offset[0], y: own.position.y + a.y - b.y + offset[1], z: own.position.z + a.z - b.z + offset[2] };
          if (solved.has(other.module._id)) {
            if (Math.hypot(other.position.x - position.x, other.position.y - position.y, other.position.z - position.z) > EPS) {
              warn('inconsistent cabinet docking graph; insertion skipped.'); return false;
            }
          } else {
            other.position = position; solved.add(other.module._id); queue.push(other);
          }
        }
      }
    }
    return true;
  };
  const anchor = move ? nodes.get(move.rootId) : undefined;
  if (move && !anchor) { warn('positioning reference is not a storage unit; insertion skipped.'); return 0; }
  if (anchor && move) {
    const relative = move.rootRelPos ?? [0, 0, 0];
    if (relative.length !== 3 || !relative.every(Number.isFinite)) return 0;
    anchor.position = { x: relative[0], y: relative[1], z: relative[2] };
    if (!solveComponent(anchor)) return 0;
  }
  // Prefer a leftmost undocked end of each straight run over a reused middle root.
  const ordered = [...nodes.values()].sort((a, b) => a.position.x - b.position.x || a.position.y - b.position.y);
  const starts = ordered.filter(node => !connections(node).some(c => c.ownDockingVector === Dock.LeftBottom &&
    c.dockedRoots.some(edge => nodes.has(edge.id) && edge.dockingVector === Dock.RightBottom)));
  for (const node of [...starts, ...ordered]) if (!solved.has(node.module._id) && !solveComponent(node)) return 0;

  // Match the rectangular room/group-height calculation without completing or
  // sealing cabinets here. Their normal Prepare Context remains authoritative.
  for (const node of nodes.values()) {
    const m = node.module;
    const bottom = world(node.position).y + node.plinth;
    if (m.mod_UseGroupHeight) node.height = (m.mod_GroupHeight ?? NaN) - (bottom - floor);
    else if (m.mod_AutomaticHeightAdjustment) {
      if (levels.length < 2 || ceiling <= floor) { warn('room height unavailable; insertion skipped.'); return 0; }
      node.height = ceiling - bottom - (m.mod_CarcaseCeilingDistance ?? 0);
    }
    if (!Number.isFinite(node.height) || node.height <= 0) { warn('invalid calculated height; insertion skipped.'); return 0; }
  }
  const gapAt = (node: Node, side: 'Left' | 'Right'): number | undefined => {
    const sign = side === 'Left' ? -1 : 1;
    const rx = sign * cs, rz = -sign * sn;
    const distances: number[] = [];
    for (const depth of [0, node.depth / 2, node.depth]) {
      const origin = world({ x: node.position.x + (side === 'Right' ? node.width : 0), y: node.position.y, z: node.position.z + depth });
      let nearest = Infinity;
      for (let i = 1; i < room.segments.length; i++) {
        const a = room.segments[i - 1], b = room.segments[i];
        if (b.type !== 'wall' || ![a.x, a.y, b.x, b.y].every(Number.isFinite)) continue;
        const ax = a.x, az = -a.y, vx = b.x - ax, vz = -b.y - az;
        const length = Math.hypot(vx, vz);
        // A filler requires a parallel side wall across the cabinet depth.
        if (length <= EPS || Math.abs(vx * rx + vz * rz) > length * 0.000001) continue;
        const denominator = rx * vz - rz * vx;
        if (Math.abs(denominator) < EPS) continue;
        const dx = ax - origin.x, dz = az - origin.z;
        const distance = (dx * vz - dz * vx) / denominator;
        const u = (dx * rz - dz * rx) / denominator;
        if (distance > EPS && u >= -EPS / length && u <= 1 + EPS / length) nearest = Math.min(nearest, distance);
      }
      if (!Number.isFinite(nearest)) return undefined;
      distances.push(nearest);
    }
    if (Math.max(...distances) - Math.min(...distances) > EPS) return undefined;
    return Math.round(distances[1] * 1000) / 1000;
  };
  const staged: { root: OD_M_mr_Filler01; item: any; cabinet: Node; rule: ICT_tab_GroupFillerRules; side: string }[] = [];
  for (const node of nodes.values()) {
    for (const side of ['Left', 'Right'] as const) {
      const left = side === 'Left';
      const sideDocks = left ? [Dock.LeftBottom, Dock.LeftTop] : [Dock.RightBottom, Dock.RightTop];
      if (connections(node).some(c => sideDocks.includes(c.ownDockingVector) && c.dockedRoots.length > 0)) continue;
      const edgeX = node.position.x + (left ? 0 : node.width);
      const bottom = node.position.y + node.plinth, top = bottom + node.height;
      // Detect continuous side sections but leave their generation to stage two.
      const stacked = [...nodes.values()].some(other => other !== node &&
        Math.abs(other.position.x + (left ? 0 : other.width) - edgeX) <= EPS &&
        Math.abs(other.position.z - node.position.z) <= EPS && Math.abs(other.depth - node.depth) <= EPS &&
        (Math.abs(other.position.y + other.plinth - top) <= EPS || Math.abs(other.position.y + other.plinth + other.height - bottom) <= EPS));
      if (stacked) { warn(`continuous ${side} section at ${node.module._articleId}; deferred, no SingleCabinet filler inserted.`); continue; }
      const gap = gapAt(node, side);
      if (gap === undefined) continue;
      // Do not fill through another cabinet, even when it is not docked.
      const blocked = [...nodes.values()].some(other => other !== node &&
        Math.min(top, other.position.y + other.plinth + other.height) - Math.max(bottom, other.position.y + other.plinth) > EPS &&
        Math.min(node.position.z + node.depth, other.position.z + other.depth) - Math.max(node.position.z, other.position.z) > EPS &&
        (left ? other.position.x < edgeX - EPS && other.position.x + other.width > edgeX - gap + EPS :
          other.position.x + other.width > edgeX + EPS && other.position.x < edgeX + gap - EPS));
      if (blocked) continue;
      const rule = GlobalFunc.find_GroupFillerRule('SingleCabinet', side, node.module.mod_TypeElement ?? '', node.module._articleId ?? '', gap);
      if (!rule) continue;
      const myDock = left ? Dock.RightBottom : Dock.LeftBottom;
      const neighbourDock = left ? Dock.LeftBottom : Dock.RightBottom;
      if (rule.MyDockingVector !== myDock || rule.NeighbourDockingVector !== neighbourDock ||
          (rule.DockingMode !== DockMode.EndEnd && rule.DockingMode !== DockMode.StartStart) ||
          ![rule.OffsetRight, rule.OffsetUp, rule.OffsetFront].every(Number.isFinite)) {
        warn(`rule ${rule._id}: unsupported SingleCabinet docking; no filler inserted.`); continue;
      }
      // Reserve None as no adjustment, rather than applying an attribute named None.
      const adjustments = !rule.AdjustmentId || rule.AdjustmentId === 'None' ? [] : GlobalFunc.find_GroupAttributeAdjustment(rule.AdjustmentId);
      if (!adjustments || (rule.AdjustmentId !== 'None' && rule.AdjustmentId && !adjustments.length)) {
        warn(`rule ${rule._id}: missing attribute adjustment.`); continue;
      }
      if (!rule.FillerArticleId || !group.articleIds.includes(rule.FillerArticleId)) {
        warn(`filler article ${rule.FillerArticleId} is unavailable in this configurator catalog.`); continue;
      }
      let created: ReturnType<go_mr_GroupOrchestrator['createArticle']> = undefined;
      try {
        created = group.createArticle(rule.FillerArticleId);
      } catch (error) {
        warn(`article ${rule.FillerArticleId} could not be created: ${error instanceof Error ? error.message : String(error)}`);
        continue;
      }
      if (created?.length !== 1 || !(created[0].root instanceof OD_M_mr_Filler01)) {
        warn(`article ${rule.FillerArticleId} must contain one mr_Filler01 root.`); continue;
      }
      const item = created[0], filler = item.root as OD_M_mr_Filler01;
      const fresh = (module: any): void => {
        module._id = uuidv4(); module._contextData = undefined;
        for (const child of module.m) fresh(child);
      };
      fresh(filler);
      const assign = (attribute: string, value: any): void => {
        if (!(attribute in filler) || value === undefined) throw new Error('Invalid filler attribute: ' + attribute);
        (filler as any)[attribute] = value;
        filler._forcedInputAttributes ??= [];
        if (!filler._forcedInputAttributes.includes(attribute)) filler._forcedInputAttributes.push(attribute);
      };
      try {
        for (const adjustment of adjustments) {
          const value = adjustment.AttributeValue;
          let converted: any = value;
          if (adjustment.AttributeType === 'Number') {
            converted = Number(value); if (!Number.isFinite(converted)) throw new Error('Invalid numeric adjustment');
          } else if (adjustment.AttributeType === 'Boolean') {
            if (value !== 'true' && value !== 'false') throw new Error('Invalid Boolean adjustment');
            converted = value === 'true';
          }
          if (adjustment.AttributeId) assign(adjustment.AttributeId, converted);
        }
        for (const attribute of ['mod_FrontColor', 'mod_FrontProgram', 'mod_CarcaseColor', 'mod_CarcaseProgram', 'mod_CarcaseOutsideColor']) {
          const value = (node.module as any)[attribute];
          if (value !== undefined && attribute in filler && !adjustments.some(a => a.AttributeId === attribute)) assign(attribute, value);
        }
        // Geometry is measured, not supplied by the attribute-adjustment table.
        assign('mod_Width', gap); assign('mod_Height', node.height); assign('mod_Depth', node.depth);
        assign('mod_PlinthAreaHeight', node.plinth);
        assign('mod_PlinthAreaDesign', node.module.mod_PlinthAreaDesign);
        assign('mod_CarcaseDistanceWall', node.module.mod_CarcaseDistanceWall ?? 0);
        assign('mod_FrontPosStart', node.module.mod_FrontPosStart ?? 0);
        // Direction belongs to the article template; do not reverse it from its name.
        const inheritFinish = (module: any): void => {
          for (const attribute of ['mod_FrontColor', 'mod_FrontProgram', 'mod_CarcaseColor', 'mod_CarcaseProgram', 'mod_CarcaseOutsideColor']) {
            if (attribute in module && attribute in filler) module[attribute] = (filler as any)[attribute];
          }
          for (const child of module.m) inheritFinish(child);
        };
        for (const child of filler.m) inheritFinish(child);
        filler.dataCompletion(); filler.validateSelections();
        const dz = rule.DockingMode === DockMode.EndEnd ? node.depth - filler.mod_Depth! : 0;
        filler._articlePos = { x: edgeX - (left ? gap : 0) + rule.OffsetRight,
          y: node.position.y + rule.OffsetUp, z: node.position.z + dz + rule.OffsetFront, rotationY: 0 };
        staged.push({ root: filler, item, cabinet: node, rule, side });
      } catch (error) {
        warn(`rule ${rule._id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  let inserted = 0;
  for (const entry of staged) {
    const { root, item, cabinet, rule, side } = entry;
    // Add connections before the normal Prepare Context / After Data Completion.
    try {
      group.addRoot(item);
      group.addDocking(cabinet.module, rule.NeighbourDockingVector as Dock, root, rule.MyDockingVector as Dock,
        rule.DockingMode as DockMode, [rule.OffsetRight, rule.OffsetUp, rule.OffsetFront]);
    } catch (error) {
      group.removeDocking(cabinet.module, root);
      group.removeRoot(item);
      warn(`could not attach ${root._articleId}: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    inserted++;
    logInfo(`Group fillers: inserted ${root._articleId} (${side}, rule ${rule._id}) beside ${cabinet.module._articleId}.`);
  }
  return inserted;



}