/*'use strict';
define(['upload', 'static'],function(){

var Upload = new UpLoad();
var self = null
var _plot = null

//var mdata = { x: 42, s: "hello, world", d: new Date() }
//    fileName = "my-download.json";
function get_plotData(){////m__plot.setAxisScaleEngine(yLeft, new LinearScaleEngine())
  var data = []
  var p = {}
  p.bottomScaleEngineType = _plot.axisScaleEngine(xBottom).toString()
  p.leftScaleEngineType = _plot.axisScaleEngine(yLeft).toString()
  p.topScaleEngineType = _plot.axisScaleEngine(xTop).toString()
  p.rightScaleEngineType = _plot.axisScaleEngine(yRight).toString()
  p.title = _plot.title()
  p.titleFont = _plot.titleFont()
  p.footer = _plot.footer()
  p.footerFont = _plot.footerFont()

  p.axisTitleFont = _plot.axisTitleFont(xBottom)
  p.xBottomAxisTitle = _plot.axisTitle(xBottom)
  p.xTopAxisTitle = _plot.axisTitle(xTop)
  p.yLeftAxisTitle = _plot.axisTitle(yLeft)
  p.yRightAxisTitle = _plot.axisTitle(yRight)

  p.autoScale = _plot.axisAutoScale(xBottom)
  if(!p.autoScale){
    p.xBottomMin = _plot.axisInterval(xBottom).minValue()
    p.xBottomMax = _plot.axisInterval(xBottom).maxValue()
    p.yLeftMin = _plot.axisInterval(yLeft).minValue()
    p.yLeftMax = _plot.axisInterval(yLeft).maxValue()
    p.xTopMin = _plot.axisInterval(xTop).minValue()
    p.xTopMax = _plot.axisInterval(xTop).maxValue()
    p.yRightMin = _plot.axisInterval(yRight).minValue()
    p.yRightMax = _plot.axisInterval(yRight).maxValue()
  }

  data.push(p)
  var list = _plot.itemList(Static.Rtti_PlotCurve)
  for(var i=0; i<list.length; ++i){
    var d = {}
    d.title = list[i].title()
    //d.samples = list[i].data().samples()
	d.samples = Utility.pointsToXYObjectArray(list[i].data().samples());
    d.fn = list[i].fn
    d.pen = list[i].pen()   
    d.fitType = list[i].fitType
    var sym = list[i].symbol()
    if(sym){
      d.symbolType = sym.style()
      d.symbolWidth = sym.size().width      
      d.symbolPenColor = sym.pen().color
      d.symbolPenWidth = sym.pen().width
      d.symbolBrushColor = sym.brush().color
    }
    d.xAxis = list[i].xAxis()
    d.yAxis = list[i].yAxis()

    
    data.push(d)
  }
  return data
}


function saveData(data, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    //return function (data, fileName) {
        var json = JSON.stringify(data),
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    //};
}

function plt(data){
    var obj = JSON.parse(data.content);

      var p = obj[0]
      if(p.rightScaleEngineType == "[LogScaleEngine]"){
        _plot.setAxisScaleEngine(yRight, new LogScaleEngine())
      }
      if(p.leftScaleEngineType == "[LogScaleEngine]"){
        _plot.setAxisScaleEngine(yLeft, new LogScaleEngine())
      }
      if(p.bottomScaleEngineType == "[LogScaleEngine]"){
        _plot.setAxisScaleEngine(xBottom, new LogScaleEngine())
      }
      if(p.topScaleEngineType == "[LogScaleEngine]"){
        _plot.setAxisScaleEngine(xTop, new LogScaleEngine())
      }

      if(p.rightScaleEngineType == "[LinearScaleEngine]"){
        _plot.setAxisScaleEngine(yRight, new LinearScaleEngine())
      }
      if(p.leftScaleEngineType == "[LinearScaleEngine]"){
        _plot.setAxisScaleEngine(yLeft, new LinearScaleEngine())
      }
      if(p.bottomScaleEngineType == "[LinearScaleEngine]"){
        _plot.setAxisScaleEngine(xBottom, new LinearScaleEngine())
      }
      if(p.topScaleEngineType == "[LinearScaleEngine]"){
        _plot.setAxisScaleEngine(xTop, new LinearScaleEngine())
      }

      if(!p.autoScale){
        _plot.setAxisScale(xBottom, p.xBottomMin, p.xBottomMax)
        _plot.setAxisScale(yLeft, p.yLeftMin, p.yLeftMax)
        _plot.setAxisScale(xTop, p.xTopMin, p.xTopMax)
        _plot.setAxisScale(yRight, p.yRightMin, p.yRightMax)
      }
      else{
        setAutoScale(true)
      }
      //setAutoScale(true)

      _plot.setTitleFont(new Misc.Font(p.titleFont))
      _plot.setFooterFont(new Misc.Font(p.footerFont))
      _plot.setAxisTitleFont(xBottom, new Misc.Font(p.axisTitleFont))
      _plot.setAxisTitleFont(xTop, new Misc.Font(p.axisTitleFont))
      _plot.setAxisTitleFont(yLeft, new Misc.Font(p.axisTitleFont))
      _plot.setAxisTitleFont(yRight, new Misc.Font(p.axisTitleFont))

      _plot.setTitle(p.title)
      _plot.setFooter(p.footer)
      _plot.setAxisTitle(xBottom, p.xBottomAxisTitle)
      _plot.setAxisTitle(xTop, p.xTopAxisTitle)
      _plot.setAxisTitle(yLeft, p.yLeftAxisTitle)
      _plot.setAxisTitle(yRight, p.yRightAxisTitle)

      
      for(var i=1; i<obj.length; ++i){
        if (_plot.findPlotCurve( obj[i].title)) {
          Static.alert(obj[i].title + " already exist")
          Upload.reset($("#fileInput"))
          return //false;
        }
      }
      for(var i=1; i<obj.length; ++i){
        var curve = new Curve(obj[i].title) 
        if(obj[i].symbolType !== NoSymbol){
          var sym = new Symbol()
          sym.setStyle(obj[i].symbolType)
          sym.setSize(new Misc.Size(obj[i].symbolWidth, obj[i].symbolWidth))
          sym.setPen(new Misc.Pen(obj[i].symbolPenColor, 
            obj[i].symbolPenWidth))
          sym.setBrush(new Misc.Brush(obj[i].symbolBrushColor))
          curve.setSymbol(sym)
        }     
        if(obj[i].fitType){
          curve.fitType = obj[i].fitType
        }
        //curve.setSamples(obj[i].samples)
		curve.setSamples(Utility.pointsFromXYObjectArray(obj[i].samples))
        if(obj[i].fitType == "natural" || 
                    obj[i].fitType == "periodic"){
            //curve.setData(CurveFitDlg.curve.data())
          var f = new SplineCurveFitter()
            var s = f.spline()
          if(obj[i].fitType == "periodic"){
            s.setSplineType(Static.SplineType.Periodic )
          }else{
              s.setSplineType(Static.SplineType.Natural )
          }
          curve.setCurveFitter(f)
          }
        curve.setPen(new Misc.Pen(obj[i].pen.color, obj[i].pen.width, obj[i].pen.style))
        
        curve.setAxes(obj[i].xAxis, obj[i].yAxis)



        curve.attach(_plot)
        
      }

      Upload.reset($("#fileInput"))
      
  }



	return {
        init: function(plot){
          self = this
          _plot = plot 
          Upload.cb = self.upload           
		    },
        setInputElement: function(el){
          Upload.setInputElement(el)
        }, 
        

        upload: function(data) {
            var extension = data.fileName.split('.')[1]
            //console.log(extension)

            if(extension=='txt'){//csv
              var samples = Utility.makePoints(Utility.toArrays(data.content));
              //addCurve(data.fileName, samples, true)
              Static.trigger('addCurve', [data.fileName, samples, true]);
            }
            
            else if(extension=='plt'){//json
              var list = _plot.itemList(Static.Rtti_PlotCurve)
              if(list.length){
                Static.alertYesNo("Do you want to save the changes to the Grapher?", function(answer){
                    if(answer == Static.Cancel){
                      Upload.reset($("#fileInput"))
                      return
                    }
                    if(answer == Static.Yes){
                      self.save()
                      Upload.reset($("#fileInput"))
                      return
                    }
                    if(answer == Static.No){
                      for(var i=0; i<list.length; ++i){
                        list[i].detach()
                      }
                      //setAutoScale(true)
                      plt(data)
                      return
                    }
                })
              }

              else{
                plt(data)
              }     
              
            }
            
          }
        ,       
            
    		save: function() {
            Static.prompt("Enter a filename without extensions",
              "plot_1", function(filename){
              filename += '.plt'        
              //console.log(filename)
              //var textFile = new Blob(['Hello Sir'],{type: 'text/plain'})
              
              var data = get_plotData()
              //console.log(data)
              saveData(data, filename);

              return true
              
            }, "small") 
        }  

	}
})*/

