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
    // Für Processing: alle Farben auf MainColor setzen, falls nicht explizit angegeben
    if (category === 'Processing') {
      SecondColor = MainColor;
      EdgeFrontColor = MainColor;
      EdgeBackColor = MainColor;
      EdgeLeftColor = MainColor;
      EdgeRightColor = MainColor;
    } else {
      // Für andere Kategorien Standardwerte, falls nicht gesetzt
      SecondColor = SecondColor ?? 'None';
      EdgeFrontColor = EdgeFrontColor ?? 'None';
      EdgeBackColor = EdgeBackColor ?? 'NoEdge';
      EdgeLeftColor = EdgeLeftColor ?? 'None';
      EdgeRightColor = EdgeRightColor ?? 'None';
    }

    const getMatId = (color: string) =>
      color === 'NoEdge' ? 'testing101:mr_chipboard' : GlobalFunc.find_MaterialMapping(color).MaterialId!;

    const MainMaterialId = GlobalFunc.find_MaterialMapping(MainColor).MaterialId!;
    const SecondColorMaterialId = GlobalFunc.find_MaterialMapping(SecondColor).MaterialId!;
    const EdgeFrontColorId = getMatId(EdgeFrontColor);
    const EdgeBackColorId = getMatId(EdgeBackColor);
    const EdgeLeftColorId = getMatId(EdgeLeftColor);
    const EdgeRightColorId = getMatId(EdgeRightColor);

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