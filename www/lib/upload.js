'use strict';
class UpLoad {
    constructor(plot, name, rulerGroup) {
        var self = this;
        this.cb = null;

        this.reset = function (inputDiv) {
            inputDiv[0].value = "";
        }

        this.setInputElement = function (inputDiv) {
            Static.bind("itemAttached", function (e, plotItem, on) {
                //if (plotItem.rtti == PlotItem.RttiValues.Rtti_PlotCurve) {
				if (plotItem.rtti > PlotItem.RttiValues.Rtti_PlotMarker && plotItem.rtti < PlotItem.RttiValues.Rtti_PlotShape) {
                    if ($("#fileInput").val().includes(plotItem.title()) && !on)
                        self.reset($("#fileInput"));
                }
            });
            inputDiv.change(function (evt) {

                var files = evt.target.files; // FileList object

                // Loop through the FileList.
                for (var i = 0, f; f = files[i]; i++) {
                    // Only process image files.
                    var fileExtension = f.name.split('.')[1];
                    

                    if (fileExtension != "txt" && fileExtension != "xls" && fileExtension != "xlsx" && fileExtension != "plt") {
                        continue;
                    }

                    var reader = new FileReader();

                    // Closure to capture the file information.
                    reader.onload = (function (theFile) {
                        return function (e) {
                            //console.log(e)
                            if (self.cb)
                                self.cb({
                                    fileName: theFile.name,
                                    content: e.target.result
                                });
                            else
                                console.log({
                                    fileName: theFile.name,
                                    content: e.target.result
                                });
                        };
                    })(f);

                    //console.log(f)
                    // Read in the file.
					if (fileExtension == "xls" || fileExtension == "xlsx"){
						reader.readAsBinaryString(f);
					}else{
						reader.readAsText(f);
					}
                    //


                }
            });
        }
    }
}
