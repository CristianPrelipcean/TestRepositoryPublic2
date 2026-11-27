        var str = "######################## " + part._partId + " ################\r\n";
        str += "Id: " + part._id + "\r\n";
        str += "  Width: " + this.width + "\r\n";
        str += "  Depth: " + this.depth + "\r\n";
        str += "  Thickness: " + this.thickness + "\r\n";
        bomEntries.forEach(b => str += "  " + b._bomElementTypeId + " (" + b._bomType + ") - " + JSON.stringify(Object.fromEntries(b.getAttributes())) + "\r\n");
        this.createFileEntry(result, this.name + "_" + this.bomType + "_" + part._id + ".txt", str);
		