'use strict';
class MFile{
	constructor(){
		var Upload = new UpLoad();
		var self = this;
		var _plot = null;

		function get_plotData(){////m__plot.setAxisScaleEngine(yLeft, new LinearScaleEngine())
		  var data = [];
		  var p = {};
		  p.bottomScaleEngineType = _plot.axisScaleEngine(xBottom).toString();
		  p.leftScaleEngineType = _plot.axisScaleEngine(yLeft).toString();
		  p.topScaleEngineType = _plot.axisScaleEngine(xTop).toString();
		  p.rightScaleEngineType = _plot.axisScaleEngine(yRight).toString();
		  p.title = _plot.title();
		  p.titleFont = _plot.titleFont();
		  p.footer = _plot.footer();
		  p.footerFont = _plot.footerFont();

		  p.axisTitleFont = _plot.axisTitleFont(xBottom);
		  p.xBottomAxisTitle = _plot.axisTitle(xBottom);
		  p.xTopAxisTitle = _plot.axisTitle(xTop);
		  p.yLeftAxisTitle = _plot.axisTitle(yLeft);
		  p.yRightAxisTitle = _plot.axisTitle(yRight);

		  p.autoScale = _plot.axisAutoScale(xBottom);
		  if(!p.autoScale){
			p.xBottomMin = _plot.axisInterval(xBottom).minValue();
			p.xBottomMax = _plot.axisInterval(xBottom).maxValue();
			p.yLeftMin = _plot.axisInterval(yLeft).minValue();
			p.yLeftMax = _plot.axisInterval(yLeft).maxValue();
			p.xTopMin = _plot.axisInterval(xTop).minValue();
			p.xTopMax = _plot.axisInterval(xTop).maxValue();
			p.yRightMin = _plot.axisInterval(yRight).minValue();
			p.yRightMax = _plot.axisInterval(yRight).maxValue();
		  }

		  data.push(p);
		  var list = _plot.itemList(Static.Rtti_PlotCurve);
		  for(var i=0; i<list.length; ++i){
			var d = {};
			d.title = list[i].title();
			//d.samples = list[i].data().samples();
			d.samples = Utility.pointsToXYObjectArray(list[i].data().samples());
			d.fn = list[i].fn;
			d.pen = list[i].pen();   
			d.fitType = list[i].fitType;
			var sym = list[i].symbol();
			if(sym){
			  d.symbolType = sym.style();
			  d.symbolWidth = sym.size().width;      
			  d.symbolPenColor = sym.pen().color;
			  d.symbolPenWidth = sym.pen().width;
			  d.symbolBrushColor = sym.brush().color;
			}
			d.xAxis = list[i].xAxis();
			d.yAxis = list[i].yAxis();

			
			data.push(d);
		  }
		  return data;
		}

		function saveData(data, fileName) {
			var a = document.createElement("a");
			document.body.appendChild(a);
			a.style = "display: none";
			//return function (data, fileName) {
				var json = JSON.stringify(data),
					blob = new Blob([json], {type: "octet/stream"}),
					url = window.URL.createObjectURL(blob);
				a.href = url;
				a.download = fileName;
				a.click();
				window.URL.revokeObjectURL(url);
			//};
		}

		function plt(data){
			var obj = JSON.parse(data.content);

			  var p = obj[0]
			  if(p.rightScaleEngineType == "[LogScaleEngine]"){
				_plot.setAxisScaleEngine(yRight, new LogScaleEngine())
			  }
			  if(p.leftScaleEngineType == "[LogScaleEngine]"){
				_plot.setAxisScaleEngine(yLeft, new LogScaleEngine())
			  }
			  if(p.bottomScaleEngineType == "[LogScaleEngine]"){
				_plot.setAxisScaleEngine(xBottom, new LogScaleEngine())
			  }
			  if(p.topScaleEngineType == "[LogScaleEngine]"){
				_plot.setAxisScaleEngine(xTop, new LogScaleEngine())
			  }

			  if(p.rightScaleEngineType == "[LinearScaleEngine]"){
				_plot.setAxisScaleEngine(yRight, new LinearScaleEngine())
			  }
			  if(p.leftScaleEngineType == "[LinearScaleEngine]"){
				_plot.setAxisScaleEngine(yLeft, new LinearScaleEngine())
			  }
			  if(p.bottomScaleEngineType == "[LinearScaleEngine]"){
				_plot.setAxisScaleEngine(xBottom, new LinearScaleEngine())
			  }
			  if(p.topScaleEngineType == "[LinearScaleEngine]"){
				_plot.setAxisScaleEngine(xTop, new LinearScaleEngine())
			  }

			  if(!p.autoScale){
				_plot.setAxisScale(xBottom, p.xBottomMin, p.xBottomMax)
				_plot.setAxisScale(yLeft, p.yLeftMin, p.yLeftMax)
				_plot.setAxisScale(xTop, p.xTopMin, p.xTopMax)
				_plot.setAxisScale(yRight, p.yRightMin, p.yRightMax)
			  }
			  else{
				setAutoScale(true)
			  }
			  //setAutoScale(true)

			  _plot.setTitleFont(new Misc.Font(p.titleFont))
			  _plot.setFooterFont(new Misc.Font(p.footerFont))
			  _plot.setAxisTitleFont(xBottom, new Misc.Font(p.axisTitleFont))
			  _plot.setAxisTitleFont(xTop, new Misc.Font(p.axisTitleFont))
			  _plot.setAxisTitleFont(yLeft, new Misc.Font(p.axisTitleFont))
			  _plot.setAxisTitleFont(yRight, new Misc.Font(p.axisTitleFont))

			  _plot.setTitle(p.title)
			  _plot.setFooter(p.footer)
			  _plot.setAxisTitle(xBottom, p.xBottomAxisTitle)
			  _plot.setAxisTitle(xTop, p.xTopAxisTitle)
			  _plot.setAxisTitle(yLeft, p.yLeftAxisTitle)
			  _plot.setAxisTitle(yRight, p.yRightAxisTitle)

			  
			  for(var i=1; i<obj.length; ++i){
				if (_plot.findPlotCurve( obj[i].title)) {
				  Static.alert(obj[i].title + " already exist")
				  Upload.reset($("#fileInput"))
				  return //false;
				}
			  }
			  for(var i=1; i<obj.length; ++i){
				var curve = new Curve(obj[i].title) 
				if(obj[i].symbolType !== NoSymbol){
				  var sym = new Symbol()
				  sym.setStyle(obj[i].symbolType)
				  sym.setSize(new Misc.Size(obj[i].symbolWidth, obj[i].symbolWidth))
				  sym.setPen(new Misc.Pen(obj[i].symbolPenColor, 
					obj[i].symbolPenWidth))
				  sym.setBrush(new Misc.Brush(obj[i].symbolBrushColor))
				  curve.setSymbol(sym)
				}     
				if(obj[i].fitType){
				  curve.fitType = obj[i].fitType
				}
				//curve.setSamples(obj[i].samples)
				curve.setSamples(Utility.pointsFromXYObjectArray(obj[i].samples))
				if(obj[i].fitType == "natural" || 
							obj[i].fitType == "periodic"){
					//curve.setData(CurveFitDlg.curve.data())
				  var f = new SplineCurveFitter()
					var s = f.spline()
				  if(obj[i].fitType == "periodic"){
					s.setSplineType(Static.SplineType.Periodic )
				  }else{
					  s.setSplineType(Static.SplineType.Natural )
				  }
				  curve.setCurveFitter(f)
				  }
				curve.setPen(new Misc.Pen(obj[i].pen.color, obj[i].pen.width, obj[i].pen.style))
				
				curve.setAxes(obj[i].xAxis, obj[i].yAxis)



				curve.attach(_plot)
				
			  }

			  Upload.reset($("#fileInput"))
			  
		  }

		this.init = function(plot){
           // self = this
          _plot = plot 
          Upload.cb = this.upload           
		}

		this.setInputElement = function(el){
          Upload.setInputElement(el)
        }

		this.upload = function(data) {
            var extension = data.fileName.split('.')[1]
            //console.log(extension)

            if(extension=='txt'){//csv
              var samples = Utility.makePoints(Utility.toArrays(data.content));
              //addCurve(data.fileName, samples, true)
              Static.trigger('addCurve', [data.fileName, samples, true]);
            }
            
            else if(extension=='plt'){//json
              var list = _plot.itemList(Static.Rtti_PlotCurve)
              if(list.length){
                Static.alertYesNo("Do you want to save the changes to the Grapher?", function(answer){
                    if(answer == Static.Cancel){
                      Upload.reset($("#fileInput"))
                      return
                    }
                    if(answer == Static.Yes){
                      self.save()
                      Upload.reset($("#fileInput"))
                      return
                    }
                    if(answer == Static.No){
                      for(var i=0; i<list.length; ++i){
                        list[i].detach()
                      }
                      //setAutoScale(true)
                      plt(data)
                      return
                    }
                })
              }

              else{
                plt(data)
              }     
              
            }
            
          }

		this.save = function() {
            Static.prompt("Enter a filename without extensions",
              "plot_1", function(filename){
              filename += '.plt'        
              //console.log(filename)
              //var textFile = new Blob(['Hello Sir'],{type: 'text/plain'})
              
              var data = get_plotData()
              //console.log(data)
              saveData(data, filename);

              return true
              
            }, "small"); 
        }  
           

	}//,,,,
}

        
        

            
 