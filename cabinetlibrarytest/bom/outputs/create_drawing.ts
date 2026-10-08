// Schuler Consulting
// Create: April 2025
// By Jiri Polcar (Roomle)
// Purpose: HOMAG drawings generation
//
// Description:
// Converts PartElements to drawings
//
//==================================================================================

      const { PartDrawing, SetDrawingOptions } = GlobalFunc.process_DrawingCalculationsApi();

      SetDrawingOptions(this.g);

const partDrawing = new PartDrawing({
  part: part,
  bomEntries: bomEntries,
});

const newSvgCode = partDrawing.svg.toString();
this.createFileEntry(result, part._partId + "_" + part._id + ".svg", newSvgCode);