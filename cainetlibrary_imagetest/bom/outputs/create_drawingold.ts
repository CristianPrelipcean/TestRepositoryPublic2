// Schuler Consulting
// Create: Jan 2023
// By Ludwig Weber
// Purpose: HOMAG drawings generation for tecConfig
//
// Description:
// Converts PartElements to drawings
//
//==================================================================================

//###########################################################################################################################################
// Interfaces and data structures
//###########################################################################################################################################

// Create a map for the attributes (to get the data accessable)
let ncData = {
  Tool: '',
  coorX1: 0,
  coorY1: 0,
  XA: 0,
  XE: 0,
  YA: 0,
  YE: 0,
  DU: 0,
  DUF: 0,
  WI: 0,
  LA: 0,
  LAF: 0,
  BR: 0,
  RD: 0,
  AN: 0,
  AB: 0,
  NB: 0,
  BM: '',
  TI: 0,
  TIF: 0,
  SIDE: ''
};

// Interface to store the drill data for the measurments
interface dataDrills {
  x: number;
  y: number;
  d: number;
  dpt: number;
  side: string;
}
let drillData: dataDrills[] = [];

//###########################################################################################################################################
// Drawing the main element (panel)
//###########################################################################################################################################

//==================================================================================
// Initialize drawing
//==================================================================================

// Zoom-factor
let zoom1:number = Math.ceil(part._width / 1000);
let zoom2:number = Math.ceil(part._depth / 520);
let zoom:number;

if (zoom1 < zoom2){zoom = zoom2;}
else{zoom = zoom1;}
if (zoom < 2){zoom = 2;}

// Start SVG-File
let svgCode:string = '<svg xmlns="http://www.w3.org/2000/svg" width="1980" height="1080"> \n';

// Insert the code for the arrows in the SVG-file
svgCode += '<defs>\n';
svgCode += '<marker id="arrEnd" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">\n';
svgCode += '<path d="M0,0 L6,2 L0,4 z" fill="black" />\n';
svgCode += '</marker>\n';
svgCode += '<marker id="arrStart" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">\n';
svgCode += '<path d="M0,2 L6,0 L6,4 z" fill="black" />\n';
svgCode += '</marker>\n';
svgCode += '</defs>\n';

//==================================================================================
// Drawing the panel
//==================================================================================

// Panel Face1
let X_F1:number = 580-(part._width/zoom)/2;
let Y_F1:number = 440+(part._depth/zoom)/2;
svgCode += '<rect x="' + X_F1 + '" y="' + (Y_F1-(part._depth/zoom)) + '" width="' + part._width/zoom + '" height="' + part._depth/zoom + '" fill="#F2F3F5" stroke="#001941" stroke-width="1"/>\n';

//###########################################################################################################################################
// Drawing the processings
//###########################################################################################################################################

