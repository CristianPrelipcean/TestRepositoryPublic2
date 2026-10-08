find_HardwareLibrary(SupArtNmbr:string, Supplier:string):ICT_tab_HardwareLibrary{
	let retEntry = ct_tab_HardwareLibrary.find(p=> p.in_SupplierArticleNumber == SupArtNmbr && p.in_Supplier == Supplier);
	if (retEntry == undefined) {
		let Text = 'SupplierArticleNumber: ' + SupArtNmbr + 'and Supplier: ' + Supplier;
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 12002',1)
		logError(ErrorMessage.Message(Text));
	}
	return retEntry!;
}