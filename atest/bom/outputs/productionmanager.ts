
    this.createFileEntry(result, "order-data.txt", JSON.stringify(o, null, 2));

    var merge = function(source:Map<string,BomOutputFileEntry>, target:Map<string,BomOutputFileEntry>, orderLineNo:number): void {
      source.forEach((value, key) => {
        let fileName = key.replace('.txt', '_' + orderLineNo + '.txt');
        if (target.has(fileName)) {
          throw "File '" + fileName + "' is already placed in the output(duplicate)!";
        }
          target.set(fileName, value);
      });
      };

    ol.forEach(p =>
    {
      this.createFileEntry(result, "order-line" + p.orderLineNo + ".txt", JSON.stringify(p, (key: string, value: any) => {
        if (key == 'bomEntries') return undefined;
        return value;
      }, 2));

      var bo = this.createBomOutputMPRProgram(p.bomEntries);
      merge(bo, result, p.orderLineNo);

      var bo = this.createBomOutputTestOutput01(p.bomEntries);
      merge(bo, result, p.orderLineNo);
    });