// Cycle through the nc-elements
bomEntries.forEach(b => {
	
	clear_ncData();
// Process the nc-element attributes
	b.getAttributes().forEach((value, key) => {
    processAttributes(value, key);	
	});

  //==================================================================================
  // Drill vertical
  //==================================================================================

  // Translate the drilling side for table and change the color
  let transSide = translateSide(ncData.SIDE);

  //--------------------------------------------------------------------------------
  // Drilling line (length)
  //--------------------------------------------------------------------------------

	if (ncData.Tool == "102"){	
		if(ncData.LAF>0){
			for (let i:number = 0; i <= ncData.LAF/ncData.AB; i++) {
				let Dist:number = ncData.AB/zoom;
				svgCode += '<circle cx="' + (X_F1+ncData.XA) + '" cy="' + (Y_F1-ncData.YA) + '" r="' + (ncData.DU/2) + '" fill="' + transSide[1] + '" stroke="black" />\n';
				ncData.YA += Dist;
        let newDrill: dataDrills = { x: ncData.coorX1, y: ncData.coorY1, d: ncData.DUF, dpt: ncData.TIF, side: transSide[0] };
        drillData.push(newDrill);
			}
		}

    //--------------------------------------------------------------------------------
    // Drilling linke (quantity)
    //--------------------------------------------------------------------------------

    else if (ncData.AN !== undefined && ncData.AN > 1) {
			for (let i:number = 1; i <= ncData.AN; i++) {
				let Dist = ncData.AB/zoom;
        let PosX = ncData.coorX1;
        let PosY = ncData.coorY1;
				svgCode += '<circle cx="' + (X_F1+ncData.XA) + '" cy="' + (Y_F1-ncData.YA) + '" r="' + (ncData.DU/2) + '" fill="' + transSide[1] + '" stroke="black" />\n';

        if(ncData.WI == 90 || ncData.WI == 270){
          ncData.YA += Dist;
          PosY += ncData.AB * (i - 1);         
        }
        else{
          ncData.XA += Dist;
          PosX += ncData.AB * (i - 1); 
        }

        let newDrill: dataDrills = { x: PosX, y: PosY, d: ncData.DUF, dpt: ncData.TIF, side: transSide[0]  };
        drillData.push(newDrill);
			}
		}

    //--------------------------------------------------------------------------------
    // Single drill
    //--------------------------------------------------------------------------------

		else{
			svgCode += '<circle cx="' + (X_F1+ncData.XA) + '" cy="' + (Y_F1-ncData.YA) + '" r="' + (ncData.DU/2) + '" fill="' + transSide[1] + '" stroke="black" />\n';

      let newDrill: dataDrills = { x: ncData.coorX1, y: ncData.coorY1, d: ncData.DUF, dpt: ncData.TIF, side: transSide[0]  };
      drillData.push(newDrill);
		}
	}

  //==================================================================================
  // Other processings
  //==================================================================================

});

//###########################################################################################################################################
// Measurements
//###########################################################################################################################################

//==================================================================================
// Initialize variables
//==================================================================================

let arrPosLeft: [number, number][] = [];
let arrPosRight: [number, number][] = []
let arrPosTop: [number, number][] = [];
let arrPosBottom: [number, number][] = [];
let xarrPosLeft: number[] = [];
let xarrPosRight: number[] = [];
let yarrPosTop: number[] = [];
let yarrPosBottom: number[] = [];
let levelLeft = 1;
let levelBottom = 1;
let i = 0;

//==================================================================================
// Measurments for vertical drills
//==================================================================================

drillData.forEach(drill => {

  //--------------------------------------------------------------------------------
  // Create the arrays for the vertical dimensions  
  //--------------------------------------------------------------------------------

  if (drill.x < part._width/2) {
    arrPosLeft.push([drill.y, drill.x]);
    if (!xarrPosLeft.includes(drill.x)) {
      xarrPosLeft.push(drill.x);
    }
  } else {
    arrPosRight.push([drill.y, drill.x]);
    if (!xarrPosRight.includes(drill.x)) {
      xarrPosRight.push(drill.x);
    }
  }

  //--------------------------------------------------------------------------------
  // Create the arrays for the horizontal dimensions
  //--------------------------------------------------------------------------------

  if (drill.y < part._depth/2) {
    arrPosBottom.push([drill.x, drill.y]);
    if (!yarrPosBottom.includes(drill.y)) {
      yarrPosBottom.push(drill.y);
    }
  } 
  else {
    arrPosTop.push([drill.x, drill.y]);
    if (!yarrPosTop.includes(drill.y)) {
      yarrPosTop.push(drill.y);
    }
  }
});

//----------------------------------------------------------------------------------
// Create an array of the arrays for the cycle
//----------------------------------------------------------------------------------

