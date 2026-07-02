find_FillerHardwareSettings(TypeElement: string, FillerType: string, FillerHardwareType: string, FrontHeight: number, FrontWidth: number, FingergripTypeTop: string, FingergripTypeBtm: string): ICT_tab_FillerHardwareSettings[]{

  let retEntry = ct_tab_FillerHardwareSettings.filter(p => p.in_TypeElement == TypeElement && p.in_FillerType == FillerType && p.in_FillerHardwareType == FillerHardwareType && p.in_FrontHeightMin! < FrontHeight && p.in_FrontHeightMax! >= FrontHeight && p.in_FrontWidthMin! < FrontWidth && p.in_FrontWidthMax! >= FrontWidth && p.in_FingergripTypeTop == FingergripTypeTop && p.in_FingergripTypeBtm == FingergripTypeBtm);

	if (retEntry == undefined || retEntry.length == 0) {
		let ErrorMessage = GlobalFunc.find_ErrorList('Error 14033',1);
		logError(ErrorMessage.Message('TypeElement= ' + TypeElement + ', FillerType= ' + FillerType + ', FillerHardwareType= ' + FillerHardwareType + ', FrontHeight= ' + FrontHeight + ', FrontWidth= ' + FrontWidth + ', FingergripTypeTop= ' + FingergripTypeTop + ', FingergripTypeBtm= ' + FingergripTypeBtm));
	}

	return retEntry!;
}