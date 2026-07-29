find_SegmentFrontConstruction(PartGroup: string, ConstructionId: string, FrontGrainGroupId: string, SegGrainGroupId: string, SegType: string, SegColor: string, FrontStartPos: number, OverlapBtm: number): ICT_tab_SegmentFrontConstruction | undefined {

  try {

    const WildcardParams: any = {
      in_PartGroup: PartGroup,
      in_SegmentType: SegType,
      in_SegmentColor: SegColor
    };

    const FixedParams: any = {
      in_FrontConstructionId: ConstructionId,
      in_FrontColorGrainGroupId: FrontGrainGroupId,
      in_SegmentColorGrainGroupId: SegGrainGroupId
    };

    // Find entries by process_BasicTableQuery
    const rowsAny: any = GlobalFunc.process_BasicTableQuery(ct_tab_SegmentFrontConstruction, WildcardParams, FixedParams, {}, false);   
    if (!Array.isArray(rowsAny) || rowsAny.length === 0) throw "No rows!";

    // Find entries by FrontStartPos
    const rows: any[] = rowsAny;
    const startFiltered = rows.filter(r => typeof r?.in_FrontStartPos === "number" && r.in_FrontStartPos <= FrontStartPos);
    if (startFiltered.length === 0) throw "No rows based on FrontStartPos!";

    // Find entries by Overlap
    const overlapFiltered = startFiltered.filter(r => typeof r?.in_FrontOverlapBtm === "number" && r.in_FrontOverlapBtm <= OverlapBtm);
    if (overlapFiltered.length === 0) throw "No rows based on FrontOverlapBtm!";

    // Return the correct entry
    overlapFiltered.sort((a, b) => (b.in_FrontStartPos - a.in_FrontStartPos) || (b.in_FrontOverlapBtm - a.in_FrontOverlapBtm));
    return overlapFiltered[0];

  }
  catch {

    let Text = PartGroup + " - " + ConstructionId + " - " + FrontGrainGroupId + " - " + SegGrainGroupId + " - " + SegType + " - " + SegColor + " - " +  FrontStartPos  + " - " +  OverlapBtm;
    let ErrorMessage = GlobalFunc.find_ErrorList("Error 14037", 1);
    logError(ErrorMessage.Message(Text));

    return undefined;
  }
}