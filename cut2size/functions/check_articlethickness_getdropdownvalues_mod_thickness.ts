check_ArticleThickness_getDropDownValues_mod_Thickness(attr: Checks.IArticleThickness_Attributes, selections: SelectionEntry_mod_Thickness[]): Checks.CheckDropDownEntry[]{
    const articleId = attr._articleId;

    let boardLibraryRows = ct_tab_BoardLibrary.filter((board) => !!board.in_MaterialCode);

    if (articleId === 'AcC2S') {
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
            (board) => board.Category === 'Chipboard' && board.Coating === 'Uncoated'
        );
    }

    const thicknesses = new Set(boardLibraryRows.map((board) => board.Thickness));    

    return Array.from(thicknesses).map((thickness) => ({
        kind: Checks.CheckDropDownEntryKind.Normal,
        value: thickness,
        label: thickness.toString()
    }));
}