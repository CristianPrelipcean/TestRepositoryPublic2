find_HoodAssemblyMapping(ConstructionId: String, CabinetWith: Number, CabinetHeight: Number, CabinetDepth: Number, IntegrationType: String, ConstructionType: String): ICT_tab_HoodAssemblyMapping{
  //let retEntry = ct_tab_HoodAssemblyMapping.find(p => p.in_ConstructionId == ConstructionId && p.in_IntegrationType == IntegrationType && p.in_ConstructionType == ConstructionType )!;
  let retEntry = ct_tab_HoodAssemblyMapping.find(p => p.in_ConstructionId == ConstructionId )!;

  if (retEntry == undefined) {
    let Text = "no entry found for " + ConstructionId + " - " + IntegrationType + " - " + ConstructionType + " - " + CabinetWith + " * " + CabinetHeight + " * " + CabinetDepth;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 13024', 1);
    logError(ErrorMessage.Message(Text));
  } 

  return retEntry!;
}