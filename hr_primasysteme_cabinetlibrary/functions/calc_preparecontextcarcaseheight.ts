calc_PrepareContextCarcaseHeight (module: OD_M_mr_StorageunitSingle): void {

  // Read base values
  //--------------------------------------------------------

  const ceilingDistance = module.mod_CarcaseCeilingDistance ?? 0;
  const plinthHeight = module.mod_PlinthAreaHeight ?? 0;
  const countertopThk = module.mod_CountertopThk ?? 0;
  const paneltopThk = module.mod_CountertopThk ?? 0;

  // Prepare carcase height calculation
  //--------------------------------------------------------

  const carcaseInsertionHeight = module.mod_PlacementLevels === 'OnFloor' ? plinthHeight : 0;

  let topHeight = 0;
  if (module.mod_CreateCeilingFiller) topHeight += ceilingDistance;
  if (module.mod_CreateCountertop) topHeight += countertopThk;
  if (module.mod_CreatePaneltop) topHeight += paneltopThk;

  // Calculate the carcase height without automatic room-height adjustment
  //--------------------------------------------------------

  let calculatedCarcaseHeight = module.mod_Height ?? 0;

  if (module.mod_HeightInputMode === 'FullHeight') {
    calculatedCarcaseHeight -= topHeight + carcaseInsertionHeight;
  }

  // Set the carcase height
  //--------------------------------------------------------

  module.mod_CarcaseHeight = calculatedCarcaseHeight;
}