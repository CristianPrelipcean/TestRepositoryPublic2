  const openGrpAngle = 120;

  this.setOrigin(16, 16, this.startPos);
  const part = this.addboxPart(0, 0, 0, this.width - 2 * this.sidePanelThickness, this.height, this.depth);

  const openGrp = this.createOpenGroup(this._id, part);
  if (this.parent.hinge === 'right') {
    openGrp.openMatrix = MatrixHelper.rotateY(-openGrpAngle, new Vector3(0, 0, 500 + this.depth - this.startPos));
  }
  else {
    openGrp.openMatrix = MatrixHelper.rotateY(openGrpAngle, new Vector3(this.width, 0, 500 + this.depth - this.startPos));
  }