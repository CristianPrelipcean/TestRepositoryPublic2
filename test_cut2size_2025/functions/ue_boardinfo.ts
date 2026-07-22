ue_BoardInfo(Program:string, TypeElement:string, PartDesign:string, Thk:number, Color:string, BtmColor:string/*, PartGrain: string*/) {

	let retBoards: any[] = [];
	let route = 'ProductionRoute'; 
	let extraInfo1 = 'ExtraInfo1'; 
	let extraInfo2 = 'ExtraInfo2'; 
	let extraInfo3 = 'ExtraInfo3';

//====================================================================
// Get data from tables
//====================================================================

//---------------Get data from table BoardObjectMapping-----------------

let BoardObjectMapping= GlobalFunc.find_BoardObjectMapping(Program, TypeElement, PartDesign, Thk, Color, BtmColor);

//---------------Get data from table BoardLibrary and GrainSettings-----------------

let BoardLibrary = GlobalFunc.find_BoardLibrary(BoardObjectMapping.BoardId);
/*
let GrainDirection = GlobalFunc.find_GrainDirection(BoardLibrary.Grain!,PartGrain!);
*/	
		let boardInfo = {
			BoardId: BoardLibrary.BoardCode,
			BoardType: BoardLibrary.BoardType!,
			BoardSupplier: BoardLibrary.Manufacturer,
			BoardSupplierArticleNumber: BoardLibrary.ArticleNumber,
			//GrainDirection: GrainDirection.GrainDirection,
			Route: route,
			ExtraInfo1: extraInfo1,
			ExtraInfo2: extraInfo2,
			ExtraInfo3: extraInfo3,
		};
	
		retBoards.push(boardInfo);
		
	return retBoards; 
}