let arrays = [
  { arr: FilterDuplicates(arrPosLeft), arr2: removeDuplicatesFromArray2(arrPosLeft, xarrPosLeft), oriValue: "vertical", dirValue: "left", boardDim: part._depth },
  { arr: FilterDuplicates(arrPosRight), arr2: removeDuplicatesFromArray2(arrPosRight, xarrPosRight), oriValue: "vertical", dirValue: "right", boardDim: part._depth },
  { arr: FilterDuplicates(arrPosTop), arr2: removeDuplicatesFromArray2(arrPosTop, yarrPosTop), oriValue: "horizontal", dirValue: "top", boardDim: part._width },
  { arr: FilterDuplicates(arrPosBottom), arr2: removeDuplicatesFromArray2(arrPosBottom, yarrPosBottom), oriValue: "horizontal", dirValue: "bottom", boardDim: part._width }
];

//==================================================================================
// Cycle through the arrays
//==================================================================================

let k=0;
for (let elem of arrays) {
  k++;
  if (elem.arr.length > 0) {
    elem.arr2.sort((a, b) => a - b); 
    if(k==2){ i = 2; } 
    else{i = 1; }  
    for (let arr2Item of elem.arr2){
      let arrMeasures: number[] = [];
      let arrCreated = false;
      for (let arrItem of elem.arr){
        if (arrItem[1] == arr2Item){
          arrMeasures.push(arrItem[0]);
          arrCreated = true;
        }
      }     
      if(arrCreated){
          svgCode += processArray(arrMeasures, elem.oriValue, elem.dirValue, elem.boardDim, i)
          i++;        
      }     
    }
    if(k==1){
      levelLeft = i;
    }   
    if(k==4){
      levelBottom = i;
    }   
  }  
}

//==================================================================================
// Measurements main panel (top, left)
//==================================================================================

svgCode += Measurements(0, part._width, zoom, "horizontal", "bottom", levelBottom, "full", part._width, part._depth, X_F1, Y_F1)
svgCode += Measurements(0, part._depth, zoom, "vertical", "left", levelLeft, "full", part._width, part._depth, X_F1, Y_F1)

//###########################################################################################################################################
// Table for drilling data
//###########################################################################################################################################

let PosTableX = X_F1 + (part._width/zoom) + 200;
let PosTableY = 100;
let WidthTable = 500

// Table header 1
svgCode += '<rect x="' + PosTableX + '" y="' + PosTableY + '" width="' + WidthTable + '" height="30" fill="#F2F3F5" stroke="black" stroke-width="2"/>\n';
svgCode += '<text x="' + (PosTableX + WidthTable/2) + '" y="' + (PosTableY + 20) + '" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="16">Bohrungen</text>\n';

// Table header 2
svgCode += '<rect x="' + PosTableX + '" y="' + (PosTableY+30) + '" width="' + WidthTable + '" height="30" fill="#F2F3F5" stroke="black" stroke-width="2"/>\n';
svgCode += '<text x="' + (PosTableX + 50) + '" y="' + (PosTableY + 49) + '" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14">PosX</text>\n';
svgCode += '<text x="' + (PosTableX + 150) + '" y="' + (PosTableY + 49) + '" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14">PosY</text>\n';
svgCode += '<text x="' + (PosTableX + 250) + '" y="' + (PosTableY + 49) + '" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14">Durchmesser</text>\n';
svgCode += '<text x="' + (PosTableX + 350) + '" y="' + (PosTableY + 49) + '" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14">Tiefe</text>\n';
svgCode += '<text x="' + (PosTableX + 450) + '" y="' + (PosTableY + 49) + '" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14">Seite</text>\n';

// Table entries
PosTableY = 180;
let z = 1;
drillData.forEach(drill => {
  let color = z % 2 === 0 ? '#F2F3F5' : 'white';
  svgCode += '<rect x="' + (PosTableX) + '" y="' + (PosTableY-19) + '" width="' + WidthTable + '" height="28" fill="' + color + '" />\n';
  svgCode += '<text x="' + (PosTableX + 50) + '" y="' + (PosTableY) + '" text-anchor="middle" font-family="Arial" font-size="14">' + drill.x + '</text>\n';
  svgCode += '<text x="' + (PosTableX + 150) + '" y="' + (PosTableY) + '" text-anchor="middle" font-family="Arial" font-size="14">' + drill.y + '</text>\n';
  svgCode += '<text x="' + (PosTableX + 250) + '" y="' + (PosTableY) + '" text-anchor="middle" font-family="Arial" font-size="14">' + drill.d + '</text>\n';
  svgCode += '<text x="' + (PosTableX + 350) + '" y="' + (PosTableY) + '" text-anchor="middle" font-family="Arial" font-size="14">' + drill.dpt + '</text>\n';
  svgCode += '<text x="' + (PosTableX + 450) + '" y="' + (PosTableY) + '" text-anchor="middle" font-family="Arial" font-size="14">' + drill.side + '</text>\n';
  PosTableY += 30;
  z++;
});

