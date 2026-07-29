find_HandleMapping(HandleDesign:string, HandleColor:string, PosType:string, HandleLength:number, HandleLenRelevant:boolean, HandlePosTypeRelevant:boolean, HandleColorRelevant:boolean):ICT_tab_HandleMapping{

	// Initialize Varaibles
	let retEntry:any;
	let ErrMsg:string = 'NoMsg';

	// Version 1
	if(HandleLenRelevant == true && HandleColorRelevant == true && HandlePosTypeRelevant == true){
		retEntry = ct_tab_HandleMapping.find(p=> p.in_HandleDesign == HandleDesign && p.in_HandleColor == HandleColor && p.in_HandlePosType == PosType && p.in_HandleLength == HandleLength);
		ErrMsg = 'Error 13003: Could not find entry in tab_HandleMapping for HandleDesign: ' + HandleDesign + ', HandleColor: ' + HandleColor + ', PosType: ' + PosType + ', HandleLength: ' + HandleLength;
	}

	// Version 2
	if(HandleLenRelevant == false && HandleColorRelevant == false && HandlePosTypeRelevant == false){
		retEntry = ct_tab_HandleMapping.find(p=> p.in_HandleDesign == HandleDesign);
		ErrMsg = 'Error 13003: Could not find entry in tab_HandleMapping for HandleDesign: ' + HandleDesign;
	}

	// Version 3
	if(HandleLenRelevant == true && HandleColorRelevant == false && HandlePosTypeRelevant == false){
		retEntry = ct_tab_HandleMapping.find(p=> p.in_HandleDesign == HandleDesign && p.in_HandleLength == HandleLength);
		ErrMsg = 'Error 13003: Could not find entry in tab_HandleMapping for HandleDesign: ' + HandleDesign + ', HandleLength: ' + HandleLength;
	}

	// Version 4
	if(HandleLenRelevant == false && HandleColorRelevant == true && HandlePosTypeRelevant == false){
		retEntry = ct_tab_HandleMapping.find(p=> p.in_HandleDesign == HandleDesign && p.in_HandleColor == HandleColor);
		ErrMsg = 'Error 13003: Could not find entry in tab_HandleMapping for HandleDesign: ' + HandleDesign + ', HandleColor: ' + HandleColor;
	}

	// Version 5
	if(HandleLenRelevant == false && HandleColorRelevant == false && HandlePosTypeRelevant == true){
		retEntry = ct_tab_HandleMapping.find(p=> p.in_HandleDesign == HandleDesign && p.in_HandlePosType == PosType);
		ErrMsg = 'Error 13003: Could not find entry in tab_HandleMapping for HandleDesign: ' + HandleDesign + ', PosType: ' + PosType;
	}

	// Version 6
	if(HandleLenRelevant == true && HandleColorRelevant == true && HandlePosTypeRelevant == false){
		retEntry = ct_tab_HandleMapping.find(p=> p.in_HandleDesign == HandleDesign && p.in_HandleLength == HandleLength && p.in_HandleColor == HandleColor);
		ErrMsg = 'Error 13003: Could not find entry in tab_HandleMapping for HandleDesign: ' + HandleDesign + ', HandleLength: ' + HandleLength + ', HandleColor: ' + HandleColor;
	}

	// Version 7
	if(HandleLenRelevant == false && HandleColorRelevant == true && HandlePosTypeRelevant == true){
		retEntry = ct_tab_HandleMapping.find(p=> p.in_HandleDesign == HandleDesign && p.in_HandleColor == HandleColor && p.in_HandlePosType == PosType);
		ErrMsg = 'Error 13003: Could not find entry in tab_HandleMapping for HandleDesign: ' + HandleDesign + ', HandleColor: ' + HandleColor + ', PosType: ' + PosType;
	}

	// Version 8
	if(HandleLenRelevant == true && HandleColorRelevant == false && HandlePosTypeRelevant == true){
		retEntry = ct_tab_HandleMapping.find(p=> p.in_HandleDesign == HandleDesign && p.in_HandleLength == HandleLength && p.in_HandlePosType == PosType);
		ErrMsg = 'Error 13003: Could not find entry in tab_HandleMapping for HandleDesign: ' + HandleDesign + ', HandleLength: ' + HandleLength + ', PosType: ' + PosType;
	}

	if (retEntry == undefined) {
		logError(ErrMsg);
	}

	// Return Value
	return retEntry!;
}