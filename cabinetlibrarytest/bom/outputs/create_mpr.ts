// Schuler Consulting
// Create: Jan 2023
// By Ludwig Weber
// Purpose: HOMAG MPR Converter for tecConfig
//
// Description:
// Converts PartElements to MPR
// It is necessary to use the Standard PartElements for processings inside the library
//
// Revisions:
// 17/11/2023	Joao Lisboa	Adjusted TOOL to nc_Tool and key to key.substring(3)
// 06/09/2024 Ludwig Weber Added functionality MprRelevant to exclude machinings from the MPR
// 13/11/2024 Henning Wiesbrock Added functionality "parseFloat (value.toFixed(2))" to nc_XA amd nc_YA by all processings
// 24/01/2025 Ludwig Weber Added functionality to turn the parts if the ratio of length to width exceeds the value of "rationLengthWidth"
// 03/04/2025 Joao Lisboa Created Sawing Angle (124) + Adjusted dimensions to round to 2 decimals
// 09/01/2026 Joao Lisboa - Adjustment of Component (139)
//===================================================

// Check the tool
let tmpTool = "Nothing";
let mprOutput = true;
let tmpKO = "00";

// Variable to set the border when to turn the parts
let ratioLengthWidth = 0.7;

// Variables of dimensions (to round to 2 decimals)
let width = parseFloat (this.width!.toFixed(2));
let depth = parseFloat (this.depth!.toFixed(2));
let thickness = parseFloat (this.thickness!.toFixed(2));

// Header
let str = "[H" + "\r\n";
str += "Version=\"4.0 Alpha\"" + "\r\n";
str += "OP=\"1\"" + "\r\n";
str += "FM=\"1\"" + "\r\n";
str += "GP=\"0\"" + "\r\n";
str += "UP=\"0\"" + "\r\n";
str += "DW=\"0\"" + "\r\n";
str += "VIEW=\"NOMIRROR\"" + "\r\n";

// Comments
str += "<101 /Kommentar/" + "\r\n";
str += "KM=\"Kommentar\"" + "\r\n";
str += "KM=\"Bauteil: " + part._partId + "\"" +"\r\n";
str += "KM=\"Abmessungen: " + width + "x" + depth + "x" + thickness + " mm\"" + "\r\n";

// Panel-Information
str += "<100 /WerkStck/" + "\r\n";

// Check if we have to turn the part
if(width! < depth! * ratioLengthWidth){
  str += "LA=\"B\"" + "\r\n";
  str += "BR=\"L\"" + "\r\n";
}
else{
  str += "LA=\"L\"" + "\r\n";
  str += "BR=\"B\"" + "\r\n";
}

str += "DI=\"D\"" + "\r\n";
str += "FNX=\"0\"" + "\r\n";
str += "FNY=\"0\"" + "\r\n";
str += "RNX=\"0\"" + "\r\n";
str += "RNY=\"0\"" + "\r\n";
str += "RNZ=\"0\"" + "\r\n";
str += "AX=\"0\"" + "\r\n";
str += "AY=\"0\"" + "\r\n";

// Panel-Variables
str += "[001" + "\r\n";
str += "L=\"" + width + "\"" + "\r\n";
str += "KM=\"Bauteilbreite\"" + "\r\n";
str += "B=\"" + depth + "\"" + "\r\n";
str += "KM=\"Bauteiltiefe\"" + "\r\n";
str += "D=\"" + thickness + "\"" + "\r\n";
str += "KM=\"Bauteildicke\"" + "\r\n";

// New coordinate system in case we have to turn the part
if(width! < depth! * ratioLengthWidth){
  str += "[K" + "\r\n";
  str += "<00 /Koordinatensystem/" + "\r\n";
  str += "NR=\"04\"" + "\r\n";
  str += "XP=\"0\"" + "\r\n";
  str += "XF=\"1.0\"" + "\r\n";
  str += "YP=\"L\"" + "\r\n";
  str += "YF=\"1.0\"" + "\r\n";
  str += "ZP=\"0\"" + "\r\n";
  str += "ZF=\"1.0\"" + "\r\n";
  str += "D1=\"-90\"" + "\r\n";
  str += "KI=\"0\"" + "\r\n";
  str += "D2=\"0\"" + "\r\n";
  str += "MI=\"0\"" + "\r\n";
  tmpKO = "04"
}

