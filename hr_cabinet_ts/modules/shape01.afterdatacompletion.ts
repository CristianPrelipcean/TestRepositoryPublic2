// Calculate the startPos

let startPos = 0;
if (this.m.length > 0) {
  let cm = this.m[0];
  if (cm instanceof OD_M_singleDoor || cm instanceof OD_M_singleDrawer) {
    startPos = cm.startPos ?? 0;
  }
}

const docking = this.addDockingInfo(Dock.LeftBottom, new Vector3(0,0,0), new Vector3(0,0,this.depth));
this.addDockingInfo(Dock.RightBottom, new Vector3(this.width,0,0), new Vector3(this.width,0,this.depth));
this.addDockingInfo(Dock.CollisionBox, new Vector3(0,0,0), new Vector3(this.width, this.height, this.depth));

this.m.forEach(cm =>  {
  if (cm instanceof OD_M_singleDoor) {
    cm.startPos = startPos;
    startPos += cm.frontHeight!;
  }

  if (cm instanceof OD_M_singleDrawer) {
    cm.startPos = startPos;
    startPos += cm.height!;
  }
});

const roomContours = this.getRoomContours();
logInfo(JSON.stringify(roomContours));