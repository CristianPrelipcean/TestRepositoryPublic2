  // Schuler Consulting
  // Create: Oktober 2024
  // By Henning Wiesbrock
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_Fliplift01
  // Add the Partgroup for the fliplift
  // Add the Opengroup for the fliplift
  // Manage the opening behaviour of the front elements
  //
  // Revisions:
  // 
  //====================================================================

  //====================================================================
  //          Add Partgroup for the fliplift
  //====================================================================

  let FlipliftUnit=this.addpart_FlipliftUnit(0,0,0,this.mod_FrontWidth,this.mod_FrontHeight,this.mod_FrontThk);
  this.createPartGroup(this.mod_FrontId, FlipliftUnit);

  //====================================================================
  //          Add the opening group for the fliplift elements
  //====================================================================

  let nameOfOpenGroup = this.mod_FrontId;
  let openGrp = this.createOpenGroup(nameOfOpenGroup, FlipliftUnit);

  //====================================================================
  //          Manage the opening behaviour
  //====================================================================

  // Manage the opening angle
  //--------------------------------------------------------------------

  let openingAngle = 70;
  if (this.mod_OpeningAngle[0] != undefined) {
    openingAngle = JSON.parse(this.mod_OpeningAngle[0]).Angle;
  };

  // Opening Direction Fliplift Type 'UF'
  //--------------------------------------------------------------------

  if (this.mod_FlipliftType == 'UF') {
    openGrp.openMatrix = MatrixHelper.rotateX((-openingAngle), new Vector3(0, this.mod_FrontHeight, 12));
  }

  // Opening Direction Fliplift Type 'DF'
  //--------------------------------------------------------------------

  if (this.mod_FlipliftType == 'DF') {
    openingAngle = 90;
    openGrp.openMatrix = MatrixHelper.rotateX((openingAngle), new Vector3(0, this.mod_FrontThk / 2, this.mod_FrontThk / 2));
  }

  // Opening Direction Fliplift Type 'LHF'
  //--------------------------------------------------------------------

  if (this.mod_FlipliftType == 'LHF') {
    let matrix = new Matrix4();
    matrix.setPosition(0, this.mod_FrontHeight - 40, 80);
    openGrp.openMatrix = matrix;
  }

  // Opening Direction Fliplift Type 'SHF'
  //--------------------------------------------------------------------

  if (this.mod_FlipliftType == 'SHF') {
    openingAngle = 80;
    openGrp.openMatrix = MatrixHelper.rotateX((-openingAngle), new Vector3(0, this.mod_FrontHeight - 125, -200));
  }

  // Opening Direction Fliplift Type 'FHF'
  //--------------------------------------------------------------------

  if (this.mod_FlipliftType == 'FHF') {

    openingAngle = 120;
    let frontHeight1 = this.mod_FlipliftFrontHeightList[0];
    let frontHeight2 = this.mod_FlipliftFrontHeightList[1];

    //Lower part (don't know why "Top" is included to the ID)
    if (this.mod_FlipliftFrontNumber == 0) {

      // Conversion of the angle from degrees to radians
      let angleInRadians = (openingAngle * Math.PI) / 180;

      // Calculation of the position of the bottom front after the rotation (after opening)
      let rotatedZ = 35 + (frontHeight2 * Math.sin(angleInRadians));
      let rotatedY = frontHeight2 + 25 + (-frontHeight2 * Math.cos(angleInRadians));

      // Create the open matrix
      let rotationMatrix = ModuleHelper.posAndRotateX(0, rotatedY, rotatedZ, 20, new Vector3(0, rotatedY + frontHeight1, rotatedZ));
      openGrp.openMatrix = rotationMatrix;
    }

    //Upper part (like the flap UF)
    else {     
      openGrp.openMatrix = MatrixHelper.rotateX((-openingAngle), new Vector3(0, frontHeight2, 12));
    }
  }
