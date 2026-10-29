find_HardwareSettings(SupArtNmbr:string, Supplier:string):ICT_tab_HardwareSettings{
	let retEntry = ct_tab_HardwareSettings.find(p=> p.in_SupplierArticleNumber == SupArtNmbr && p.in_Supplier == Supplier);
	if (retEntry == undefined) {
		logError('Error 14008: Could not find entry in tab_HardwareSettings for SupplierArticleNumber: ' + SupArtNmbr + ', Supplier: ' + Supplier);
	}
	return retEntry!;
}