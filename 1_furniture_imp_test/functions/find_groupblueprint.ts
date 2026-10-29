find_GroupBlueprint(GenerationLogic: string, WallLength: number, Variant: string = 'Type01'): any {

    // Default variant
  const requestedVariant = Variant || "Type01";
  let resolvedVariant = requestedVariant;

  //====================================================================
  // Query helper
  //====================================================================

  const findBlueprint = (variant: string): any[] => {

    // Wildcard parameters
    const WildcardParams: any = {};

    // Fixed parameters
    const FixedParams: any = {
      in_GenerationLogic: GenerationLogic,
      in_Variant: variant
    };

    // Range parameters
    const RangeParams: any = {
      Range1: {
        MinAttr: "in_MinTargetLength",
        MaxAttr: "in_MaxTargetLength",
        Value: WallLength
      }
    };

    // Return multiple rows
    const UniqueOutput = false;

    return GlobalFunc.process_BasicTableQuery(
      ct_tab_GroupBlueprint,
      WildcardParams,
      FixedParams,
      RangeParams,
      UniqueOutput
    );
  };

  //====================================================================
  // Find blueprint
  //====================================================================

  let retVal = findBlueprint(requestedVariant);

  // Requested variant not found -> fallback to Type01
  if ((retVal == undefined || retVal.length <= 0) && requestedVariant !== "Type01") {
    resolvedVariant = "Type01";
    retVal = findBlueprint(resolvedVariant);
  }

  //====================================================================
  // Result
  //====================================================================

  const result: any = {
    Success: false,
    ErrorText: "",
    Items: [],
    Variant: resolvedVariant
  };

  // No blueprint found
  if (retVal == undefined || retVal.length <= 0) {
    result.ErrorText =
      "No group blueprint found. GenerationLogic=" +
      GenerationLogic +
      ", WallLength=" +
      WallLength +
      ", Variant=" +
      requestedVariant;

    return result;
  }

  //====================================================================
  // Validate blueprint
  //====================================================================

  // Sort by Position
  retVal.sort((a: any, b: any) => a.Position - b.Position);

  // Validate positions
  const Positions: number[] = [];

  for (const row of retVal) {

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

    if (
      row.ArticleId == undefined ||
      row.ArticleId == null ||
      row.ArticleId == ""
    ) {
      result.ErrorText =
        "Invalid group blueprint. ArticleId is missing. Position=" +
        row.Position;
      return result;
    }

    const HasDockTo =
      row.DockToPosition != undefined &&
      row.DockToPosition != null &&
      row.DockToPosition !== "" &&
      row.DockToPosition > 0;

    const HasMyVector =
      row.MyDockingVector != undefined &&
      row.MyDockingVector != null &&
      row.MyDockingVector !== "";

    const HasNeighbourVector =
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
  for (const row of retVal) {

    const HasDockTo =
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

  //====================================================================
  // Success
  //====================================================================

  result.Success = true;
  result.Items = retVal;
  result.Variant = resolvedVariant;

  return result;
}