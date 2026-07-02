process_BasicTableQuery(table: any[], WildcardParams: any, FixedParams: any, RangeParams: any, UniqueOutput: boolean): any | undefined {

    /*
      Function to query tables with wildcard parameters, fixed parameters, and range parameters.
      - table: the table to query
      - Fixed: exact match to value
      - Wildcard: exact match to value or "All" as a string literal
      - Range: MinAttr <= Value <= MaxAttr
      - UniqueOutput: if true, returns only the first matching row
      The function returns the best matching row(s) based on the least number of "All" matches.
      Returns:
      - undefined if no match
      - the table entry if UniqueOutput
      - list of the table entries if not UniqueOutput (even if only one match)
    */

    type RangeParam = {
        MinAttr: string;
        MaxAttr: string;
        Value: number;
    };

    function generateSearchParamsCombinations(wildcard: any, fixed: any): any[] {
        const keys = Object.keys(wildcard);
        const combinations: any[] = [];
        const totalCombinations = 1 << keys.length;

        for (let i = 0; i < totalCombinations; i++) {
            const combo: any = { ...fixed };
            for (let j = 0; j < keys.length; j++) {
                combo[keys[j]] = (i & (1 << j)) ? "All" : wildcard[keys[j]];
            }
            combinations.push(combo);
        }

        return combinations;
    }

    const columns = Object.keys(WildcardParams).concat(Object.keys(FixedParams));
    const rangeParams = Object.values(RangeParams as { [key: string]: RangeParam }).map(r => ({
        min: r.MinAttr,
        max: r.MaxAttr,
        value: r.Value
    }));

    const valueList = generateSearchParamsCombinations(WildcardParams, FixedParams);
    valueList.sort((a, b) => {
        const countAllA = Object.values(a).filter(v => v === "All").length;
        const countAllB = Object.values(b).filter(v => v === "All").length;
        return countAllA - countAllB;
    });

    let bestRows: any[] = [];
    let bestScore = Infinity;

    for (const search of valueList) {
        const matchingRows = table.filter(row =>
            columns.every(col =>
                row[col] === search[col] || row[col] === "All"
            ) &&
            rangeParams.every(range =>
                row[range.min] <= range.value && row[range.max] >= range.value
            )
        );

        if (matchingRows.length > 0) {
            // Jetzt: Bewertung der Treffer selbst
            for (const row of matchingRows) {
                const rowScore = columns.reduce((score, col) => score + (row[col] === "All" ? 1 : 0), 0);
                if (rowScore < bestScore) {
                    bestScore = rowScore;
                    bestRows = [row];
                } else if (rowScore === bestScore) {
                    bestRows.push(row);
                }
            }
        }
    }

    if (bestRows.length > 0) {
        const uniqueMatches = [...new Set(bestRows)];
        return UniqueOutput ? uniqueMatches[0] : uniqueMatches;
    }

    return undefined;
}