// Cycle for the Makros
bomEntries.forEach(b => {

	// Cycle for the tool
	tmpTool = "Nothing";
	b.getAttributes().forEach((value, key) => {
		if(key == "nc_TOOL"){
			tmpTool = value
		}	
    if(key == "nc_MprRelevant"){
      mprOutput = (value === false) ? false : true;
    }
	});

  // Only if the machining should be included in the MPR
  if (mprOutput){

    // Tool 102 drill vertical
    if (tmpTool == "102") {

      str += "<102 /BohrVert/" + "\r\n";

      // Cycle for the Attributes
      b.getAttributes().forEach((value, key) => {
        if (key == "nc_TOOL") {
        }
        else if (key == "nc_XA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_YA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_KO") {
          str += `KO="${tmpKO}"\r\n`;
        }
        else {
          str += key.substring(3) + '="' + value + '"' + "\r\n";
        }
      })
    }

    // Tool 103 drill horizontal
    else if (tmpTool == "103") {

      str += "<103 /BohrHoriz/" + "\r\n";

      // Cycle for the Attributes
      b.getAttributes().forEach((value, key) => {
        if (key == "nc_TOOL") {
        }
        else if (key == "nc_XA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_YA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_KO") {
          str += `KO="${tmpKO}"\r\n`;
        }
        else {
          str += key.substring(3) + '="' + value + '"' + "\r\n";
        }
      })
    }

    // Tool 109 groove
    else if (tmpTool == "109") {

      str += "<109 /Nuten/" + "\r\n";

      // Cycle for the Attributes
      b.getAttributes().forEach((value, key) => {
        if (key == "nc_TOOL") {
        }
        else if (key == "nc_XA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_YA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_XE") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_YE") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_TI") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_NB") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_KO") {
          str += `KO="${tmpKO}"\r\n`;
        }
        else {
          str += key.substring(3) + '="' + value + '"' + "\r\n";
        }
      })
    }

    // Tool 112 pocket
    else if (tmpTool == "112") {

      str += "<112 /Tasche/" + "\r\n";

      // Cycle for the Attributes
      b.getAttributes().forEach((value, key) => {
        if (key == "nc_TOOL") {
        }
        else if (key == "nc_XA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_YA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_LA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_BR") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_TI") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_KO") {
          str += `KO="${tmpKO}"\r\n`;
        }
        else {
          str += key.substring(3) + '="' + value + '"' + "\r\n";
        }
      })
    }

    // Tool 124 Sawing Angle
    else if (tmpTool == "124") {

      str += "<124 /Nut_R/" + "\r\n";

      // Cycle for the Attributes
      b.getAttributes().forEach((value, key) => {
        if (key == "nc_TOOL") {
        }
        else if (key == "nc_XA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_YA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_XE") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_YE") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_KO") {
          str += `KO="${tmpKO}"\r\n`;
        }
        else {
          str += key.substring(3) + '="' + value + '"' + "\r\n";
        }
      })
    }



    /*
    // Tool 139 component (makro)
    else if(tmpTool == "139"){
      str += "<139 /Komponente/" + "\r\n";
        
      // Cycle for the Attributes
      b.getAttributes().forEach((value, key) => {

        if(key == "component"){str += "IN=\"" + value + "\"" + "\r\n"};
        if(key == "posX"){str += "XA=\"" + value + "\"" + "\r\n"};
        if(key == "posY"){
          str += "YA=\"" + value + "\"" + "\r\n";
          str += "VA=\"L L\"" + "\r\n";
          str += "VA=\"B B\"" + "\r\n";
          str += "VA=\"D D\"" + "\r\n";
        };
        if(key == "description"){
          str += "KAT=\"Komponentenmakro\"" + "\r\n";
          str += "MNM=\"" +  value + "\"" + "\r\n";
          str += "ORI=\"2\"" + "\r\n";
          str += `KO="${tmpKO}"\r\n`; 
        }
        else if (key == "nc_XA") {
          str +=  key.substring(3) + '="' + parseFloat (value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_YA") {
          str +=  key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else{	
          str += "VA=\"" + key.substring(3) + " " + value + "\"" + "\r\n";
        }
      });
    }
    */

    // Tool 139 component (makro)
    else if (tmpTool == "139") {

      str += "<139 /Komponente/" + "\r\n";

      // Cycle for the Attributes
      b.getAttributes().forEach((value, key) => {
        if (key == "nc_TOOL") {
        }
        else if (key == "nc_IN") {
          let tmpIN: string = value;
          str += `IN="${tmpIN}"\r\n`;
        }
        else if (key == "nc_XA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_YA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_ZA") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_WI") {
          str += key.substring(3) + '="' + parseFloat(value.toFixed(2)) + '"' + "\r\n";
        }
        else if (key == "nc_EM") {
          let tmpEM: string = value;
          str += `EM="${tmpEM}"\r\n`;
        }
        else if (key == "nc_VA") {
          str += value;
        }
        else if (key == "nc_KAT") {
          let tmpKAT: string = value;
          str += `KAT="${tmpKAT}"\r\n`;
        }
        else if (key == "nc_KO") {
          str += `KO="${tmpKO}"\r\n`;
        }
        else {
          str += key.substring(3) + '="' + value + '"' + "\r\n";
        }
      })
    }
  }
});

// End of File
str += "!" + "\r\n";
str += "!" + "\r\n";

// Write the File 
this.createFileEntry(result, part._partId + "_" + part._id + ".mpr", str);

// Reminder
// str += "  " + b._bomElementTypeId + " (" + b._bomType + ") - " + JSON.stringify(b.a) + "\r\n"
// this.createFileEntry(result, this.name + "_" + this.bomType + "_" + part._id + ".txt", str);