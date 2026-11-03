check_TypeBoardDimensions_getDropDownValues_mod_BtmColor(attr: Checks.ITypeBoardDimensions_Attributes, selections: SelectionEntry_mod_BtmColor[]): Checks.CheckDropDownEntry[]{
if (GlobalFunc.allPropertiesDefined(attr)) {
    const result: Checks.CheckDropDownEntry[] = [];

    const colorMatches = ct_ctab_BoardDimensionSettings.filter(
      x => x.in_TopColor === attr.mod_Color && x.in_Grain === attr.mod_PartGrain);

    const matches = ct_ctab_BoardDimensionSettings.filter(
      x => x.in_TypeElement === attr.mod_TypeElement && x.in_Program === attr.mod_Program && x.in_TopColor === attr.mod_Color && x.in_Grain === attr.mod_PartGrain && x.in_PartThk === attr.mod_Thickness);

    // Favourite bottom colors
    const favouriteValues = new Set(
      matches.filter(x => x.FavouriteBtmColor === true).map(x => String(x.in_BtmColor)));

    for (const selection of selections) {

      const isColorMatches = colorMatches.find(m => m.in_BtmColor === selection.value) !== undefined;

      if (!isColorMatches) {result.push({value: selection.value,kind: Checks.CheckDropDownEntryKind.Invalid});
        continue;
      }

      // Search for more values
      const isMatched = matches.find(m => m.in_BtmColor === selection.value) !== undefined;

      result.push({value: selection.value,kind: isMatched ? Checks.CheckDropDownEntryKind.Normal : Checks.CheckDropDownEntryKind.Conflicting,showAsNormal: true});
    }

    // Favourite first
    result.sort(
      (a, b) => {
        const aIsFavourite =
          (typeof a.value === "string" || typeof a.value === "number") &&
          favouriteValues.has(String(a.value));

        const bIsFavourite =
          (typeof b.value === "string" || typeof b.value === "number") &&
          favouriteValues.has(String(b.value));

        return Number(bIsFavourite) - Number(aIsFavourite);
      }
    );

    return result;
  }


  let matches = ct_ctab_BoardDimensionSettings;

  if (attr.mod_Program !== undefined) {
    matches = matches.filter(
      x => x.in_Program === attr.mod_Program
    );
  }

  if (attr.mod_TypeElement !== undefined) {
    matches = matches.filter(
      x => x.in_TypeElement === attr.mod_TypeElement
    );
  }

  if (attr.mod_Color !== undefined) {
    matches = matches.filter(
      x => x.in_TopColor === attr.mod_Color
    );
  }

  if (attr.mod_PartGrain !== undefined) {
    matches = matches.filter(
      x => x.in_Grain === attr.mod_PartGrain
    );
  }

  if (attr.mod_Thickness !== undefined) {
    matches = matches.filter(
      x => x.in_PartThk === attr.mod_Thickness
    );
  }

  // Favourite bottom colors
  const favouriteValues = new Set(
    matches
      .filter(x => x.FavouriteBtmColor === true)
      .map(x => String(x.in_BtmColor))
  );

  const result: Checks.CheckDropDownEntry[] = [];

  for (const selection of selections) {

    const isMatched =
      matches.find(
        m => m.in_BtmColor === selection.value
      ) !== undefined;

    result.push({
      value: selection.value,
      kind: isMatched
        ? Checks.CheckDropDownEntryKind.Normal
        : Checks.CheckDropDownEntryKind.Conflicting
    });
  }

  // Favoriten first
  result.sort(
    (a, b) => {
      const aIsFavourite =
        (typeof a.value === "string" || typeof a.value === "number") &&
        favouriteValues.has(String(a.value));

      const bIsFavourite =
        (typeof b.value === "string" || typeof b.value === "number") &&
        favouriteValues.has(String(b.value));

      return Number(bIsFavourite) - Number(aIsFavourite);
    }
  );

  return result;
}