  this.setOrigin(0, this.startPos!, 0);
  let openGrp;
  let openGrpAngle = 120;
  let hinge = this.hinge;
  let hingeDimX = 100;
  let hingePosX = hinge === 'right'
    ? this.sidePanelThickness
    : this.width - hingeDimX - this.sidePanelThickness;

  const grpId = "door" + uuidv4();

  {
    let p = this.add160_DoorLeft(0, 0, this.parent.depth!,
      this.width, this.frontHeight, this.sidePanelThickness);

    openGrp = this.createOpenGroup(this._id, p);

    if (hinge === 'right') {
      openGrp.openMatrix = MatrixHelper.rotateY(-openGrpAngle, new Vector3(0, 0, this.parent.depth!));
    }
    else {
      openGrp.openMatrix = MatrixHelper.rotateY(openGrpAngle, new Vector3(this.width, 0, this.parent.depth!));
    }

    if (this.use3DModelForDoorLeft) {
      const model3d = ct_KeyTable[0].Model3d;
      p.assign3DModel(model3d, this.hide3DModelIfOpened);
    }

    if (this.use3DModelOpenForDoorLeft) {
      const model3dOpen = ct_KeyTable[1].Model3d;
      p.assign3DModelOpen(model3dOpen);
    }

    if (!this.use3DModelForDoorLeft && !this.use3DModelOpenForDoorLeft) {
      p.extrude(`<svg width="${this.width}" height="${this.frontHeight}">` + `<rect x="0" y="0" rx="100" ry="100" width="${this.width}" height="${this.frontHeight}" />` + "</svg>", "z");
    }

    var grp = this.createPartGroup(grpId, p);

    this.assignPartGroup("corpus", p);  // Move the door group *below* the corpus
  }
  {
    if (hinge === 'left') {
      let p = this.add999_ScharnierL(hingePosX, this.frontHeight / 4, this.parent.depth! - this.sidePanelThickness,
        hingeDimX, 35, 15);
      this.assignPartGroup(grpId, p);
      this.assignOpenGroup(this._id, p);
    }
    else {
      let p = this.add999_ScharnierR(hingePosX, this.frontHeight / 4, this.parent.depth!,
        hingeDimX, 35, 15);
      this.assignPartGroup(grpId, p);
      this.assignOpenGroup(this._id, p);
    }
  }
  {
    if (hinge === 'left') {
      let p = this.add999_ScharnierL(hingePosX, this.frontHeight / 4 + (2 * (this.frontHeight / 4)), this.parent.depth! - this.sidePanelThickness,
        hingeDimX, 35, 15);
      this.assignPartGroup(grpId, p);
      this.assignOpenGroup(this._id, p);
    }
    else {
      let p = this.add999_ScharnierR(hingePosX, this.frontHeight / 4 + (2 * (this.frontHeight / 4)), this.parent.depth! - this.sidePanelThickness,
        hingeDimX, 35, 15);
      this.assignPartGroup(grpId, p);
      this.assignOpenGroup(this._id, p);
    }
  }
  {
    let referenceLength = this.width;
    if (this.handleOrientation === "Ver") {
      referenceLength = this.frontHeight;
    }

    let handleWidth = referenceLength * 0.3;
    let handleHeight = 10;
    let handleDepth = 10;
    let handlePosX = (referenceLength - handleWidth) / 2;
    let p = this.addhandle_01(handlePosX, this.handleOffset, this.parent.depth! + this.sidePanelThickness, handleWidth, handleHeight, handleDepth);
    openGrp.addPart(p);

    if (this.handleOrientation === "Ver") {
      let rotMatrix: Matrix4;
      if (hinge === 'left') {
        rotMatrix = MatrixHelper.rotateZ(90, new Vector3(0, 0, 0)) // rotation 90° (x,y) => (y,-x)
          .multiply(new Matrix4().setPosition(0, -this.width, 0));
      }
      else {
        rotMatrix = MatrixHelper.rotateZ(90, new Vector3(0, 0, 0)) // rotation 90° (x,y) => (y,-x)
          .multiply(new Matrix4().setPosition(0, -this.width * 0.3, 0));
      }
      p.setMatrix(rotMatrix);
    }

    this.assignPartGroup(grpId, p);
  }