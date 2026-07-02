// Schuler Consulting
// Create: August 2023
// By Ludwig Weber
// Purpose: Create OrderOutput for productionManager
//
// Description:
// Create OrderOutput for productionManager
// XML-Export
//
// Revisions:
// 
//===================================================

// Create variables
let outStr : string = '';
let countOL : number = 0;
let openEntity = false;
let openEntities = false;
let target = o.targetProductionSite;

// Function to validate strings
function escapeXml(unsafe: string | undefined): string {
  if (unsafe === undefined || unsafe === '') {
    return '';
  }
  return unsafe.replace(/[<>&'"]/g, function (c): string {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
    }
    return c;
  });
}

// Function to format the date
function formatDateToXml(dateInput: any): string {

  // Dynamic Fallback: actual date + 30 days
  const fallbackDate = new Date();
  fallbackDate.setDate(fallbackDate.getDate() + 30);

  if (!dateInput) {
    return fallbackDate.toISOString();
  }

  // Delete bracket with time zone
  const cleaned = typeof dateInput === 'string' ? dateInput.replace(/\s*\(.*\)/, '') : dateInput;
  const date = new Date(cleaned);

  if (isNaN(date.getTime())) {
    return fallbackDate.toISOString();
  }

  return date.toISOString();
}

//===================================================
// Insert the MPR-Files and drawings
//===================================================

// Order Row Data
ol.forEach(p =>
{
  // NC-Data
  let bo = this.createBomOutputCreate_Mpr(p.bomEntries);
  bo.forEach((value,key) => {
  result.set("Images/" + o.orderNo + "_" + p.orderLineNo + "_" + key, value);
  })

  // Drawings
  let elem = this.createBomOutputCreate_Drawing(p.bomEntries);
  elem.forEach((value,key) => {
    result.set("Images/" + o.orderNo + "_" + p.orderLineNo + "_" + key, value);
  })
});

//===================================================
// XML Header
//===================================================

outStr += '<?xml version="1.0" encoding="utf-8"?>' + '\n';
outStr += '<project' + '\n';

outStr += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' + '\n';
outStr += 'xsi:schemaLocation="http://schemas.datacontract.org/2004/07/HomagGroup.ProductionManager.Core.Logic.Import ImportExport.xsd"' + '\n';
outStr += 'xsi:noNamespaceSchemaLocation="ImportExport.xsd"' + '\n';
outStr += 'xmlns="http://schemas.datacontract.org/2004/07/HomagGroup.ProductionManager.Core.Logic.Import" >' + '\n';

//===================================================
// Order Header
//===================================================

outStr += '<orders>' + '\n';
outStr += '<order>' + '\n';
outStr += '<properties>' + '\n';

// Order Header Data
outStr += '<param name="OrderName" value="' + o.orderNo + '" />' + '\n';
outStr += '<param name="CustomerName" value="' + escapeXml(o.shopContact!) + '" />' + '\n';
outStr += '<param name="CustomerNumber" value="' + escapeXml(o.posOrderDesc1!) + '" />' + '\n';
//outStr += '<param name="Source" value="salesConfigurator" />' + '\n';
outStr += `<param name="OrderDate" value="${formatDateToXml(new Date())}" />\n`;
outStr += `<param name="DeliveryDate" value="${formatDateToXml(o.posDeliveryDate)}" />' + '\n`;
outStr += '<param name="AddressField1" value="Herr / Frau" />' + '\n';
outStr += '<param name="AddressField2" value="' + escapeXml(o.shopContact!) + '" />' + '\n';
outStr += '<param name="AddressField3" value="' + escapeXml(o.shippingStreetNo!) + '" />' + '\n';
outStr += '<param name="AddressField4" value="' + escapeXml(o.shippingZipCode!) + ' ' + escapeXml(o.shippingCity!) + '" />' + '\n';
outStr += '</properties>' + '\n';

outStr += '<images>' + '\n';
let fileIdx=0;
if (o.additionalData) {
  o.additionalData.forEach(ad => {
    if (ad.fileType) {
      outStr += '<image>' + '\n';
      outStr += '<properties>' + '\n';
      if (ad.fileType === "RoomImage") {
        outStr += '<param name="Category" value="OverviewImage" />' + '\n';
      } 
      else if (ad.fileType === "Room3DImage") {
        outStr += '<param name="Category" value="Autodesk3DsModel" />' + '\n';
      }
      if (ad.description) {
        outStr += '<param name="Description" value="' + escapeXml(ad.description) + '" />' + '\n';
      }
      outStr += '<param name="OriginalFileName" value="' + escapeXml(ad.originalFileName ?? "") + '" />' + '\n';
      outStr += '<param name="ImageLinkBinary" value="Images\\' + fileIdx + "_" + escapeXml(ad.originalFileName ?? "") + '" />' + '\n';
      outStr += '</properties>' + '\n';
      outStr += '</image>' + '\n';
      this.createFileEntry(result, 'Images/' + fileIdx + "_" + ad.originalFileName!, ad.value, "additionalData");
      fileIdx++;
    }
  });
}
outStr += '</images>' + '\n';
outStr += '<entities>' + '\n';

