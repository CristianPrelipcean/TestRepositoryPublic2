
  // ===================================================
  // create_CamManagerProcessings.json
  // Purpose: generate Workgroups + typed Operations JSON per part
  // ===================================================

  type AttributeTyp = "String" | "Int" | "Decimal" | "Date" | "DateTime";
  type InsertPoint = "Left" | "Middle" | "Right";
  type ContourType = "OutSide" | "InSide";

  interface Attribute { Name: string; Typ: AttributeTyp; Value: string; }

  interface Segment {
    StartX: number; StartY: number; StartZ: number;
    EndX: number; EndY: number; EndZ: number;
    Radius: number;
    SegmentTyp: "Line" | "Arc";
    ArcTyp: "undefined" | "Clockwise" | "CounterClockwise";
  }
  interface Contour { PosX: number; PosY: number; PosZ: number; Segements: Segment[]; }

  interface Exclude {
    StartPosX: number; StartPosY: number; StartPosZ: number;
    EndPosX: number; EndPosY: number; EndPosZ: number;
  }

  interface Mill {
    OperationType: string;
    ZPosition: number;
    Angle: number;
    ContoureType: ContourType;
    ProcessingDirection: string;
    Attributes: Attribute[];
    Conture: Contour;
  }
  interface Drill {
    OperationType: string;
    Diameter: number;
    Depth: number;
    OrX: number; OrY: number; OrZ: number;
    ProcessingDirection: string;
    PosX: number; PosY: number; PosZ: number;
    Attributes: Attribute[];
  }
  interface Groove {
    OperationType: string;
    Width: number;
    Depth: number;
    OrX: number; OrY: number; OrZ: number;
    StartPosX: number; StartPosY: number;
    EndPosX: number; EndPosY: number;
    ProcessingDirection: string;
    ZPos: number;
    InsertPoint: InsertPoint;
    Attributes: Attribute[];
  }
  interface Pocket {
    OperationType: string;
    Length: number;
    Width: number;
    Depth: number;
    CornerRadius: number;
    OrX: number; OrY: number; OrZ: number;
    ProcessingDirection: string;
    PosX: number; PosY: number; PosZ: number;
    Attributes: Attribute[];
  }
  interface Saw {
    OperationType: string;
    OrX: number; OrY: number; OrZ: number;
    StartPosX: number; StartPosY: number;
    EndPosX: number; EndPosY: number;
    PosZ: number;
    InsertPoint: InsertPoint;
    Attributes: Attribute[];
  }
  interface ComponentOp {
    OperationType: string;
    OrX: number; OrY: number; OrZ: number;
    PosX: number; PosY: number; PosZ: number;
    ProcessingDirection: string;
    Attributes: Attribute[];
    Exclude?: Exclude;
  }

  type Operation = Mill | Drill | Groove | Pocket | Saw | ComponentOp;

  interface Workgroup {
    Typ: number;
    Name: string;
    Operations: Operation[];
    Attributes: Attribute[];
  }

  function safeStr(v: any): string { return v === null || v === undefined ? "" : String(v); }
  function num2(v: any, fb = 0): number {
    const n = Number(v);
    return Number.isFinite(n) ? parseFloat(n.toFixed(2)) : fb;
  }
  function attr(name: string, value: any, typ: AttributeTyp = "String"): Attribute {
    return { Name: name, Typ: typ, Value: safeStr(value) };
  }

  function pickNc(attrs: Map<string, any>, key: string): any {
    return attrs.get(key);
  }

  function ncToAttributes(attrs: Map<string, any>): Attribute[] {
    const out: Attribute[] = [];
    attrs.forEach((value, key) => {
      if (!key.startsWith("nc_")) return;
      if (key === "nc_MprRelevant") return;
      // keep tool too for traceability
      const vTyp: AttributeTyp =
        typeof value === "number" ? "Decimal" :
          typeof value === "boolean" ? "Int" :
            "String";
      out.push(attr(key.substring(3), typeof value === "boolean" ? (value ? 1 : 0) : value, vTyp));
    });
    return out;
  }

  // Workgroups per tool (fallback)
  const wgs = new Map<string, Workgroup>();

  function wgForTool(tool: string): Workgroup {
    let wg = wgs.get(tool);
    if (!wg) {
      wg = {
        Typ: parseInt(tool, 10) || 0,
        Name: `unknown so far`,
        Operations: [],
        Attributes: [],
      };
      wgs.set(tool, wg);
    }
    return wg;
  }

  //===============================================================
  // Main loop over machinings
  //===============================================================

  bomEntries.forEach((b: any) => {
    const a = b.getAttributes() as Map<string, any>;

    const tool = safeStr(a.get("nc_TOOL"));
    if (!tool) return;

    const rel = a.get("nc_MprRelevant");
    const mprRelevant = (rel === false) ? false : true;
    if (!mprRelevant) return;

    const opAttrs = ncToAttributes(a);

    // Processing direction
    const side = safeStr(pickNc(a, "nc_Side")).toLowerCase();
    const sideToPD: Record<string, string> = {
      top: "ZM",
      btm: "ZP",
      left: "XP",
      right: "XM",
      front: "YP",
      back: "YM",
    };
    const ProcessingDirection = sideToPD[side] ?? "unknown";

    // tool mapping
    if (tool === "102" || tool === "103") {
      const op: Drill = {
        OperationType: "Drill",
        Diameter: num2(pickNc(a, "nc_DU") ?? 0),
        Depth: num2(pickNc(a, "nc_TI") ?? 0),
        OrX: num2(pickNc(a, "nc_ORX") ?? 0),
        OrY: num2(pickNc(a, "nc_ORY") ?? 0),
        OrZ: num2(pickNc(a, "nc_ORZ") ?? 0),
        ProcessingDirection,
        PosX: num2(pickNc(a, "nc_XA") ?? 0),
        PosY: num2(pickNc(a, "nc_YA") ?? 0),
        PosZ: num2(pickNc(a, "nc_ZA") ?? 0),
        Attributes: [],
      };
      wgForTool(tool).Operations.push(op);
      return;
    }

    if (tool === "109") {
      const op: Groove = {
        OperationType: "Groove",
        Width: num2(pickNc(a, "nc_NB") ?? pickNc(a, "nc_BR") ?? 0),
        Depth: num2(pickNc(a, "nc_TI") ?? 0),
        OrX: num2(pickNc(a, "nc_ORX") ?? 0),
        OrY: num2(pickNc(a, "nc_ORY") ?? 0),
        OrZ: num2(pickNc(a, "nc_ORZ") ?? 0),
        StartPosX: num2(pickNc(a, "nc_XA") ?? 0),
        StartPosY: num2(pickNc(a, "nc_YA") ?? 0),
        EndPosX: num2(pickNc(a, "nc_XE") ?? 0),
        EndPosY: num2(pickNc(a, "nc_YE") ?? 0),
        ProcessingDirection,
        ZPos: num2(pickNc(a, "nc_ZA") ?? 0),
        InsertPoint: "Middle",
        Attributes: [],
      };
      wgForTool(tool).Operations.push(op);
      return;
    }

    if (tool === "112") {
      const op: Pocket = {
        OperationType: "Pocket",
        Length: num2(pickNc(a, "nc_LA") ?? 0),
        Width: num2(pickNc(a, "nc_BR") ?? 0),
        Depth: num2(pickNc(a, "nc_TI") ?? 0),
        CornerRadius: num2(pickNc(a, "nc_RA") ?? 0),
        OrX: num2(pickNc(a, "nc_ORX") ?? 0),
        OrY: num2(pickNc(a, "nc_ORY") ?? 0),
        OrZ: num2(pickNc(a, "nc_ORZ") ?? 0),
        ProcessingDirection,
        PosX: num2(pickNc(a, "nc_XA") ?? 0),
        PosY: num2(pickNc(a, "nc_YA") ?? 0),
        PosZ: num2(pickNc(a, "nc_ZA") ?? 0),
        Attributes: [],
      };
      wgForTool(tool).Operations.push(op);
      return;
    }

    if (tool === "124") {
      const op: Saw = {
        OperationType: "Saw",
        OrX: num2(pickNc(a, "nc_ORX") ?? 0),
        OrY: num2(pickNc(a, "nc_ORY") ?? 0),
        OrZ: num2(pickNc(a, "nc_ORZ") ?? 0),
        StartPosX: num2(pickNc(a, "nc_XA") ?? 0),
        StartPosY: num2(pickNc(a, "nc_YA") ?? 0),
        EndPosX: num2(pickNc(a, "nc_XE") ?? 0),
        EndPosY: num2(pickNc(a, "nc_YE") ?? 0),
        PosZ: num2(pickNc(a, "nc_ZA") ?? 0),
        InsertPoint: "Middle",
        Attributes: [],
      };
      wgForTool(tool).Operations.push(op);
      return;
    }

    if (tool === "139") {
      const op: ComponentOp = {
        OperationType: "Component",
        OrX: num2(pickNc(a, "nc_ORX") ?? 0),
        OrY: num2(pickNc(a, "nc_ORY") ?? 0),
        OrZ: num2(pickNc(a, "nc_ORZ") ?? 0),
        PosX: num2(pickNc(a, "nc_XA") ?? 0),
        PosY: num2(pickNc(a, "nc_YA") ?? 0),
        PosZ: num2(pickNc(a, "nc_ZA") ?? 0),
        ProcessingDirection,
        Attributes: opAttrs,
      };
      wgForTool(tool).Operations.push(op);
      return;
    }

    // Unknown tool: keep as ComponentOp so schema stays valid
    const op: ComponentOp = {
      OperationType: "Unknown",
      OrX: 0, OrY: 0, OrZ: 0,
      PosX: 0, PosY: 0, PosZ: 0,
      ProcessingDirection,
      Attributes: opAttrs,
    };
    wgForTool(tool).Operations.push(op);
  });

  // Produce file content
  const outObj = {
    PartId: part._partId,
    PartInstanceId: part._id,
    Workgroups: Array.from(wgs.values()),
  };

  // One file per part
  this.createFileEntry(
    result,
    `${part._partId}_${part._id}.processings.json`,
    JSON.stringify(outObj, null, 2),
    "application/json;charset=utf-8"
  );