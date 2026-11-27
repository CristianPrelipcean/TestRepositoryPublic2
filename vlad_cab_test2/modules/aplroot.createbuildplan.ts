let contours = this.getGenerationContours();
contours.forEach((gc) => {
  let apl = this.add999_APL(gc.position.x, gc.height, gc.position.z, 0, this.thickness, 0);
  let svg = '<svg><path d="';
  gc.contour._entries.forEach((entry) => {
    svg += entry.posType;
    if (entry.x !== undefined) {
      svg += entry.x + ' ';
    }
    if (entry.y !== undefined) {
      svg += entry.y + ' ';
    }
  });
  svg += '"/></svg>';
  apl.extrude(svg, 'y');
});