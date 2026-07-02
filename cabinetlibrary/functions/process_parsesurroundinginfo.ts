process_ParseSuroundingInfo(raw: string | undefined): {
	PlinthAreaVisLeft: 1 | 0;
	PlinthAreaVisRight: 1 | 0;
	CeilingAreaVisLeft: 1 | 0;
	CeilingAreaVisRight: 1 | 0;
	CarcaseVisLeft: 1 | 0;
	CarcaseVisRight: 1 | 0;
	AutoFillerLeft: boolean;
	AutoFillerRight: boolean;
	WallDistanceLeft: number;
	WallDistanceRight: number;
} {
	//======================================================================
	// Default object
	//======================================================================

	const result = {
		PlinthAreaVisLeft: 0 as 1 | 0,
		PlinthAreaVisRight: 0 as 1 | 0,
		CeilingAreaVisLeft: 0 as 1 | 0,
		CeilingAreaVisRight: 0 as 1 | 0,
		CarcaseVisLeft: 0 as 1 | 0,
		CarcaseVisRight: 0 as 1 | 0,
		AutoFillerLeft: false,
		AutoFillerRight: false,
		WallDistanceLeft: 999,
		WallDistanceRight: 999
	};

	//======================================================================
	// Helper functions
	//======================================================================

	function isVisibilityValue(value: unknown): value is 1 | 0 {
		return value === 1 || value === 0;
	}

	function isBoolean(value: unknown): value is boolean {
		return typeof value === "boolean";
	}

	function isNumber(value: unknown): value is number {
		return typeof value === "number" && !isNaN(value);
	}

	//======================================================================
	// Guards
	//======================================================================

	if (!raw) {
		logError("mod_InformationList[0] is empty");
		return result;
	}

	let parsed: unknown;

	try {
		parsed = JSON.parse(raw);
	}
	catch {
		logError("Failed to parse storageunitInfo JSON");
		return result;
	}

	if (typeof parsed !== "object" || parsed === null) {
		logError("storageunitInfo is not an object");
		return result;
	}

	const v = parsed as Record<string, unknown>;

	if (!isVisibilityValue(v["PlinthAreaVisLeft"])) {
		logError("Invalid PlinthAreaVisLeft in storageunitInfo");
		return result;
	}
	if (!isVisibilityValue(v["PlinthAreaVisRight"])) {
		logError("Invalid PlinthAreaVisRight in storageunitInfo");
		return result;
	}
	if (!isVisibilityValue(v["CeilingAreaVisLeft"])) {
		logError("Invalid CeilingAreaVisLeft in storageunitInfo");
		return result;
	}
	if (!isVisibilityValue(v["CeilingAreaVisRight"])) {
		logError("Invalid CeilingAreaVisRight in storageunitInfo");
		return result;
	}
	if (!isVisibilityValue(v["CarcaseVisLeft"])) {
		logError("Invalid CarcaseVisLeft in storageunitInfo");
		return result;
	}
	if (!isVisibilityValue(v["CarcaseVisRight"])) {
		logError("Invalid CarcaseVisRight in storageunitInfo");
		return result;
	}
	if (!isBoolean(v["AutoFillerLeft"])) {
		logError("Invalid AutoFillerLeft in storageunitInfo");
		return result;
	}
	if (!isBoolean(v["AutoFillerRight"])) {
		logError("Invalid AutoFillerRight in storageunitInfo");
		return result;
	}
	if (!isNumber(v["WallDistanceLeft"])) {
		logError("Invalid WallDistanceLeft in storageunitInfo");
		return result;
	}
	if (!isNumber(v["WallDistanceRight"])) {
		logError("Invalid WallDistanceRight in storageunitInfo");
		return result;
	}

	//======================================================================
	// Return parsed values
	//======================================================================

	result.PlinthAreaVisLeft = v["PlinthAreaVisLeft"];
	result.PlinthAreaVisRight = v["PlinthAreaVisRight"];
	result.CeilingAreaVisLeft = v["CeilingAreaVisLeft"];
	result.CeilingAreaVisRight = v["CeilingAreaVisRight"];
	result.CarcaseVisLeft = v["CarcaseVisLeft"];
	result.CarcaseVisRight = v["CarcaseVisRight"];
	result.AutoFillerLeft = v["AutoFillerLeft"];
	result.AutoFillerRight = v["AutoFillerRight"];
	result.WallDistanceLeft = v["WallDistanceLeft"];
	result.WallDistanceRight = v["WallDistanceRight"];

	return result;
}