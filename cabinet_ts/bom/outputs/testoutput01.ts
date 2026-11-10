        var str = "######################## " + part._partId + " ################\r\n";
      type ObjectKey = keyof typeof part;
      Object.getOwnPropertyNames(part).forEach((val, idx, array) => {
        str += "  " + `${val}: ${part[val as ObjectKey]}\r\n`;
      });

		  // gehe jeden BOM Eintrag durch
      bomEntries.forEach(b => {
        // gehe jedes Attribute in diesem BOM Eintrag durch
        b.getAttributes().forEach((value, key) => {
          if (key == "width") {
            str += "WIDTH: " + value + "\r\n";
          }
        });

		  str += "  " + b._bomElementTypeId + " (" + b._bomType + ") - " + JSON.stringify(Object.fromEntries(b.getAttributes())) + "\r\n"
		});
    this.createFileEntry(result, this.name + "_" + this.bomType + "_" + part._id + ".txt", str);