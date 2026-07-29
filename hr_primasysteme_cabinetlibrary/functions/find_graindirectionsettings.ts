find_GrainDirectionSettings(PartId: string,TypeElement: string, ProgramGroupId: string, ColorGroupId: string, Length: number, Width: number): ICT_tab_GrainDirectionSettings {

  // Wildcard parameters
  let WildcardParams: any = {
    in_TypeElement: TypeElement
  };

  // Fixed parameters
  let FixedParams: any = {
    in_PartId: PartId,
    in_ProgramGroupId: ProgramGroupId,
    in_ColorGroupId: ColorGroupId
  };

  // Range parameters
  let RangeParams: any = {
		"Range1": {
			MinAttr: "in_LengthMin",
			MaxAttr: "in_LengthMax",
			Value: Length
		},
		"Range2": {
			MinAttr: "in_WidthMin",
			MaxAttr: "in_WidthMax",
			Value: Width
		}
	};

  // Return multiple rows or a single row (UniqueOutput = true returns a single row)
  let UniqueOutput = true;

  // Call the function and retrieve the value
  let retVal = GlobalFunc.process_BasicTableQuery(ct_tab_GrainDirectionSettings, WildcardParams, FixedParams, RangeParams, UniqueOutput);
  if (retVal == undefined) {
    let Text = PartId + ' - ' + TypeElement + ' - ' + ProgramGroupId + ' - ' + ColorGroupId + ' - ' + Length + ' - ' + Width;
    let ErrorMessage = GlobalFunc.find_ErrorList('Error 14034', 1);
    logError(ErrorMessage.Message(Text));
  }

  // Return the value
  return retVal;

}