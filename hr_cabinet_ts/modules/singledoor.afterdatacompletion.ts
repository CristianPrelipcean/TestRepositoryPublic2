for (let i = 0; i < this.innerDrawerCount!; i++) {
  var s = this.addOD_M_internalDrawer();
  s.width = this.width;
  if (i == 0) {
    s.depth = this.innerDrawer1Depth;
    s.height = this.innerDrawer1Height;
    s.startPos = this.innerDrawer1Pos;
  }
  if (i == 1) {
    s.depth = this.innerDrawer2Depth;
    s.height = this.innerDrawer2Height;
    s.startPos = this.innerDrawer2Pos;
  }
}  // for
