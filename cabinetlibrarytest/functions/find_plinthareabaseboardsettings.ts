find_PlinthAreaBaseboardSettings(
	args: {
		TypeElement: string,
		BaseboardCutLogic: string,
		ModulePosition: string,
		PlinthAreaDesign: string,
		PositionLeftMatrix: string,
		PositionRightMatrix: string,
		PositionFrontMatrix: string,
		PositionBackMatrix: string,
		CarcaseWidth: number,
		CarcaseDepth: number,
		Weight?: number,
	},
	contourData: any
): null | {
	MatrixPositionType: number;
	BasePoint: number,
	HardwareRotation: number,
	PosXOffset: number,
	PosYOffset: number,
}[] {
	/*
	 * Function to return leg entries for the plint area baseboard.
	 * Matrix position of the legs defines relevancy of recess/flush attributes (mod_PlinthAreaPos.*Matrix).
	 */

	const wildcardParams: any = {
		in_TypeElement: args.TypeElement,
	};
	const fixedParams: any = {
		in_PlinthAreaDesign: args.PlinthAreaDesign,
		in_BaseboardCutLogic: args.BaseboardCutLogic,
		in_ModulePosition: args.ModulePosition,
	};
	const RangeParams: any = {
		"width": {
			MinAttr: "in_CarcaseWidthMin",
			MaxAttr: "in_CarcaseWidthMax",
			Value: args.CarcaseWidth
		},
		"depth": {
			MinAttr: "in_CarcaseDepthMin",
			MaxAttr: "in_CarcaseDepthMax",
			Value: args.CarcaseDepth,
		},

	};

	if (args.Weight !== undefined) {
		RangeParams["weight"] = {
			MinAttr: "in_WeightMin",
			MaxAttr: "in_WeightMax",
			Value: args.Weight,
		};
	}

	const retEntries = GlobalFunc.process_BasicTableQuery(ct_tab_PlinthAreaBaseboardSettings, wildcardParams, fixedParams, RangeParams, false);

	// Based on the side, the recess/flush entries should be filtered. This is a map between MatrixPositionType and which attributes are relevant for filtering
	const relevantFilters: any = {
		11: ['PositionLeftMatrix', 'PositionBackMatrix'],
		12: ['PositionBackMatrix'],
		13: ['PositionRightMatrix', 'PositionBackMatrix'],
		21: ['PositionLeftMatrix'],
		22: [],
		23: ['PositionRightMatrix'],
		31: ['PositionLeftMatrix', 'PositionFrontMatrix'],
		32: ['PositionFrontMatrix'],
		33: ['PositionRightMatrix', 'PositionFrontMatrix'],
	}

	const filteredRecessedAndFlushEntries = retEntries.filter((entry: any) => {
		const relevantFilter: string[] = relevantFilters[entry.MatrixPositionType];
		let pass = true;
		relevantFilter?.forEach((filterKey: string) => {
			if (entry[`in_${filterKey}`] === 'All') {
				logWarning(`In table 'tab_PlinthAreaBaseboardSettings', entry with _id ${entry._id} with MatrixPositionType ${entry.MatrixPositionType} has 'All' for ${filterKey}, which is not recommended. This entry will be still used.`);
			}
			else if ((args as any)[filterKey] !== entry[`in_${filterKey}`]) {
				pass = false;
			}
		});
		return pass;
	});

	return filteredRecessedAndFlushEntries.map((entry: any) => {
		return {
			...entry,
			PosXOffset: entry.PosXOffset(contourData)!,
			PosYOffset: entry.PosYOffset(contourData)!,
		}
	});
}