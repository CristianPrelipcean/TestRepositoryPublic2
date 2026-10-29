
  // Schuler Consulting
  // Create: September 2023
  // By Stefano Cortese
  // Purpose: CabinetLibrary
  //
  // Description:
  // CreateBuildPlan of mc_Door01
  // Add Partgroup for the door
  // Add the opening for the doors
  //
  // Revisions:
  // 18.10.2024 Ludwig Weber
  // Add Error handling
  //====================================================================

  //====================================================================
  //          Add Partgroup for the door
  //====================================================================

  let DoorUnit=this.addpart_DoorUnit(0,0,0,this.mod_FrontWidth,this.mod_FrontHeight,this.mod_FrontThk);
  this.createPartGroup(this.mod_FrontId, DoorUnit);

  //====================================================================
  //          Add the open group for the door (opening the door)  
  //====================================================================

  let nameOfOpenGroup = this.mod_FrontId;
  let openGrp = this.createOpenGroup(nameOfOpenGroup, DoorUnit);

  //====================================================================
  //          Open matrix (opening the door)         
  //====================================================================

  // Error-Handling
  let openingAngle = 85;
  if(this.mod_OpeningAngle[0] != undefined){
    //openingAngle =JSON.parse(this.mod_OpeningAngle[0]).Angle;
  };

  // Set the open matrix
  if(this.mod_DoorDirection == 'Left'){
    openGrp.openMatrix = MatrixHelper.rotateY((360-openingAngle), new Vector3(8, 0, 12));
  }
  else{
    openGrp.openMatrix = MatrixHelper.rotateY(openingAngle, new Vector3(this.mod_FrontWidth-8, 0, 12));
  }

