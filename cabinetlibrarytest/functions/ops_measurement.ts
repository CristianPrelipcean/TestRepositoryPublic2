ops_Measurement(xPos: number, yPos: number, length: number, zoom: number, ori: string, dir: string, level: number, position: string): string {

	// Create SVG-String
	let svgString: string = "";
	
	// Rounding if necessary
	let tmpLength: string;
	if (length % 1 !== 0) {
	  tmpLength = length.toFixed(1);
	} else {
	  tmpLength = length.toString();
	}

	// Variables for the measurments
	let tmpLen: number = length/zoom;
	let tmpOvDis: number = 5;
	let tmpFontSize: number = 18;
	let tmpFontDis: number = 4;
	let tmpDis: number = 26 * level;
	let tmpOvDimSmall = 25;
	
	// Check position
	let tmpPosition: number = 0;
	let tmpAllign: string = "middle";
	if(position == "start"){tmpPosition = -12; tmpAllign = "end";}
	else{tmpPosition = 12; tmpAllign = "start";}
	
	
	// Orientation (horizontal, vertical)
	if (ori == "horizontal"){
		
		// Direction (top, bottom)
		if (dir == "top"){
			if(tmpLen<15){
				svgString += '<line x1="' + (xPos-tmpOvDimSmall) + '" y1="' + (yPos-tmpDis) + '" x2="' + (xPos-5) + '" y2="' + (yPos-tmpDis) + '" stroke="black" marker-end="url(#arrEnd)" />\n';
				svgString += '<line x1="' + (xPos) + '" y1="' + (yPos-tmpDis) + '" x2="' + (xPos+tmpLen) + '" y2="' + (yPos-tmpDis) + '" stroke="black" />\n';
				svgString += '<line x1="' + (xPos+tmpLen+5) + '" y1="' + (yPos-tmpDis) + '" x2="' + (xPos+tmpLen+tmpOvDimSmall) + '" y2="' + (yPos-tmpDis) + '" stroke="black" marker-start="url(#arrStart)" />\n';
				svgString += '<text x="' + (xPos+tmpPosition) + '" y="' + (yPos-tmpDis-tmpFontDis) + '" text-anchor="' + tmpAllign + '" font-family="Arial" font-size="' + tmpFontSize + '">' + tmpLength + '</text>\n';
				svgString += '<line x1="' + (xPos) + '" y1="' + (yPos-tmpOvDis) + '" x2="' + (xPos) + '" y2="' + (yPos-tmpDis-tmpOvDis) + '" stroke="black" />\n';
				svgString += '<line x1="' + (xPos+tmpLen) + '" y1="' + (yPos-tmpOvDis) + '" x2="' + (xPos+tmpLen) + '" y2="' + (yPos-tmpDis-tmpOvDis) + '" stroke="black" />\n';			
			}
			else{
				svgString += '<line x1="' + (xPos+5) + '" y1="' + (yPos-tmpDis) + '" x2="' + (xPos+tmpLen-5) + '" y2="' + (yPos-tmpDis) + '" stroke="black" marker-start="url(#arrStart)" marker-end="url(#arrEnd)" />\n';
				svgString += '<text x="' + (xPos+tmpLen/2) + '" y="' + (yPos-tmpDis-tmpFontDis) + '" text-anchor="middle" font-family="Arial" font-size="' + tmpFontSize + '">' + tmpLength + '</text>\n';
				svgString += '<line x1="' + (xPos) + '" y1="' + (yPos-tmpOvDis) + '" x2="' + (xPos) + '" y2="' + (yPos-tmpDis-tmpOvDis) + '" stroke="black" />\n';
				svgString += '<line x1="' + (xPos+tmpLen) + '" y1="' + (yPos-tmpOvDis) + '" x2="' + (xPos+tmpLen) + '" y2="' + (yPos-tmpDis-tmpOvDis) + '" stroke="black" />\n';
			}
		}
		else{
			if(tmpLen<15){
				svgString += '<line x1="' + (xPos-tmpOvDimSmall) + '" y1="' + (yPos+tmpDis) + '" x2="' + (xPos-5) + '" y2="' + (yPos+tmpDis) + '" stroke="black" marker-end="url(#arrEnd)" />\n';
				svgString += '<line x1="' + (xPos) + '" y1="' + (yPos+tmpDis) + '" x2="' + (xPos+tmpLen) + '" y2="' + (yPos+tmpDis) + '" stroke="black" />\n';
				svgString += '<line x1="' + (xPos+tmpLen+5) + '" y1="' + (yPos+tmpDis) + '" x2="' + (xPos+tmpLen+tmpOvDimSmall) + '" y2="' + (yPos+tmpDis) + '" stroke="black" marker-start="url(#arrStart)" />\n';				
				svgString += '<text x="' + (xPos+tmpPosition) + '" y="' + (yPos+tmpDis-tmpFontDis) + '" text-anchor="' + tmpAllign + '" font-family="Arial" font-size="' + tmpFontSize + '">' + tmpLength + '</text>\n';
				svgString += '<line x1="' + (xPos) + '" y1="' + (yPos+tmpOvDis) + '" x2="' + (xPos) + '" y2="' + (yPos+tmpDis+tmpOvDis) + '" stroke="black" />\n';
				svgString += '<line x1="' + (xPos+tmpLen) + '" y1="' + (yPos+tmpOvDis) + '" x2="' + (xPos+tmpLen) + '" y2="' + (yPos+tmpDis+tmpOvDis) + '" stroke="black" />\n';					
			}
			else{				
				svgString += '<line x1="' + (xPos+5) + '" y1="' + (yPos+tmpDis) + '" x2="' + (xPos+tmpLen-5) + '" y2="' + (yPos+tmpDis) + '" stroke="black" marker-start="url(#arrStart)" marker-end="url(#arrEnd)" />\n';
				svgString += '<text x="' + (xPos+tmpLen/2) + '" y="' + (yPos+tmpDis-tmpFontDis) + '" text-anchor="middle" font-family="Arial" font-size="' + tmpFontSize + '">' + tmpLength + '</text>\n';
				svgString += '<line x1="' + (xPos) + '" y1="' + (yPos+tmpOvDis) + '" x2="' + (xPos) + '" y2="' + (yPos+tmpDis+tmpOvDis) + '" stroke="black" />\n';
				svgString += '<line x1="' + (xPos+tmpLen) + '" y1="' + (yPos+tmpOvDis) + '" x2="' + (xPos+tmpLen) + '" y2="' + (yPos+tmpDis+tmpOvDis) + '" stroke="black" />\n';	
			}			
		}
	}
	else{

		// Direction (left, right)
		if (dir == "left"){
			svgString += '<line x1="' + (xPos-tmpDis) + '" y1="' + (yPos-5) + '" x2="' + (xPos-tmpDis) + '" y2="' + (yPos-tmpLen+5) + '" stroke="black" marker-start="url(#arrStart)" marker-end="url(#arrEnd)" />\n';
			svgString += '<text x="' + (xPos-tmpDis-tmpFontDis) + '" y="' + (yPos-tmpLen/2) + '" text-anchor="middle" font-family="Arial" font-size="' + tmpFontSize + '" transform="rotate(270, ' + (xPos-tmpDis-tmpFontDis) + ', ' + (yPos-tmpLen/2) + ')">' + tmpLength + '</text>\n';	
			svgString += '<line x1="' + (xPos-tmpOvDis) + '" y1="' + (yPos) + '" x2="' + (xPos-tmpDis-tmpOvDis) + '" y2="' + (yPos) + '" stroke="black" />\n';
			svgString += '<line x1="' + (xPos-tmpOvDis) + '" y1="' + (yPos-tmpLen) + '" x2="' + (xPos-tmpDis-tmpOvDis) + '" y2="' + (yPos-tmpLen) + '" stroke="black" />\n';		
		}
		else{
			svgString += '<line x1="' + (xPos+tmpDis) + '" y1="' + (yPos-5) + '" x2="' + (xPos+tmpDis) + '" y2="' + (yPos-tmpLen+5) + '" stroke="black" marker-start="url(#arrStart)" marker-end="url(#arrEnd)" />\n';
			svgString += '<text x="' + (xPos+tmpDis-tmpFontDis) + '" y="' + (yPos-tmpLen/2) + '" text-anchor="middle" font-family="Arial" font-size="' + tmpFontSize + '" transform="rotate(270, ' + (xPos+tmpDis-tmpFontDis) + ', ' + (yPos-tmpLen/2) + ')">' + tmpLength + '</text>\n';	
			svgString += '<line x1="' + (xPos+tmpOvDis) + '" y1="' + (yPos) + '" x2="' + (xPos+tmpDis+tmpOvDis) + '" y2="' + (yPos) + '" stroke="black" />\n';
			svgString += '<line x1="' + (xPos+tmpOvDis) + '" y1="' + (yPos-tmpLen) + '" x2="' + (xPos+tmpDis+tmpOvDis) + '" y2="' + (yPos-tmpLen) + '" stroke="black" />\n';				
		}		
	}

	// Return SVG-String to be inserted in the SVG-File
	return svgString;
}