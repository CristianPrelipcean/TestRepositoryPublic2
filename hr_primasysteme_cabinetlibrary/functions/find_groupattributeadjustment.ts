find_GroupAttributeAdjustment(AdjustmentId: string): ICT_tab_GroupAttributeAdjustment[] {
  const retEntries = ct_tab_GroupAttributeAdjustment.filter(p => p.in_AdjustmentId == AdjustmentId);

  if (retEntries.length == 0) {
    const ErrorMessage = GlobalFunc.find_ErrorList('Error 15005', 1);
    logError(ErrorMessage.Message(AdjustmentId));
  }

  return retEntries;
}