//===================================================
// Order Line Header
//===================================================

// Cycle for the order rows
ol.forEach(p =>
{
  countOL++;

  outStr += '<entity>' + '\n';
  outStr += '<properties>' + '\n';

  outStr += '<param name="Typ" value="OrderItem" />' + '\n';
  outStr += `<param name="OrderItemNumber" value="${p.posOrderLineNo ?? countOL}" />\n`;
  outStr += '<param name="ArticleNumber" value="' + p.posArticleNo + '" />' + '\n';
  outStr += '<param name="ArticleDescription" value="' + p.posArticleNo + '" />' + '\n';
  outStr += '<param name="Quantity" value="1" />' + '\n';
  outStr += '<param name="QuantityUnit" value="pcs" />' + '\n';
  outStr += '<param name="ExternalSystemId" value="' + p.orderLineId + '" />' + '\n';

  outStr += '</properties>' + '\n';
  outStr += '<images>' + '\n';
  if (p.additionalData) {
    p.additionalData.forEach(ad => {
      if (ad.fileType) {
        outStr += '<image>' + '\n';
        outStr += '<properties>' + '\n';
        if (ad.fileType === "ArticleImage") {
          outStr += '<param name="Category" value="OverviewImage" />' + '\n';
        } 
        else if (ad.fileType === "Article3dModel") {
          outStr += '<param name="Category" value="Autodesk3DsModel" />' + '\n';
        }
        if (ad.description) {
          outStr += '<param name="Description" value="' + escapeXml(ad.description) + '" />' + '\n';
        }
        outStr += '<param name="OriginalFileName" value="' + escapeXml(ad.originalFileName ?? "") + '" />' + '\n';
        outStr += '<param name="ImageLinkBinary" value="Images\\' + fileIdx + "_" + escapeXml(ad.originalFileName ?? "") + '" />' + '\n';
        outStr += '</properties>' + '\n';
        outStr += '</image>' + '\n';
        this.createFileEntry(result, 'Images/' + fileIdx + "_" + ad.originalFileName!, ad.value, "additionalData");
        fileIdx++;
      }
    });
  }
  outStr += '</images>' + '\n';
  outStr += '<entities>' + '\n';

// Order Line Parts
//===================================================

  // Create output data for all elements in the order line
  let bom = this.createBomOutputCreate_Bom(p.bomEntries);
  let myParent = 'Root';
  
  // Find function for the output data
  const findBomParent = (parent:string): Map<string, BomOutputFileEntry> =>  {
    let r = new Map<string, BomOutputFileEntry> ();
  
    bom.forEach((value, key) => {
      let k = JSON.parse(key);
      if (k.parent === parent) {
        r.set(key, value);
      }
    })
    return r;   
  }

  // Insertion function for the XML-File
  function insertStringXML(k:any){
    if (k.Type === "Partgroup" && (k.category === target || target == 'TARGET-PRODUCTION-SITE' || target == undefined)){
      if (openEntities == true){outStr += '</entities>' + '\n'; openEntities = false;}
      if (openEntity == true){outStr += '</entity>' + '\n'; openEntity = false;}
      outStr += '<entity>' + '\n';
      openEntity = true;
      outStr += '<properties>' + '\n';           
      outStr += '<param name="Typ" value="Component" />' + '\n';
      outStr += '<param name="ArticleNumber" value="' + k.id + '" />' + '\n';
      outStr += '<param name="ArticleDescription" value="' + k.Name + '" />' + '\n';
      outStr += '<param name="Quantity" value="1" />' + '\n';
      outStr += '<param name="QuantityUnit" value="pcs" />' + '\n';            
      outStr += '<param name="Length" value="' + k.width + '" />' + '\n';
      outStr += '<param name="Width" value="' + k.depth + '" />' + '\n';
      outStr += '<param name="Thickness" value="' + k.thickness + '" />' + '\n';     
      outStr += '</properties>' + '\n';
      outStr += '<images>' + '\n';
      outStr += '</images>' + '\n';
      outStr += '<entities>' + '\n';
      openEntities = true;                         
    }

    if (k.Type === "Board" && (k.category === target || target == 'TARGET-PRODUCTION-SITE' || target == undefined)) {
      outStr += '<entity>' + '\n';
      outStr += '<properties>' + '\n'; 
      outStr += '<param name="Elementtype" value="' + k.Type + '" />' + '\n';            
      outStr += '<param name="Typ" value="ProductionOrder" />' + '\n';
      outStr += '<param name="ArticleNumber" value="' + k.Name + '" />' + '\n';
      outStr += '<param name="ArticleDescription" value="' + k.Name + ' of ' + k.parent + '" />' + '\n';
      outStr += '<param name="ArticleGroup" value="' + k.ArticleGroup + '" />' + '\n';
      outStr += '<param name="Quantity" value="1" />' + '\n';
      outStr += '<param name="QuantityUnit" value="pcs" />' + '\n';
      if(result.has("Images/" + o.orderNo + "_" + p.orderLineNo + "_" + k.barcode + '.mpr')){
        outStr += '<param name="CncProgramName" value="Images\\' + o.orderNo + "_" + p.orderLineNo + "_" + k.barcode + '.mpr" />' + '\n';
      }
      
      outStr += '<param name="Material" value="' + k.material + '" />' + '\n';
      outStr += '<param name="Grain" value="' + k.grain + '" />' + '\n';
      outStr += '<param name="FinishLength" value="' + k.width + '" />' + '\n';
      outStr += '<param name="FinishWidth" value="' + k.depth + '" />' + '\n';
      outStr += '<param name="Length" value="' + k.cutLength + '" />' + '\n';
      outStr += '<param name="Width" value="' + k.cutWidth + '" />' + '\n';
      outStr += '<param name="Thickness" value="' + k.thickness + '" />' + '\n';
      outStr += '<param name="EdgeDiagram" value="' + k.EdgeTransition + '" />' + '\n';                
      outStr += '<param name="EdgeFront" value="' + k.EdgeFront + '" />' + '\n'; 
      outStr += '<param name="EdgeBack" value="' + k.EdgeBack + '" />' + '\n'; 
      outStr += '<param name="EdgeLeft" value="' + k.EdgeLeft + '" />' + '\n'; 
      outStr += '<param name="EdgeRight" value="' + k.EdgeRight + '" />' + '\n'; 
      outStr += '</properties>' + '\n';

      // Reference to the MPR
      outStr += '<images>' + '\n'; 
      if(result.has("Images/" + o.orderNo + "_" + p.orderLineNo + "_" + k.barcode + '.mpr')){
        outStr += '<image>' + '\n';
        outStr += '<properties>' + '\n'; 
        outStr += '<param name="Category" value="MPR" />' + '\n'; 
        outStr += '<param name="Description" value="Bohrbild" />' + '\n'; 
        outStr += '<param name="OriginalFileName" value="' + o.orderNo + "_" + p.orderLineNo + "_" + k.barcode + '.mpr" />' + '\n'; 
        outStr += '<param name="ImageLinkBinary" value="Images\\' + o.orderNo + "_" + p.orderLineNo + "_" + k.barcode + '.mpr" />' + '\n'; 
        outStr += '</properties>' + '\n';
        outStr += '</image>' + '\n';
      } 
      outStr += '</images>' + '\n';

      // Reference to the SVG
      outStr += '<images>' + '\n'; 
      if(result.has("Images/" + o.orderNo + "_" + p.orderLineNo + "_" + k.barcode + '.svg')){
        outStr += '<image>' + '\n';
        outStr += '<properties>' + '\n'; 
        outStr += '<param name="Category" value="SVG" />' + '\n'; 
        outStr += '<param name="Description" value="Bauteilzeichnung" />' + '\n'; 
        outStr += '<param name="OriginalFileName" value="' + o.orderNo + "_" + p.orderLineNo + "_" + k.barcode + '.svg" />' + '\n'; 
        outStr += '<param name="ImageLinkBinary" value="Images\\' + o.orderNo + "_" + p.orderLineNo + "_" + k.barcode + '.svg" />' + '\n'; 
        outStr += '</properties>' + '\n';
        outStr += '</image>' + '\n';
      } 
      outStr += '</images>' + '\n';

      outStr += '</entity>' + '\n';         
    }
  }

  // Logic for data insertion to the string Level1
  let res = findBomParent(myParent);
  res.forEach((value,key) => {
    let k = JSON.parse(key);
    insertStringXML(k);

    // Logic for data insertion to the string Level2
    let res1 = findBomParent(k.id);
    res1.forEach((value,key) => {
      let k = JSON.parse(key); 
      insertStringXML(k);

      // Logic for data insertion to the string Level3
      let res2 = findBomParent(k.id);
      res2.forEach((value,key) => {
        let k = JSON.parse(key);
        insertStringXML(k);
    
      })
    })		
  })   
  
//===================================================
// Closing the order line
//===================================================

// Close the part group if it is opended
if (openEntities == true){outStr += '</entities>' + '\n'; openEntities = false;}
if (openEntity == true){outStr += '</entity>' + '\n'; openEntity = false;}

// Close the order line
outStr += '</entities>' + '\n'; 
outStr += '</entity>' + '\n';
});

//===================================================
// Closing the order and project
//===================================================

// Close all open brackets
outStr += '</entities>' + '\n';
outStr += '</order>' + '\n';
outStr += '</orders>' + '\n';
outStr += '</project>' + '\n';

// Create File
this.createFileEntry(result, "project.xml", outStr);