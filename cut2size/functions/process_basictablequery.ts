process_BasicTableQuery(table: any[], WildcardParams: any, FixedParams: any, RangeParams: any, UniqueOutput: boolean): any | undefined {

    //--------------------Main functionality for query to the table------------------------

	let matches: any = undefined;

	// Range parameters
	let rangeParams = Object.keys(RangeParams).map(rangeParam => {
		let { MinAttr, MaxAttr, Value } = RangeParams[rangeParam];
		return { min: MinAttr, max: MaxAttr, value: Value };
	});
  
	// Define the search columns in the table
	let columns = Object.keys(WildcardParams).concat(Object.keys(FixedParams));

	// Create an array with the values and wildcards
	let valueList = generateSearchParamsCombinations(WildcardParams);
  
	// Query the table (check if there are ranges or not)
	if(Object.keys(RangeParams).length > 0){
		for (let i = 0; i < valueList.length; i++) {
			let search = valueList[i];
			let matchingRows = table.filter(row =>
				columns.every(col => row[col] === search[col]) &&
				rangeParams.every(range => {
					let { min, max, value } = range;
					return row[min] <= value && row[max] >= value;
				})
			);
			if (matchingRows.length > 0) {
				matches = matchingRows;
				break;
			}
		}
	}
	else{		
		for (let i = 0; i < valueList.length; i++) {
			let search = valueList[i];
			let matchingRows = table.filter(row =>
				columns.every(col => row[col] === search[col])
			);
			if (matchingRows.length > 0) {
				matches = matchingRows;
				break;
			}
		}
	}

	// Get unique matches
	let uniqueMatches = [...new Set(matches)];

	// Return first match or undefined
	if(UniqueOutput == true){
		return uniqueMatches.length > 0 ? uniqueMatches[0] : undefined;
	}

	// Return full list of matches
	else{
		return matches;
	}

    //--------------------Create Array with the values and wildcards------------------------

    function generateSearchParamsCombinations(searchParams: any): any[] {
        let combinations = [];
        let keys = Object.keys(searchParams);

        // Generate combination with all values retained
        combinations.push(Object.assign({}, searchParams, FixedParams));

        // Generate combinations for each key set to 'All' individually
        for (let key of keys) {
            let combination = Object.assign({}, searchParams, FixedParams);
            combination[key] = 'All';
            combinations.push(combination);
        }

        // Generate combinations for each pair of keys set to 'All'
        for (let i = 0; i < keys.length - 1; i++) {
            let key1 = keys[i];
            for (let j = i + 1; j < keys.length; j++) {
                let key2 = keys[j];
                let combination = Object.assign({}, searchParams, FixedParams);
                combination[key1] = 'All';
                combination[key2] = 'All';
                combinations.push(combination);
                for (let x = j + 1; x < keys.length; x++) {
                    let key3 = keys[x];
                    let combination2 = Object.assign({}, searchParams, FixedParams);
                    combination2[key1] = 'All';
                    combination2[key2] = 'All';
                    combination2[key3] = 'All';
                    combinations.push(combination2);
                    for (let y = x + 1; y < keys.length; y++) {
                        let key4 = keys[y];
                        let combination3 = Object.assign({}, searchParams, FixedParams);
                        combination3[key1] = 'All';
                        combination3[key2] = 'All';
                        combination3[key3] = 'All';
                        combination3[key4] = 'All';
                        combinations.push(combination3);
						for (let z = y + 1; z < keys.length; z++) {
							let key5 = keys[z];
							let combination4 = Object.assign({}, searchParams, FixedParams);
							combination4[key1] = 'All';
							combination4[key2] = 'All';
							combination4[key3] = 'All';
							combination4[key4] = 'All';
							combination4[key5] = 'All';
							combinations.push(combination4);
						}
                    }
                }
            }
        }

        // Return the combinations
        return combinations;
    }
}