find_HandleLengthMapping(HandleDesign:string, FrontDim:number):ICT_tab_HandleLengthMapping{
	let retEntry = ct_tab_HandleLengthMapping.find(p=> p.in_HandleDesign == HandleDesign && p.in_FrontDimensionMin <= FrontDim && p.in_FrontDimensionMax >= FrontDim);
	if (retEntry == undefined) {
		let Text = 'HandleDesign: ' + HandleDesign + ', FrontDimension: ' + FrontDim;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13004',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}