// Table lines for the entries
let PosLineY = 130;
let LenLineY = 130 + z * 30;
for(let k=0; k<6; k++){
  let PosLineX = PosTableX + k * 100;
  svgCode += '<line x1="' + PosLineX + '" y1="' + PosLineY + '" x2="' + PosLineX + '" y2="' + LenLineY + '" stroke="black" />\n';
}
svgCode += '<line x1="' + PosTableX + '" y1="' + LenLineY + '" x2="' + (PosTableX+WidthTable) + '" y2="' + LenLineY + '" stroke="black" />\n';

//###########################################################################################################################################
// Finish
//###########################################################################################################################################

// Close SVG
svgCode += '</svg>';

// Create File
this.createFileEntry(result, part._partId + "_" + part._id + ".svg", svgCode);

//###########################################################################################################################################
// Helper functions
//###########################################################################################################################################

//==================================================================================
// Helper function to reset ncData
//==================================================================================

function clear_ncData(){
ncData.Tool = '';
ncData.coorX1 =  0;
ncData.coorY1 =  0;
ncData.XA =  0;
ncData.XE =  0;
ncData.YA =  0;
ncData.YE =  0;
ncData.DU =  0;
ncData.DUF =  0;
ncData.WI =  0;
ncData.LA =  0;
ncData.LAF =  0;
ncData.BR =  0;
ncData.RD =  0;
ncData.AN =  0;
ncData.AB =  0;
ncData.NB =  0;
ncData.BM =  '';
ncData.TI =  0;
ncData.TIF =  0;
ncData.SIDE =  '';
}

//==================================================================================
// Helper function to process the attributes
//==================================================================================

function processAttributes (value: any, key: any){
  if(key == "nc_TOOL"){ncData.Tool = value;}	
  if(key == "nc_XA"){ncData.XA = value/zoom; ncData.coorX1 = Math.round(value * 10) / 10;}
  if(key == "nc_YA"){ncData.YA = value/zoom; ncData.coorY1 = Math.round(value * 10) / 10;}
  if(key == "nc_XE"){ncData.XE = value/zoom;}
  if(key == "nc_YE"){ncData.YE = value/zoom;}
  if(key == "nc_DU"){ncData.DU = value/zoom; ncData.DUF = value;}
  if(key == "nc_NB"){ncData.NB = value/zoom;}
  if(key == "nc_LA"){ncData.LA = value/zoom; ncData.LAF = value;}
  if(key == "nc_BR"){ncData.BR = value/zoom;}
  if(key == "nc_RD"){ncData.RD = value/zoom;}
  if(key == "nc_TI"){ncData.TI = value/zoom; ncData.TIF = value;}
  if(key == "nc_WI"){ncData.WI = value;}
  if(key == "nc_AB"){ncData.AB = value;}
  if(key == "nc_BM"){ncData.BM = value;}	
  if(key == "nc_AN"){ncData.AN = value;}
  if(key == "nc_Side"){ncData.SIDE = value;}
}

//==================================================================================
// Helper function to process the side
//==================================================================================

function translateSide(side: string): [string, string] {
  switch (side) {
    case 'Top':
      return ['von oben','#767A95'];
    case 'Btm':
      return ['von unten','#F5D0A9'];
    case 'Front':
      return ['von vorne','#767A95'];
    case 'Back':
      return ['von hinten','#767A95'];
    case 'Left':
      return ['von links','#767A95'];
    case 'Right':
      return ['von rechts','#767A95'];
    default:
      return ['unbekannt','#767A95'];
  }
}

