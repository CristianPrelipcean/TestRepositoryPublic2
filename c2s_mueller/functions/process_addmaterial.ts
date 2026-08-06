process_AddMaterial(
  part: IPartBase,
  category: string = 'None',
  PartGrain: string = 'None',
  MainColor: string = 'None',
  SecondColor?: string,
  EdgeFrontColor?: string,
  EdgeBackColor?: string,
  EdgeLeftColor?: string,
  EdgeRightColor?: string,
) {
  try {
    // For Processing: set all colors to MainColor
    if (category === 'Processing') {
      SecondColor = MainColor;
      EdgeFrontColor = MainColor;
      EdgeBackColor = MainColor;
      EdgeLeftColor = MainColor;
      EdgeRightColor = MainColor;
    } else {
      // Colors for the standard case, if not provided, set to default values
      SecondColor = SecondColor ?? 'None';
      EdgeFrontColor = EdgeFrontColor ?? 'None';
      EdgeBackColor = EdgeBackColor ?? 'NoEdge';
      EdgeLeftColor = EdgeLeftColor ?? 'None';
      EdgeRightColor = EdgeRightColor ?? 'None';
    }

    // Get the material ID for an edge
    const getMatId = (color: string, mainMaterialId: string): string => {

      // No edge assigned: use the board category or fall back to the main material
      if (color === "NoEdge" || color === "NoEdgeband") {
          const mappingData = GlobalFunc.find_BoardMapping(MainColor, part._thickness);
          const boardData = GlobalFunc.find_BoardLibrary(mappingData?.BoardId ?? "");

          if (boardData[0]?.Category) {
              const categoryMapping = GlobalFunc.find_MaterialMapping(boardData[0].Category, false);

              if (categoryMapping?.MaterialId) {
                  return categoryMapping.MaterialId;
              }
          }

          return mainMaterialId;
      }

      // Edge assigned: map its material
      const edgeMapping = GlobalFunc.find_MaterialMapping(color);

      if (!edgeMapping?.MaterialId) {
          throw new Error(`Material '${color}' nicht gefunden.`);
      }

      return edgeMapping.MaterialId;
    };

    const MainMaterialId = GlobalFunc.find_MaterialMapping(MainColor).MaterialId!;
    const SecondColorMaterialId = GlobalFunc.find_MaterialMapping(SecondColor).MaterialId!;
    const EdgeFrontColorId = getMatId(EdgeFrontColor, MainMaterialId);
    const EdgeBackColorId = getMatId(EdgeBackColor, MainMaterialId);
    const EdgeLeftColorId = getMatId(EdgeLeftColor, MainMaterialId);
    const EdgeRightColorId = getMatId(EdgeRightColor, MainMaterialId);

    type FaceMaterial = [string, FaceKey, number, number, number, number, number];

    const mapping: Record<string, Record<string, FaceMaterial[]>> = {
      Front: {
        Lengthwise: [
          [EdgeLeftColorId, FaceKey.Left, 90, 0, 0, 1, 1],
          [EdgeRightColorId, FaceKey.Right, 90, 0, 0, 1, 1],
          [EdgeFrontColorId, FaceKey.Top, 0, 0, 0, 1, 1],
          [EdgeBackColorId, FaceKey.Bottom, 0, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Front, 0, 0, 0, 1, 1],
          [SecondColorMaterialId, FaceKey.Back, 0, 0, 0, 1, 1],
        ],
        Crosswise: [
          [EdgeLeftColorId, FaceKey.Left, 90, 0, 0, 1, 1],
          [EdgeRightColorId, FaceKey.Right, 90, 0, 0, 1, 1],
          [EdgeFrontColorId, FaceKey.Top, 0, 0, 0, 1, 1],
          [EdgeBackColorId, FaceKey.Bottom, 0, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Front, 90, 0, 0, 1, 1],
          [SecondColorMaterialId, FaceKey.Back, 90, 0, 0, 1, 1],
        ],
        None: [
          [EdgeLeftColorId, FaceKey.Left, 90, 0, 0, 1, 1],
          [EdgeRightColorId, FaceKey.Right, 90, 0, 0, 1, 1],
          [EdgeFrontColorId, FaceKey.Top, 0, 0, 0, 1, 1],
          [EdgeBackColorId, FaceKey.Bottom, 0, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Front, 0, 0, 0, 1, 1],
          [SecondColorMaterialId, FaceKey.Back, 0, 0, 0, 1, 1],
        ],
      },
      Shelf: {
        Crosswise: [
          [EdgeLeftColorId, FaceKey.Left, 0, 0, 0, 1, 1],
          [EdgeRightColorId, FaceKey.Right, 0, 0, 0, 1, 1],
          [EdgeFrontColorId, FaceKey.Front, 0, 0, 0, 1, 1],
          [EdgeBackColorId, FaceKey.Back, 0, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Top, 90, 0, 0, 1, 1],
          [SecondColorMaterialId, FaceKey.Bottom, 90, 0, 0, 1, 1],
        ],
        Lengthwise: [
          [EdgeLeftColorId, FaceKey.Left, 0, 0, 0, 1, 1],
          [EdgeRightColorId, FaceKey.Right, 0, 0, 0, 1, 1],
          [EdgeFrontColorId, FaceKey.Front, 0, 0, 0, 1, 1],
          [EdgeBackColorId, FaceKey.Back, 0, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Top, 0, 0, 0, 1, 1],
          [SecondColorMaterialId, FaceKey.Bottom, 0, 0, 0, 1, 1],
        ],
        None: [
          [EdgeLeftColorId, FaceKey.Left, 0, 0, 0, 1, 1],
          [EdgeRightColorId, FaceKey.Right, 0, 0, 0, 1, 1],
          [EdgeFrontColorId, FaceKey.Front, 0, 0, 0, 1, 1],
          [EdgeBackColorId, FaceKey.Back, 0, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Top, 0, 0, 0, 1, 1],
          [SecondColorMaterialId, FaceKey.Bottom, 0, 0, 0, 1, 1],
        ],
      },
      Side: {
        Lengthwise: [
          [EdgeLeftColorId, FaceKey.Top, 90, 0, 0, 1, 1],
          [EdgeRightColorId, FaceKey.Bottom, 90, 0, 0, 1, 1],
          [EdgeFrontColorId, FaceKey.Front, 90, 0, 0, 1, 1],
          [EdgeBackColorId, FaceKey.Back, 90, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Right, 90, 0, 0, 1, 1],
          [SecondColorMaterialId, FaceKey.Left, 90, 0, 0, 1, 1],
        ],
        Crosswise: [
          [EdgeLeftColorId, FaceKey.Top, 90, 0, 0, 1, 1],
          [EdgeRightColorId, FaceKey.Bottom, 90, 0, 0, 1, 1],
          [EdgeFrontColorId, FaceKey.Front, 90, 0, 0, 1, 1],
          [EdgeBackColorId, FaceKey.Back, 90, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Right, 0, 0, 0, 1, 1],
          [SecondColorMaterialId, FaceKey.Left, 0, 0, 0, 1, 1],
        ],
        None: [
          [EdgeLeftColorId, FaceKey.Top, 0, 0, 0, 1, 1],
          [EdgeRightColorId, FaceKey.Bottom, 0, 0, 0, 1, 1],
          [EdgeFrontColorId, FaceKey.Front, 0, 0, 0, 1, 1],
          [EdgeBackColorId, FaceKey.Back, 0, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Right, 0, 0, 0, 1, 1],
          [SecondColorMaterialId, FaceKey.Left, 0, 0, 0, 1, 1],
        ],
      },
      Processing: {
        None: [
          [MainMaterialId, FaceKey.Left, 0, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Right, 0, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Top, 0, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Bottom, 0, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Front, 0, 0, 0, 1, 1],
          [MainMaterialId, FaceKey.Back, 0, 0, 0, 1, 1],
        ],
      },
    };

    const matsForCategory = mapping[category];
    if (!matsForCategory) return;
    const matsForGrain = matsForCategory[PartGrain] || matsForCategory['None'];
    if (!matsForGrain) return;

    for (const [matId, face, rot, x, y, scaleX, scaleY] of matsForGrain) {
      part.addFaceMaterial(matId, face, rot, x, y, scaleX, scaleY);
    }
  } catch (error: any) {
    logError("Can not create the materials and show it for part.");
  }
}