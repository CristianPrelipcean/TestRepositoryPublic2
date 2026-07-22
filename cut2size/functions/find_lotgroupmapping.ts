find_LotGroupMapping(TypeElement:string, ProductGroup:string, PartDesign:string, GrainPatternRelevant:boolean):ICT_tab_LotGroupMapping{
	let retEntry = ct_tab_LotGroupMapping.find(p=> p.in_TypeElement == TypeElement && p.in_ProductGroup == ProductGroup && p.in_PartDesign == PartDesign && p.in_GrainPatternRelevant == GrainPatternRelevant);
		if (retEntry == undefined) {
		logError('ErrorMessage: Could not find entry in tab_LotGroupMapping for Type element: ' + TypeElement + 'Product group: ' + ProductGroup + 'Part design: ' + PartDesign);
	}	
	return retEntry!;
}