//==================================================================================
// Helper function to process the arrays of the measurments
//==================================================================================

function processArray(arr: number [], ori: string, dir: string, boardDim: number, level: number):string{

  // Local variables
  let locSvgCode = "";
  let posPoint = 0;
  let Position = "start";
  let i = 0;
  let ii = 0;

  // Sorting the array
  let sortedArray: number[] = arr.sort((a, b) => a - b);

  // Cycle to add dimensions for each drill to the drawing
  for (i = 0; i < sortedArray.length; i++) {
    locSvgCode += Measurements(posPoint, (sortedArray[i]-posPoint), zoom, ori, dir, level, Position, part._width, part._depth, X_F1, Y_F1);
    posPoint = sortedArray[i];
    Position = "middle";
    ii = i;
  }
  // If there are positions in the array add the end-dimenson to the drawing
  let CloseX = boardDim - sortedArray[ii]
  locSvgCode += Measurements(posPoint, CloseX, zoom, ori, dir, level, "end", part._width, part._depth, X_F1, Y_F1);

  // Return the measurments
  return locSvgCode;
}

//==================================================================================
// Helper functions delete duplicates in the arrays
//==================================================================================

// Delete duplicates in the tuples
function FilterDuplicates(arr: [number, number][]): [number, number][] {
  let uniqueArr: [number, number][] = [];
  let seen: { [key: string]: boolean } = {};

  for (let i = 0; i < arr.length; i++) {
    let currentItem = arr[i];
    let key = currentItem[0];

    if (!seen[key]) {
      seen[key] = true;
      uniqueArr.push(currentItem);
    }
  }

  return uniqueArr;
}

// Delete duplicated measurement lines
function removeDuplicatesFromArray2(arr: [number, number][], arr2: number[]): number[]{
  for (let i = 0; i < arr2.length; i++) {
    let yValue = arr2[i];
    if (!arr.some((value) => value[0] === yValue)) {
      let index = arr2.indexOf(yValue);
      if (index !== -1) {
        arr2.splice(index, 0);
      }
    }
  }
  return arr2;
}

//==================================================================================
// Helper function to draw the measurments
//==================================================================================

