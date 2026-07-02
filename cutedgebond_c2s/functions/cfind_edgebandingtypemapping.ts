cfind_EdgeBandingTypeMapping(EdgeBandingType:string, EdgeBandingClass:string):ICT_ctab_EdgeBandingTypeMapping{
  let retEntry = ct_ctab_EdgeBandingTypeMapping.find(p=> p.in_EdgeBandingType == EdgeBandingType && p.in_EdgeBandingClass == EdgeBandingClass);	
	if (retEntry== undefined) {
		let Text = 'Edge banding type: ' + EdgeBandingType + 'Edge banding class: ' + EdgeBandingClass;
		logError(Text);
	}
	return retEntry!;
}