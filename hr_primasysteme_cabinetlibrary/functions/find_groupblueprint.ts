find_GroupBlueprint(GenerationLogic: string, WallLength: number): any {

  // Wildcard parameters
  let WildcardParams: any = {};

  // Fixed parameters
  let FixedParams: any = {
    in_GenerationLogic: GenerationLogic
  };

  // Range parameters
  let RangeParams: any = {
    "Range1": {
      MinAttr: "in_MinTargetLength",
      MaxAttr: "in_MaxTargetLength",
      Value: WallLength
    }
  };

  // Return multiple rows or a single row
  let UniqueOutput = false;

  let retVal = GlobalFunc.process_BasicTableQuery(
    ct_tab_GroupBlueprint,
    WildcardParams,
    FixedParams,
    RangeParams,
    UniqueOutput
  );

  let result: any = {
    Success: false,
    ErrorText: "",
    Items: []
  };

  if (retVal == undefined || retVal.length <= 0) {
    result.ErrorText =
      "No group blueprint found. GenerationLogic=" +
      GenerationLogic +
      ", WallLength=" +
      WallLength;
    return result;
  }

  // Sort by Position
  retVal.sort((a: any, b: any) => a.Position - b.Position);

  // Validate positions
  let Positions: number[] = [];

  for (let row of retVal) {

    if (row.Position == undefined || row.Position == null) {
      result.ErrorText =
        "Invalid group blueprint. Position is missing.";
      return result;
    }

    if (Positions.indexOf(row.Position) >= 0) {
      result.ErrorText =
        "Invalid group blueprint. Position is not unique. Position=" +
        row.Position;
      return result;
    }

    Positions.push(row.Position);

    if (row.ArticleId == undefined || row.ArticleId == null || row.ArticleId == "") {
      result.ErrorText =
        "Invalid group blueprint. ArticleId is missing. Position=" +
        row.Position;
      return result;
    }

    let HasDockTo =
      row.DockToPosition != undefined &&
      row.DockToPosition != null &&
      row.DockToPosition !== "" &&
      row.DockToPosition > 0;

    let HasMyVector =
      row.MyDockingVector != undefined &&
      row.MyDockingVector != null &&
      row.MyDockingVector !== "";

    let HasNeighbourVector =
      row.NeighbourDockingVector != undefined &&
      row.NeighbourDockingVector != null &&
      row.NeighbourDockingVector !== "";

    // DockToPosition 0 means: first article / no docking
    if (!HasDockTo) {
      continue;
    }

    // If docking is required, both vectors must be set
    if (!HasMyVector || !HasNeighbourVector) {
      result.ErrorText =
        "Invalid group blueprint. Docking vectors are missing. Position=" +
        row.Position;
      return result;
    }
  }

  // Validate DockToPosition
  for (let row of retVal) {

    let HasDockTo =
      row.DockToPosition != undefined &&
      row.DockToPosition != null &&
      row.DockToPosition !== "" &&
      row.DockToPosition > 0;

    if (!HasDockTo) {
      continue;
    }

    if (Positions.indexOf(row.DockToPosition) < 0) {
      result.ErrorText =
        "Invalid group blueprint. DockToPosition does not exist. Position=" +
        row.Position +
        ", DockToPosition=" +
        row.DockToPosition;
      return result;
    }
  }

  result.Success = true;
  result.Items = retVal;
  return result;
}