function Measurements(point: number, length: number, zoom: number, ori: string, dir: string, level: number, position: string, boardX: number, boardY: number, startX: number, startY: number): string {

	// Create SVG-String
	let svgString: string = "";
	
	// Rounding if necessary
	let tmpLength: string;
  tmpLength = length.toFixed(0);

	// Variables for the measurments
	let tmpLen = length/zoom;
	let tmpOvDis = 5;
  let tmpFont = 'font-family="Arial narrow" font-size="14"';
	let tmpFontDis = 4;
	let tmpDis = 26 * level;
	let tmpOvDimSmall = 20;
  let tmpStartLeft = 0;
  let tmpStartRight = 0;
  let xPos = 0;
  let yPos= 0;
	
	// Check measurments (line length position of text)
	let tmpPosition = 0;
  let tmpPositionY = 0;
	let tmpAllign: string;
	if(position == "start"){
    tmpPosition = -7; 
    tmpPositionY = -14;
    tmpAllign = "end";
    tmpStartRight = 26 * (level - 1);
  }
  else if(position == "end"){
    tmpPosition = 18; 
    tmpPositionY = 31;
    tmpAllign = "start";
    tmpStartLeft = 26 * (level - 1);
  }
	else {
    tmpPosition = 18; 
    tmpPositionY = 31;
    tmpAllign = "start";
    tmpStartRight = 26 * (level - 1);
    tmpStartLeft = 26 * (level - 1);
  }
	
	//--------------------------------------------------------------------------------
	// Orientation horizontal
  //--------------------------------------------------------------------------------

	if (ori == "horizontal"){
		
		// Direction top
		if (dir == "top"){
      xPos = startX + point / zoom;
      yPos = startY - boardY / zoom;
			if(tmpLen<15){
				svgString += '<line x1="' + (xPos-tmpOvDimSmall) + '" y1="' + (yPos-tmpDis) + '" x2="' + (xPos-3) + '" y2="' + (yPos-tmpDis) + '" stroke="black" marker-end="url(#arrEnd)" />\n';
				svgString += '<line x1="' + (xPos) + '" y1="' + (yPos-tmpDis) + '" x2="' + (xPos+tmpLen) + '" y2="' + (yPos-tmpDis) + '" stroke="black" />\n';
				svgString += '<line x1="' + (xPos+tmpLen+3) + '" y1="' + (yPos-tmpDis) + '" x2="' + (xPos+tmpLen+tmpOvDimSmall) + '" y2="' + (yPos-tmpDis) + '" stroke="black" marker-start="url(#arrStart)" />\n';
				svgString += '<text x="' + (xPos+tmpPosition) + '" y="' + (yPos-tmpDis-tmpFontDis) + '" text-anchor="' + tmpAllign + '" ' + tmpFont + '>' + tmpLength + '</text>\n';       
				svgString += '<line x1="' + (xPos) + '" y1="' + (yPos-tmpOvDis-tmpStartLeft) + '" x2="' + (xPos) + '" y2="' + (yPos-tmpDis-tmpOvDis) + '" stroke="black" />\n';
				svgString += '<line x1="' + (xPos+tmpLen) + '" y1="' + (yPos-tmpOvDis-tmpStartRight) + '" x2="' + (xPos+tmpLen) + '" y2="' + (yPos-tmpDis-tmpOvDis) + '" stroke="black" />\n';			
			}
			else{
				svgString += '<line x1="' + (xPos+3) + '" y1="' + (yPos-tmpDis) + '" x2="' + (xPos+tmpLen-3) + '" y2="' + (yPos-tmpDis) + '" stroke="black" marker-start="url(#arrStart)" marker-end="url(#arrEnd)" />\n';
				svgString += '<text x="' + (xPos+tmpLen/2) + '" y="' + (yPos-tmpDis-tmpFontDis) + '" text-anchor="middle" ' + tmpFont + '>' + tmpLength + '</text>\n';
				svgString += '<line x1="' + (xPos) + '" y1="' + (yPos-tmpOvDis-tmpStartLeft) + '" x2="' + (xPos) + '" y2="' + (yPos-tmpDis-tmpOvDis) + '" stroke="black" />\n';
				svgString += '<line x1="' + (xPos+tmpLen) + '" y1="' + (yPos-tmpOvDis-tmpStartRight) + '" x2="' + (xPos+tmpLen) + '" y2="' + (yPos-tmpDis-tmpOvDis) + '" stroke="black" />\n';
			}
		}

    // Direction bottom
		else{
      
      xPos = startX + point / zoom;
      yPos = startY;
			if(tmpLen<15){
				svgString += '<line x1="' + (xPos-tmpOvDimSmall) + '" y1="' + (yPos+tmpDis) + '" x2="' + (xPos-3) + '" y2="' + (yPos+tmpDis) + '" stroke="black" marker-end="url(#arrEnd)" />\n';
				svgString += '<line x1="' + (xPos) + '" y1="' + (yPos+tmpDis) + '" x2="' + (xPos+tmpLen) + '" y2="' + (yPos+tmpDis) + '" stroke="black" />\n';
				svgString += '<line x1="' + (xPos+tmpLen+3) + '" y1="' + (yPos+tmpDis) + '" x2="' + (xPos+tmpLen+tmpOvDimSmall) + '" y2="' + (yPos+tmpDis) + '" stroke="black" marker-start="url(#arrStart)" />\n';				
				svgString += '<text x="' + (xPos+tmpPosition) + '" y="' + (yPos+tmpDis-tmpFontDis) + '" text-anchor="' + tmpAllign + '" ' + tmpFont + '>' + tmpLength + '</text>\n';
				svgString += '<line x1="' + (xPos) + '" y1="' + (yPos+tmpOvDis+tmpStartLeft) + '" x2="' + (xPos) + '" y2="' + (yPos+tmpDis+tmpOvDis) + '" stroke="black" />\n';
				svgString += '<line x1="' + (xPos+tmpLen) + '" y1="' + (yPos+tmpOvDis+tmpStartRight) + '" x2="' + (xPos+tmpLen) + '" y2="' + (yPos+tmpDis+tmpOvDis) + '" stroke="black" />\n';					
			}
			else{				
				svgString += '<line x1="' + (xPos+3) + '" y1="' + (yPos+tmpDis) + '" x2="' + (xPos+tmpLen-3) + '" y2="' + (yPos+tmpDis) + '" stroke="black" marker-start="url(#arrStart)" marker-end="url(#arrEnd)" />\n';
				svgString += '<text x="' + (xPos+tmpLen/2) + '" y="' + (yPos+tmpDis-tmpFontDis) + '" text-anchor="middle" ' + tmpFont + '>' + tmpLength + '</text>\n';
				svgString += '<line x1="' + (xPos) + '" y1="' + (yPos+tmpOvDis+tmpStartLeft) + '" x2="' + (xPos) + '" y2="' + (yPos+tmpDis+tmpOvDis) + '" stroke="black" />\n';
				svgString += '<line x1="' + (xPos+tmpLen) + '" y1="' + (yPos+tmpOvDis+tmpStartRight) + '" x2="' + (xPos+tmpLen) + '" y2="' + (yPos+tmpDis+tmpOvDis) + '" stroke="black" />\n';	
			}			
		}
	}

  //--------------------------------------------------------------------------------
  // Orientation vertical
  //--------------------------------------------------------------------------------

	else{

		// Direction left
		if (dir == "left"){
      xPos = startX;
      yPos = startY - point / zoom;
      if(tmpLen<15){
        svgString += '<line x1="' + (xPos-tmpDis) + '" y1="' + (yPos-tmpLen-tmpOvDimSmall) + '" x2="' + (xPos-tmpDis) + '" y2="' + (yPos-tmpLen-3) + '" stroke="black" marker-end="url(#arrEnd)" />\n';
        svgString += '<line x1="' + (xPos-tmpDis) + '" y1="' + (yPos) + '" x2="' + (xPos-tmpDis) + '" y2="' + (yPos-tmpLen) + '" stroke="black" />\n';
        svgString += '<line x1="' + (xPos-tmpDis) + '" y1="' + (yPos+3) + '" x2="' + (xPos-tmpDis) + '" y2="' + (yPos+tmpOvDimSmall) + '" stroke="black" marker-start="url(#arrStart)" />\n';
        svgString += '<text x="' + (xPos-tmpDis-tmpFontDis) + '" y="' + (yPos-tmpPositionY) + '" text-anchor="middle" ' + tmpFont + ' transform="rotate(270, ' + (xPos-tmpDis-tmpFontDis) + ', ' + (yPos-tmpPositionY) + ')">' + tmpLength + '</text>\n';	
        svgString += '<line x1="' + (xPos-tmpOvDis-tmpStartLeft) + '" y1="' + (yPos) + '" x2="' + (xPos-tmpDis-tmpOvDis) + '" y2="' + (yPos) + '" stroke="black" />\n';
        svgString += '<line x1="' + (xPos-tmpOvDis-tmpStartRight) + '" y1="' + (yPos-tmpLen) + '" x2="' + (xPos-tmpDis-tmpOvDis) + '" y2="' + (yPos-tmpLen) + '" stroke="black" />\n';	
      }
      else{
        svgString += '<line x1="' + (xPos-tmpDis) + '" y1="' + (yPos-3) + '" x2="' + (xPos-tmpDis) + '" y2="' + (yPos-tmpLen+3) + '" stroke="black" marker-start="url(#arrStart)" marker-end="url(#arrEnd)" />\n';
        svgString += '<text x="' + (xPos-tmpDis-tmpFontDis) + '" y="' + (yPos-tmpLen/2) + '" text-anchor="middle" ' + tmpFont+ ' transform="rotate(270, ' + (xPos-tmpDis-tmpFontDis) + ', ' + (yPos-tmpLen/2) + ')">' + tmpLength + '</text>\n';	
        svgString += '<line x1="' + (xPos-tmpOvDis-tmpStartLeft) + '" y1="' + (yPos) + '" x2="' + (xPos-tmpDis-tmpOvDis) + '" y2="' + (yPos) + '" stroke="black" />\n';
        svgString += '<line x1="' + (xPos-tmpOvDis-tmpStartRight) + '" y1="' + (yPos-tmpLen) + '" x2="' + (xPos-tmpDis-tmpOvDis) + '" y2="' + (yPos-tmpLen) + '" stroke="black" />\n';	
      }	
		}

    // Direction right
		else{
      xPos = startX + boardX / zoom;
      yPos = startY - point / zoom;
      if(tmpLen<15){
        svgString += '<line x1="' + (xPos+tmpDis) + '" y1="' + (yPos-tmpLen-tmpOvDimSmall) + '" x2="' + (xPos+tmpDis) + '" y2="' + (yPos-tmpLen-3) + '" stroke="black" marker-end="url(#arrEnd)" />\n';
        svgString += '<line x1="' + (xPos+tmpDis) + '" y1="' + (yPos) + '" x2="' + (xPos+tmpDis) + '" y2="' + (yPos-tmpLen) + '" stroke="black" />\n';
        svgString += '<line x1="' + (xPos+tmpDis) + '" y1="' + (yPos+3) + '" x2="' + (xPos+tmpDis) + '" y2="' + (yPos+tmpOvDimSmall) + '" stroke="black" marker-start="url(#arrStart)" />\n';
        svgString += '<text x="' + (xPos+tmpDis-tmpFontDis) + '" y="' + (yPos-tmpPositionY) + '" text-anchor="middle" ' + tmpFont + ' transform="rotate(270, ' + (xPos+tmpDis-tmpFontDis) + ', ' + (yPos-tmpPositionY) + ')">' + tmpLength + '</text>\n';	
        svgString += '<line x1="' + (xPos+tmpOvDis+tmpStartLeft) + '" y1="' + (yPos) + '" x2="' + (xPos+tmpDis+tmpOvDis) + '" y2="' + (yPos) + '" stroke="black" />\n';
        svgString += '<line x1="' + (xPos+tmpOvDis+tmpStartRight) + '" y1="' + (yPos-tmpLen) + '" x2="' + (xPos+tmpDis+tmpOvDis) + '" y2="' + (yPos-tmpLen) + '" stroke="black" />\n';	
      }
      else{
        svgString += '<line x1="' + (xPos+tmpDis) + '" y1="' + (yPos-3) + '" x2="' + (xPos+tmpDis) + '" y2="' + (yPos-tmpLen+3) + '" stroke="black" marker-start="url(#arrStart)" marker-end="url(#arrEnd)" />\n';
        svgString += '<text x="' + (xPos+tmpDis-tmpFontDis) + '" y="' + (yPos-tmpLen/2) + '" text-anchor="middle" ' + tmpFont + ' transform="rotate(270, ' + (xPos+tmpDis-tmpFontDis) + ', ' + (yPos-tmpLen/2) + ')">' + tmpLength + '</text>\n';	
        svgString += '<line x1="' + (xPos+tmpOvDis+tmpStartLeft) + '" y1="' + (yPos) + '" x2="' + (xPos+tmpDis+tmpOvDis) + '" y2="' + (yPos) + '" stroke="black" />\n';
        svgString += '<line x1="' + (xPos+tmpOvDis+tmpStartRight) + '" y1="' + (yPos-tmpLen) + '" x2="' + (xPos+tmpDis+tmpOvDis) + '" y2="' + (yPos-tmpLen) + '" stroke="black" />\n';	
      }
			
		}		
	}

	// Return SVG-String to be inserted in the SVG-File
	return svgString;
}