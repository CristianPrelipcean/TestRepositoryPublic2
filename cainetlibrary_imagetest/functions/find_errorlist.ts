find_ErrorList(ErrorId: string, recursionCount: number): ICT_tab_ErrorList {

	// Check if the recursion is called more then once
	if (recursionCount > 2) {
		logFatal('Your ErrorId, you are searching for is not existing and the ErrorMessage to return this message is also missing! Please add the ErrorID 15001 to the tab_ErrorList!');
	}

	// Retrieve ErrorId from table ErrorList
	let retEntry = ct_tab_ErrorList.find(p => p.in_ErrorId === ErrorId);

	// If ErrorId can not be found, throw the error message 15001
	if (retEntry == undefined && recursionCount <= 2) {
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 15001', recursionCount + 1);
		logError(ErrorMessage.Message('') + '  SearchId: ' + ErrorId);
	}
	return retEntry!;
}