
  // Schuler Consulting
  // Create: September 2024
  // By Stefano Cortese
  // CabinetLibrary
  //
  // Description:
  // Insert the part group
  // Create the SVG-path
  // Insert the part for counter top
  //
  // Revisions:
  // Rewrite the complete code
  // Ludwig Weber April 2025
  //
  // Add the cutouts
  // Jiri Polcar November 2025
  //===================================================

  //===================================================
  // Create Variables
  //===================================================

  let BomIdname = this.mod_CountertopId;
  let Countertopfinalwidth = this.mod_CountertopWidth;
  let TotalcounterW = this.mod_CountertopWidth;
  let CounterDepth = this.mod_CountertopDepth;
  let CounterDepthred = 0;
  let TotalcounterWRed = 0;
  let CounterWidthred = 0;
  let CounterWithCut = 0;

  interface CountertopConnection {
    type: "Long" | "Short";
    position: "Left" | "Right";
    length: number;
  }
  let connections: CountertopConnection[] = [];

  //===================================================
  // Insert the part group
  //===================================================

  let CountertopGroup = this.addpart_CountertopGroup(0, 0, 0, this.mod_CountertopWidth, this.mod_CountertopThk, this.mod_CountertopDepth);
  this.createPartGroup(BomIdname, CountertopGroup);

  CountertopGroup.pa_BomId = BomIdname;

  //===================================================
  // Create the SVG-path for the shape
  //===================================================

  // Default Path
  //---------------------------------------------------

  let Point1 = '0 0';
  let Point2 = 'H' + TotalcounterW;
  let Point3 = 'V' + CounterDepth;
  let Point4 = 'L0 ' + CounterDepth;
  let SvgPath = '';

  // Left Connection
  //---------------------------------------------------

  // Drawing data
  if (this.mod_CountertopLeftEndType === "Tongue" || this.mod_CountertopLeftEndType === "Groove") {
    connections.push({
      type: this.mod_CountertopLeftEndType === "Tongue" ? "Short" : "Long",
      position: "Left",
      length: this.mod_CountertopLeftEndType === "Tongue" ? this.mod_CountertopDepth : this.mod_CountertopConnectionLengthLeft
    });
  }

  // Left Tongue
  if (this.mod_CountertopLeftEndType == 'Tongue') {
    CounterDepthred = this.mod_CountertopDepth - this.mod_CountertopConnectionOversize;
    Point1 = '-' + this.mod_CountertopConnectionOversize + ' 0';
    Point4 = 'L0 ' + CounterDepth + ' L-' + this.mod_CountertopConnectionOversize + ' ' + CounterDepthred;
    Countertopfinalwidth = Countertopfinalwidth + this.mod_CountertopConnectionOversize;
  }

  // Left Groove
  else if (this.mod_CountertopLeftEndType == 'Groove') {
    CounterWidthred = this.mod_CountertopConnectionLengthLeft - this.mod_CountertopConnectionOversize;
    CounterDepthred = this.mod_CountertopDepth - this.mod_CountertopConnectionOversize;
    Point4 = 'L' + this.mod_CountertopConnectionLengthLeft + ' ' + this.mod_CountertopDepth + ' L' + CounterWidthred + ' ' + CounterDepthred + ' L0 ' + CounterDepthred;
  }

  // Right Connection
  //---------------------------------------------------

  // Drawing data
  if (this.mod_CountertopRightEndType === "Tongue" || this.mod_CountertopRightEndType === "Groove") {
    connections.push({
      type: this.mod_CountertopRightEndType === "Tongue" ? "Short" : "Long",
      position: "Right",
      length: this.mod_CountertopRightEndType === "Tongue" ? this.mod_CountertopDepth : this.mod_CountertopConnectionLengthRight
    });
  }

  // Right Tongue
  if (this.mod_CountertopRightEndType == 'Tongue') {
    Countertopfinalwidth = Countertopfinalwidth + this.mod_CountertopConnectionOversize;
    TotalcounterW = this.mod_CountertopWidth + this.mod_CountertopConnectionOversize;
    TotalcounterWRed = this.mod_CountertopWidth;
    CounterDepth = this.mod_CountertopDepth;
    CounterDepthred = this.mod_CountertopDepth - this.mod_CountertopConnectionOversize;
    Point2 = 'H' + TotalcounterW;
    Point3 = 'V' + CounterDepthred + ' L' + TotalcounterWRed + ' ' + CounterDepth;
  }

  // Right Groove
  else if (this.mod_CountertopRightEndType == 'Groove') {
    CounterDepthred = this.mod_CountertopDepth - this.mod_CountertopConnectionOversize;
    CounterWidthred = this.mod_CountertopWidth - this.mod_CountertopConnectionLengthRight + this.mod_CountertopConnectionOversize;
    CounterWithCut = this.mod_CountertopWidth - this.mod_CountertopConnectionLengthRight;
    Point3 = 'V' + CounterDepthred + ' H' + CounterWidthred + ' L' + CounterWithCut + ' ' + this.mod_CountertopDepth;
  }

  // Combine the path information
  //---------------------------------------------------

  SvgPath = 'M' + Point1 + ' ' + Point2 + ' ' + Point3 + ' ' + Point4;

  //===================================================
  // Create the SVG-path for the cutout
  //===================================================

  // Parse countertop info for the cutouts
  //---------------------------------------------------

  const parsedCutoutInfo = this.mod_CountertopInfo
    .map(info => {
      const parsed = JSON.parse(info);
      if (parsed.CutoutData) {
        return JSON.parse(parsed.CutoutData);
      }
      return undefined;
    })
    .filter(data => data !== undefined);

  // Create SVG path for each cutout
  //---------------------------------------------------
  parsedCutoutInfo.forEach(cutout => {

    if (!cutout.CutPosX || !cutout.CutPosY || !cutout.CutWidth || !cutout.CutDepth) {
      logError(`mod_CountertopInfo - required data is missing. Skipping the hole creation. CutPosX: ${cutout.CutPosX}, CutPosY: ${cutout.CutPosY}, CutWidth: ${cutout.CutWidth}, CutDepth: ${cutout.CutDepth}`);
    }

    const startX = cutout.CutPosX - cutout.CutWidth / 2;
    const endX = cutout.CutPosX + cutout.CutWidth / 2;
    const startY = this.mod_CountertopDepth - cutout.CutPosY;
    const endY = this.mod_CountertopDepth - (cutout.CutPosY + cutout.CutDepth);
    const r = cutout.CutRadius ?? 0;

    // Rounded rectangle path for cutout with radius r
    if (r > 0) {
      SvgPath += ` M ${startX + r} ${startY}`;
      SvgPath += ` H ${endX - r}`;
      SvgPath += ` A ${r} ${r} 0 0 0 ${endX} ${startY - r}`;
      SvgPath += ` V ${endY + r}`;
      SvgPath += ` A ${r} ${r} 0 0 0 ${endX - r} ${endY}`;
      SvgPath += ` H ${startX + r}`;
      SvgPath += ` A ${r} ${r} 0 0 0 ${startX} ${endY + r}`;
      SvgPath += ` V ${startY - r}`;
      SvgPath += ` A ${r} ${r} 0 0 0 ${startX + r} ${startY}`;
      SvgPath += ' Z';
    }

    // Simple rectangle path for cutout without radius
    else {
      SvgPath += ` M ${startX} ${startY} H ${endX} V ${endY} H ${startX} Z`;
    }
  });

  //===================================================
  // Insert the part for counter top
  //===================================================

  let FinishPanel = this.addpart_Countertop(0, 0, 0, Countertopfinalwidth, this.mod_CountertopThk, this.mod_CountertopDepth);
  FinishPanel.extrude('<svg><path d="' + SvgPath + '"></path></svg>', 'y');
  GlobalFunc.process_AddMaterial(FinishPanel, 'countertop', this.mod_CountertopColor, this.mod_CountertopColor, this.mod_CountertopColor, this.mod_CountertopColor, 'None', false, true);
  this.assignPartGroup(BomIdname, FinishPanel);

  // Add the Information for the countertop drawings
  let countertopInfos = {
    Countertops: [...this.mod_CountertopInfo],
    Connections: connections
  };

  // Set the attributes of the countertop
  FinishPanel.pa_CountertopInfo = JSON.stringify(countertopInfos);
  FinishPanel.pa_BomId = BomIdname;
  FinishPanel.pa_EdgeFrontType = "FRE";
  FinishPanel.pa_EdgeLeftType = this.mod_CountertopEdgeLeftType == "Straight" ? "FRE" : "NOE";
  FinishPanel.pa_EdgeRightType = this.mod_CountertopEdgeRightType == "Straight" ? "FRE" : "NOE";
  FinishPanel.pa_EdgeBackType = "NOE";