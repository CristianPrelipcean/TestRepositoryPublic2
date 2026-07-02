find_PulloutMapping(PulloutType:string, PulloutDesign:string, PulloutElementColor:string, PulloutConnectionPosition:string, OpeningType:string){

	let retEntry = ct_tab_PulloutMapping.find(p=> p.in_PulloutType == PulloutType && p.in_PulloutDesign == PulloutDesign && p.in_PulloutElementColor == PulloutElementColor && p.in_PulloutConnectionPosition == PulloutConnectionPosition && p.in_PulloutOpeningType == OpeningType);
		if (retEntry == undefined) {
		let Text =  PulloutType + ' - ' + PulloutDesign + ' - ' + PulloutElementColor + ' - ' + PulloutConnectionPosition + ' - ' + OpeningType;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 13030',1)
		logError(ErrorMessage.Message(Text));
		}

	return retEntry;
}