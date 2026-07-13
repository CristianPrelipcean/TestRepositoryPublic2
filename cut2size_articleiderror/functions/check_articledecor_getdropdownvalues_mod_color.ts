check_ArticleDecor_getDropDownValues_mod_Color(attr: Checks.IArticleDecor_Attributes, selections: SelectionEntry_mod_Color[]): Checks.CheckDropDownEntry[]{
    const articleId = attr._articleId;

    const selectableColors = new Set(
        selections
            .map((selection) => selection.value)
            .filter((value): value is string => !!value)
    );

    let boardLibraryRows = ct_tab_BoardLibrary.filter((board) => !!board.in_MaterialCode);

    if (articleId === 'articleidtets') {
        boardLibraryRows = boardLibraryRows.filter(
            (board) => board.Category === 'AcrylicGlass_PMMA'
        );
    } else if (articleId === 'DecC2S' || articleId === 'DecC2SE') {
        boardLibraryRows = boardLibraryRows.filter(
            (board) => board.Category === 'Chipboard' && board.Coating === 'MelamineThermoset'
        );
    } else if (articleId === 'MdfC2S') {
        boardLibraryRows = boardLibraryRows.filter(
            (board) => board.Category === 'MediumdensityFiberboard_MDF' && board.Coating === 'Uncoated'
        );
    } else if (articleId === 'CbC2S') {
        boardLibraryRows = boardLibraryRows.filter(
            (board) => board.Category === 'Chipboard ' && board.Coating === 'Uncoated'
        );
    }


    const materialCodes = new Set(boardLibraryRows.map((board) => board.in_MaterialCode as string));

    const validColors = [
        ...new Set(
            ct_tab_BoardMapping
                .filter(
                    (mapping) =>
                        !!mapping.BoardId &&
                        materialCodes.has(mapping.BoardId) &&
                        !!mapping.in_Color &&
                        selectableColors.has(mapping.in_Color)
                )
                .map((mapping) => mapping.in_Color as string)
        )
    ];

    return validColors.map((color) => ({
        kind: Checks.CheckDropDownEntryKind.Normal,
        value: color
    }));
}