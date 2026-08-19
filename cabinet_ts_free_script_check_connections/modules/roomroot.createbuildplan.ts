const roomContours = this.getRoomContours();
roomContours.forEach(rc => {
  let roomPart = this.addroomPart(0, rc.level, 0, 0, 10, 0);
  let svg = '<svg><path d="';
  rc.segments.forEach(seg => {
    svg += ` ${seg.cmd} ${seg.x} ${seg.y}`;
  });
  svg += '"/></svg>';
  roomPart.extrude(svg, 'y');
});