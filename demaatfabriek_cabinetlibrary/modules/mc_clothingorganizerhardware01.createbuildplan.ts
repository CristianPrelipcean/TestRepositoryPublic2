
  let organizerHardware = this.addpart_ClothingOrganizer(0, 0, 0, 571, 212, 702);
  let [retGraphicLib, graphicFile] = GlobalFunc.process_GraphicLibraryData("Conero_445_628");
  if (graphicFile) {
    organizerHardware.assign3DModel(graphicFile.Model3D);
  }