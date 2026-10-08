find_BoardDimensions(BoardId: string): { Length: number; Width: number } {

    const board = ct_tab_BoardLibrary.find(p => p.in_MaterialCode === BoardId);

    return {
        Length: board?.Length ?? 9999,
        Width: board?.Width ?? 9999
    };
}