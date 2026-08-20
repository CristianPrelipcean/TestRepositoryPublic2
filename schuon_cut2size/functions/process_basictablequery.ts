process_BasicTableQuery(
    table: any[],
    WildcardParams: any,
    FixedParams: any,
    RangeParams: any,
    UniqueOutput: boolean
): any | undefined {

    /*
      ######################################################################################################################

      Single-pass table query with:
      - Fixed params: exact match OR row may contain "All"
      - Wildcard params: exact match OR row may contain "All"
      - Range params: MinAttr <= Value <= MaxAttr
      - Scoring: prefer rows with the fewest "All" values across relevant columns (rowScore)

      Returns:
      - undefined if no match
      - first best row if UniqueOutput
      - list of best rows otherwise

      ######################################################################################################################
    */

    // Defines the structure of a numeric range filter.
    // A table row matches if: MinAttr <= Value <= MaxAttr
    type RangeParam = {
        MinAttr: string;
        MaxAttr: string;
        Value: number;
    };

    // Columns relevant for matching & scoring (both wildcard + fixed params)
    const columns = Object.keys(WildcardParams).concat(Object.keys(FixedParams));

    // Convert RangeParams object into a normalized array structure
    // so we can iterate it efficiently during filtering
    const rangeParams = Object.values(RangeParams as { [key: string]: RangeParam }).map(r => ({
        min: r.MinAttr,
        max: r.MaxAttr,
        value: r.Value
    }));

    // Stores currently best matching rows
    let bestRows: any[] = [];

    // Best score found so far (lower = better).
    // Infinity ensures the first real row always wins.
    let bestScore = Infinity;

    // Iterate through the table once (single-pass)
    for (const row of table) {

        // 1) Check all column conditions:
        // A row matches a column if:
        const matchesColumns = columns.every(col => {

            // Fixed params → must match exactly
            if (col in FixedParams) {
                return row[col] === FixedParams[col];
            }

            // Wildcard params → match exact OR row allows wildcard
            return row[col] === WildcardParams[col] || row[col] === "All";
        });

        if (!matchesColumns) continue;

        // 2) Check numeric ranges:
        // Row matches only if value lies within all defined ranges
        const matchesRanges = rangeParams.every(range =>
            row[range.min] <= range.value && row[range.max] >= range.value
        );

        if (!matchesRanges) continue;

        // 3) Score the row:
        // rowScore = number of wildcard values ("All") in this row across the relevant columns.
        // Best possible score is 0 (fully specific row).
        const rowScore = columns.reduce((score, col) => score + (row[col] === "All" ? 1 : 0), 0);

        // Found a better (more specific) row than before -> reset the result list to only this row.
        if (rowScore < bestScore) {
            bestScore = rowScore;
            bestRows = [row];

            // Early exit: cannot get better than 0, and we only need one result
            if (UniqueOutput && bestScore === 0) {
                return bestRows[0];
            }
        }
        // Found an equally good row -> add it (no duplicates expected in single-pass,
        // but includes() is a safe guard in case the same object reference appears twice in table).
        else if (rowScore === bestScore) {
            if (!bestRows.includes(row)) {
                bestRows.push(row);
            }
        }
    }

    // Return result
    if (bestRows.length > 0) {
        return UniqueOutput ? bestRows[0] : bestRows;
    }

    return undefined;
}