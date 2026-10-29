find_PushtoopenMapping(Position:string, Type:string, PartThk:number, FrontOverlay:number, Weight:number, Color:string):ICT_tab_PushtoopenMapping{

  ////// NOTE: /////
  // This function does not have error message, because where it is being used we are controlling if the result is empty

  // First try with all inputs
  let retEntry = ct_tab_PushtoopenMapping.find(p => p.in_Position == Position && p.in_Type == Type && p.in_PartThkMin! < PartThk && p.in_PartThkMax! >= PartThk && p.in_FrontOverlayMin! <= FrontOverlay && p.in_WeightMin! <= Weight && p.in_WeightMax! >= Weight && p.in_Color == Color);

  // If we got no result, then try with Wildcard All in Color
  if (retEntry == undefined) {
    retEntry = ct_tab_PushtoopenMapping.find(p => p.in_Position == Position && p.in_Type == Type  && p.in_PartThkMin! < PartThk && p.in_PartThkMax! >= PartThk && p.in_FrontOverlayMin! <= FrontOverlay && p.in_WeightMin! <= Weight && p.in_WeightMax! >= Weight && p.in_Color == 'All');
  }

  return retEntry!;
  
} 