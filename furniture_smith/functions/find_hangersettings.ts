find_HangerSettings(TypeElement: string, CarcaseHeight: number, CarcaseWidth: number, Weight: number, DistanceBehindBackwall: number, BackwallPosition: number):ICT_tab_HangerSettings{

	// Save original values of variables that allow wildcards
	let TypeElement_IN = TypeElement;

	let retEntry: any;
	
	let i=1;
	do 
	{
		if (i==1)
		{
			TypeElement = TypeElement_IN;
		}
		else if(i==2)
		{
			TypeElement = 'All';
		}

		//Query the table
		retEntry = queryTable(TypeElement,  CarcaseHeight, CarcaseWidth, Weight, DistanceBehindBackwall, BackwallPosition);	
		i++;
	} while ( retEntry == undefined && i <= 2)
	
	if (retEntry == undefined) {
		let Text = ' TypeElement: ' + TypeElement_IN + ' and CarcaseHeight: ' + CarcaseHeight + ' and CarcaseWidth: ' + CarcaseWidth + ' and Weight: ' + Weight + ' and DistanceBehindBackwall: ' + DistanceBehindBackwall + ' and BackwallPosition: ' + BackwallPosition;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14010',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry;
	
	
	function queryTable(TypeElement: string, CarcaseHeight: number, CarcaseWidth: number, Weight: number, DistanceBehindBackwall: number, BackwallPosition: number):ICT_tab_HangerSettings{
	
		let TableResult = ct_tab_HangerSettings.find(p=> p.in_TypeElement! == TypeElement && p.in_CarcaseHeightMin! <= CarcaseHeight && p.in_CarcaseHeightMax! >= CarcaseHeight && p.in_CarcaseWidthMin! <= CarcaseWidth && p.in_CarcaseWidthMax! >= CarcaseWidth && p.in_WeightMin! <= Weight && p.in_WeightMax! >= Weight && p.in_DistanceBehindBackwallMin! <= DistanceBehindBackwall && p.in_BackwallPositionMin! <= BackwallPosition && p.in_BackwallPositionMax! >= BackwallPosition)!;
		return TableResult;
	}
	
	
}
