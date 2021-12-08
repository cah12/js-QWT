'use strict';
var Static = {};
var Enum = {};

Static.qBound = function(min, val, max){
     return Math.max(min, Math.min(val, max));
}

/*Returns a sub-vector which contains elements from this vector, starting at position pos. If length is -1 (the default), all elements after pos are included; otherwise length elements (or all remaining elements if there are less than length elements) are included. */
Array.prototype.mid = function(pos, length = -1){
	if(length == -1)
		return this.slice(pos+1)
	length = Math.max(length, 0)
	return this.slice(pos, pos+length)
	
}

/* 
Static.linearEquationFromPoints = function(p1, p2){                
                var m = (p2.y - p1.y)/(p2.x - p1.x)
                var c = -m*p1.x +p1.y;
                var fn = m.toString()
                fn += "x+"
                fn += c.toString()
                return fn
            } */

String.prototype.insertAt = function(idx, rem, str) {//idx = index to insert; rem = count of charaters to delete; str = string to insert
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

Array.prototype.resize = function(newSize, init = undefined) {
    //var self = this
    //self = []
    while(newSize > this.length)
        this.push(init);
    //self.length = newSize;
}


Array.prototype.containsPoint = function(point){
	var self = this;
	for (var i = 0; i < self.length; ++i) {
		if (self[i].isEqual(point))
			return true;		
	}
	return false;
}

//Static.ignore = false;
/* Static.silentIgnore = 0;
Static.warnIgnore = 1;
Static.warn = 2;

Static.errorResponse = Static.warn;
Static.errorResponseChanged = false; */

//Static.shadeWatchArea = true;



/* Static.Rtti_PlotItem = 0; //Unspecific value, that can be used, when it doesn't matter.
Static.Rtti_PlotGrid = 1; //For QwtPlotGrid.
Static.Rtti_PlotScale = 2; //For QwtPlotScaleItem.
Static.Rtti_PlotLegend = 3; //For QwtPlotLegendItem.
Static.Rtti_PlotMarker = 4; //For QwtPlotMarker.
Static.Rtti_PlotCurve = 5; //For QwtPlotCurve.
Static.Rtti_PlotSpectroCurve = 6; //For QwtPlotSpectroCurve.
Static.Rtti_PlotIntervalCurve = 7; //For QwtPlotIntervalCurve.
Static.Rtti_PlotHistogram = 8; //For QwtPlotHistogram.
Static.Rtti_PlotSpectrogram = 9; //For QwtPlotSpectrogram.
Static.Rtti_PlotSVG = 10; //For QwtPlotSvgItem.
Static.Rtti_PlotTradingCurve = 11; //For QwtPlotTradingCurve.
Static.Rtti_PlotBarChart = 12; //For QwtPlotBarChart.
Static.Rtti_PlotMultiBarChart = 13; //For QwtPlotMultiBarChart.
Static.Rtti_PlotShape = 14; //For QwtPlotShapeItem.
Static.Rtti_PlotTextLabel = 15; //For QwtPlotTextLabel.
Static.Rtti_PlotZone = 16; //For QwtPlotZoneItem.
Static.Rtti_PlotUserItem = 1000; //Values >= Rtti_PlotUserItem are reserved for plot items not implemented in the Qwt library. */

Static.MagnifierEnabled = 1
Static.ZoomEnabled = 2
Static.PanEnabled = 4
Static.Locked = 8
Static.LeftButtonDown = 16
Static.DragCursor = 32
Static.PanningInProgress = 64
Static.MagnifierSearch = 128
Static.ZoomerSearch = 256
Static.PannerSearch = 512
Static.NoRuler = 1024

/*Static.MagnifierEnabled = 0x1
Static.ZoomEnabled = 0x2
Static.PanEnabled = 0x4
Static.Locked = 0x8
Static.LeftButtonDown = 0x10
Static.DragCursor = 0x20
Static.PanningInProgress = 0x40
Static.MagnifierSearch = 0x80
Static.ZoomerSearch = 0x100
Static.PannerSearch = 0x200
Static.NoRuler = 0x400 */
Static.Left = 0 
Static.Right = 1
Static.Bottom = 2
Static.Top = 3
Static.LeftAndRight = 0x12800 
Static.BottomAndTop = 0x25600

Static.NoTrackingText = 0
Static.FullTrackingText = 1
Static.PartialTrackingText = 2

//! Mode defining how a legend entry interacts

//! The legend item is not interactive, like a label
Static.ReadOnly = 0;

//! The legend item is clickable, like a push button
Static.Clickable = 1;

//! The legend item is checkable, like a checkable button
Static.Checkable = 2;

//! Identifier how to interprete a QVariant

// The value is a Mode
Static.ModeRole = 0,

// The value is a title
Static.TitleRole = 1,

// The value is an icon
Static.IconRole = 2,

// Values < UserRole are reserved for internal use
Static.UserRole = 32;

//! No rubberband.
Static.NoRubberBand = 0;

//! A horizontal line ( only for QwtPickerMachine::PointSelection )
Static.HLineRubberBand = 1;

//! A vertical line ( only for QwtPickerMachine::PointSelection )
Static.VLineRubberBand = 2;

//! A crosshair ( only for QwtPickerMachine::PointSelection )
Static.CrossRubberBand = 3;

//! A rectangle ( only for QwtPickerMachine::RectSelection )
Static.RectRubberBand = 4;

//! An ellipse ( only for QwtPickerMachine::RectSelection )
Static.EllipseRubberBand = 5;

//! A polygon ( only for QwtPickerMachine::PolygonSelection )
Static.PolygonRubberBand = 6;

/*!
Values >= UserRubberBand can be used to define additional
rubber bands.
 */
Static.UserRubberBand = 100;

//! The state machine not usable for any type of selection.
Static.NoSelection = -1;

//! The state machine is for selecting a single point.
Static.PointSelection = 0;

//! The state machine is for selecting a rectangle (2 points).
Static.RectSelection = 1;

//! The state machine is for selecting a polygon (many points).
Static.PolygonSelection = 2;

//! Display never
Static.AlwaysOff = 0;

//! Display always
Static.AlwaysOn = 1;

//! Display only when the selection is active
Static.ActiveOnly = 2;

//var NoPen = -1;
//var NoBrush = -1;

Static.NoPen = "noPen";
Static.NoBrush = "noBrush";

Static.accuracyBase = 300000;
Static.accuracyMaxSteps = Static.accuracyBase*0.5;//Moderate
//Static.accuracyMinStepSize = 0.00000136 * 2 * 2 * 2;

var _eps = 1.0e-6; //
var NoTick = -1;
var MinorTick = 0;
var MediumTick = 1;
var MajorTick = 2;
var NTickTypes = 3;

//! The scale is below
var BottomScale = 0;
//! The scale is above
var TopScale = 1;
//! The scale is left
var LeftScale = 2;
//! The scale is right
var RightScale = 3;

var Horizontal = 1;
var Vertical = 2;

/* //! Backbone = the line where the ticks are located
var Backbone = 0x01;
//! Ticks
var Ticks = 0x02;
//! Labels
var Labels = 0x04; */

var ScaleInterest = 0x01;

//Interval flags
var IncludeBorders = 0x00;
// Min value is not included in the interval
var ExcludeMinimum = 0x01;
// Max value is not included in the interval
var ExcludeMaximum = 0x02;
// Min/Max values are not included in the interval
var ExcludeBorders = 0x03;

//Y axis left of the canvas
var yLeft = 0;
//Y axis right of the canvas
var yRight = 1;
// X axis below the canvas
var xBottom = 2;
// X axis above the canvas
var xTop = 3;
// Number of axes
var axisCnt = 4;

//! The item is represented on the legend.
var Legend = 0x01;

/*!
The boundingRect() of the item is included in the
autoscaling calculation as long as its width or height
is >= 0.0.
 */
var AutoScale = 0x02;

/*!
The item needs extra space to display something outside
its bounding rectangle.
\sa getCanvasMarginHint()
 */
var Margins = 0x04;

/*!
Don't draw a curve. Note: This doesn't affect the symbols.
 */
var NoCurve = -1;

/*!
Connect the points with straight lines. The lines might
be interpolated depending on the 'Fitted' attribute. Curve
fitting can be configured using setCurveFitter().
 */
var Lines = 0;

/*!
Draw vertical or horizontal sticks ( depending on the
orientation() ) from a baseline which is defined by setBaseline().
 */
var Sticks = 1;

/*!
Connect the points with a step function. The step function
is drawn from the left to the right or vice versa,
depending on the QwtPlotCurve::Inverted attribute.
 */
var Steps = 2;

/*!
Draw dots at the locations of the data points. Note:
This is different from a dotted line (see setPen()), and faster
as a curve in QwtPlotCurve::NoStyle style and a symbol
painting a point.
 */
var Dots = 3;

/*!
Styles >= QwtPlotCurve::UserCurve are reserved for derived
classes of QwtPlotCurve that overload drawCurve() with
additional application specific curve types.
 */
var UserCurve = 100;

/*!
For QwtPlotCurve::Steps only.
Draws a step function from the right to the left.
 */
var Inverted = 0x01;

/*!
Only in combination with QwtPlotCurve::Lines
A QwtCurveFitter tries to
interpolate/smooth the curve, before it is painted.

\note Curve fitting requires temporary memory
for calculating coefficients and additional points.
If painting in QwtPlotCurve::Fitted mode is slow it might be better
to fit the points, before they are passed to QwtPlotCurve.
 */
var Fitted = 0x02;

//! Round points to integer values
var RoundPoints = 0x01;

/*!
Try to remove points, that are translated to the
same position.
 */
var WeedOutPoints = 0x02;

/*!
Tries to reduce the data that has to be painted, by sorting out
duplicates, or paintings outside the visible area. Might have a
notable impact on curves with many close points.
Only a couple of very basic filtering algorithms are implemented.
 */
var FilterPoints = 0x01;

/*!
Minimize memory usage that is temporarily needed for the
translated points, before they get painted.
This might slow down the performance of painting
 */
var MinimizeMemory = 0x02;

/*!
Line styles.
\sa setLineStyle(), lineStyle()
 */
//enum LineStyle
//{
//! No line
var NoLine = 0;

//! A horizontal line
//var HLine = 1;


//! A vertical line
//var VLine = 2;

//! A crosshair
//var Cross = 3;
//};


//! No Style. The symbol cannot be drawn.
var NoSymbol = -1;

//! Ellipse or circle
var Ellipse = 0;

//! Rectangle
var MRect = 2;

//!  Diamond
var Diamond = 3;

//! Triangle pointing upwards
var Triangle = 4;

//! Triangle pointing downwards
var DTriangle = 5;

//! Triangle pointing upwards
var UTriangle = 6;

//! Triangle pointing left
var LTriangle = 7;

//! Triangle pointing right
var RTriangle = 8;

//! Cross (+)
var Cross = 9;

//! Diagonal cross (X)
var XCross = 10;

//! Horizontal line
var HLine = 11;

//! Vertical line
var VLine = 12;

//! X combined with +
var Star1 = 13;

//! Six-pointed star
var Star2 = 14;

//! Hexagon
var Hexagon = 15;

/*!
The symbol is represented by a painter path, where the
origin ( 0, 0 ) of the path coordinate system is mapped to
the position of the symbol.

\sa setPath(), path()
 */
var Path = 16;

/*!
The symbol is represented by a pixmap. The pixmap is centered
or aligned to its pin point.

\sa setPinPoint()
 */
var Pixmap = 17;

/*!
The symbol is represented by a graphic. The graphic is centered
or aligned to its pin point.

\sa setPinPoint()
 */
var MGraphic = 18;

/*!
The symbol is represented by a SVG graphic. The graphic is centered
or aligned to its pin point.

\sa setPinPoint()
 */
var SvgDocument = 19;

/*!
Styles >= QwtSymbol::UserSymbol are reserved for derived
classes of QwtSymbol that overload drawSymbols() with
additional application specific symbol types.
 */
var UserStyle = 1000



Static.NoButton = -1;
Static.LeftButton = 0;
Static.MiddleButton = 1;
Static.MidButton = 1;
Static.RightButton = 2;

//Static.NoModifier = 0;

Static.Key_Escape = 27 //0x01000000;
Static.Key_Plus = 107 //0x02000000;
Static.Key_Minus = 109 //0x03000000;
Static.Key_Ctrl = 17
Static.Key_Shift = 16
Static.Key_Return = 13
Static.Key_Space = 32

Static.Key_Left = 37
Static.Key_Right = 39
Static.Key_Up = 38
Static.Key_Down = 40

Static.Key_Undo = 90
Static.Key_Redo = 89
Static.Key_Home = 36

Static.Key_I = 73
Static.Key_O = 79

Static.Key_unknown = -1



//Static.ControlModifier = 17
//Static.ShiftModifier = 16
//Static.AltModifier = 18

Static.NoModifier = 0x00000000  //No modifier key is pressed.
Static.ShiftModifier = 0x02000000  //A Shift key on the keyboard is pressed.
Static.ControlModifier = 0x04000000  //A Ctrl key on the keyboard is pressed.
Static.AltModifier = 0x08000000  //An Alt key on the keyboard is pressed.


Static.AlignRight = 1;
Static.AlignLeft = 2;
Static.AlignBottom = 4;
Static.AlignTop = 8;
Static.AlignCenter = 16;

var RGB = 0
var INDEXED = 1
var ScaledColors = 0
var FixedColors = 1

Static.adjustForDecimalPlaces = function(number, places) {
	if(places == undefined)
		places = 5;
	var multiplier = Math.pow(10, places);
	return Math.round(number * multiplier) / multiplier;
}

Static.mFuzzyCompare = function(a, b) {
	var diff = Math.abs(a - b);
	if (diff < _eps) {
		return true;
	}
	return false;
    //return (Math.abs(a - b) * 1000000000000. <= Math.min(Math.abs(a), Math.abs(b)));
}

Static.m3FuzzyCompare = function(value1, value2, intervalSize) {
	var eps = Math.abs(1.0e-6 * intervalSize);

	if (value2 - value1 > eps)
		return -1;

	if (value1 - value2 > eps)
		return 1;

	return 0;
}    



Static.bind = function(sig, data, cb){
	$(window).bind(sig, data, cb)
}

Static.trigger = function(sig, param) {
	$(window).trigger(sig, param)
}



Static.invert = function(rgb) {
	rgb = [].slice.call(arguments).join(",").replace(/rgb\(|\)|rgba\(|\)|\s/gi, '').split(',');
	for (var i = 0; i < rgb.length; i++)
		rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
	return "rgb(" + rgb.join(", ") + ")";
}

Static.RGB2HTML = function(red, green, blue)
{
    if(typeof(red)=="string"){
        var str = red
        //console.log(red)
        str = str.replace("rgb(", '')
        red = parseInt(str)
        str = str.replace(',', '')
        str = str.replace(red, '')
        green = parseInt(str)
        str = str.replace(',', '')
        str = str.replace(green, '')
        blue = parseInt(str)        
    }
	if(red.r !== undefined){
		var temp = red
		red = red.r
		green = temp.g
		blue = temp.b
	}
    var decColor =0x1000000+ blue + 0x100 * green + 0x10000 *red ;
    return '#'+decColor.toString(16).substr(1);
}

Static.HTMLToRGB = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

Static.mRgb = function(red, green, blue){
   return {r:red, g:green, b:blue}
}

Static.colorNameToHex = function(colour)
{
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

if(colour[0]=='r' && colour[1]=='g' && colour[2]=='b')
        return Static.RGB2HTML(colour);
    
if(colour[0]=='#')
        return colour;

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return "#000000";
}


Static.sqr = function(value){
   return Math.pow(value, 2)
}

Static.setElementIndex = function (element, index) {
            var Children = $(element).parent().children();
            var target = Children[index];

            if ($(element).index() > index) {
                if (target == null) {
                    target = Children[0];
                }
                if (target != element && target != null) {
                    $(target).before(element);
                }
            } else {
                if (target == null) {
                    target = Children[Children.length - 1];
                }
                if (target != element && target != null) {
                    $(target).after(element);
                }

            }
        }


Static.elementsFromPoint = function(x, y, elem) {
				var until = elem[0];

				var parents = [];
				var current;

				do {
					current = document.elementFromPoint(x, y);
					if (current !== until) {
						//console.log("current",current);
						parents.push(current);
						current.style.pointerEvents = 'none';
					} else {
						current = false;
					}
				} while (current);

				parents.forEach(function (parent) {
					return parent.style.pointerEvents = 'all';
				});
				return $(parents);
			}

Static.stopkeyPressPropagation = function(element){
    element.keydown(function (event) { 
        event.stopPropagation();        
    });
}


//var mediaQueryList = window.matchMedia('print');
window.matchMedia('print').addListener(function(mql) {
    if (mql.matches) {
        Static.trigger('beforePrint');        
    } else {
        Static.trigger('afterPrint');
    }
})

window.onbeforeprint = function(mql) {
    
    Static.trigger('beforePrint');    
}

window.onafterprint = function(mql) {    
        Static.trigger('afterPrint');    
}

Static.Cancel = 0
Static.No = 1
Static.Yes = 2


Static.alertDlg = function(){
var dlg =  $('<div class="modal fade" id="alert_Modal" role="dialog">\
    <div id="dlg" class="modal-dialog">\
      <!-- Modal content-->\
      <div class="modal-content">\
        <div class="modal-header">\
          <button type="button" class="close" data-dismiss="modal">&times;</button>\
          <h4 class="modal-title"><b>Alert</b></h4>\
        </div>\
        <div class="modal-body">\
          <p id="msg"></p>\
        </div>\
        <div id="alertDlgFooter1" class="modal-footer">\
          <button type="button" class="btn btn-default" data-dismiss="modal">Ok</button>\
        </div>\
        <div id="alertDlgFooter2" class="modal-footer">\
          <button id="yes" type="button" class="btn btn-default">Yes</button>\
          <button id="no" type="button" class="btn btn-default">No</button>\
          <button id="cancel" type="button" class="btn btn-default">Cancel</button>\
        </div>\
      </div>\
    </div>\
  </div>')

 //console.log(dlg)
 $("body").append(dlg);

 dlg.css('z-index', 1000000000)//ensure dialog is not covered

 this.alert = function(msg, type){
        $("#alertDlgFooter2").hide()
        $("#alertDlgFooter1").show()
                $("#msg").text(msg)
                if(type == "small"){
                    $("#dlg").addClass("modal-sm")
                }else{
                    $("#dlg").removeClass("modal-sm")
                }
                dlg.modal({backdrop: "static"});
                //dlg.modal();
            }

var self = this


this.alertYesNo = function(msg, cb, type){
        $(".close").hide()
        this.alertYesCb = cb
        $("#alertDlgFooter1").hide()
        $("#alertDlgFooter2").show()
                $("#msg").text(msg)
                if(type == "small"){
                    $("#dlg").addClass("modal-sm")
                }else{
                    $("#dlg").removeClass("modal-sm")
                }
                dlg.modal({backdrop: "static"});
                //dlg.modal();
            }

        $("#yes").click(function(){
            $(".close").click();
            self.alertYesCb(Static.Yes)
            
        })

        $("#no").click(function(){
            $(".close").click();
            self.alertYesCb(Static.No)
        })

        $("#cancel").click(function(){
            $(".close").click();
            self.alertYesCb(Static.Cancel)
        })

}

        


//e.g.  Static.alert("No curves found", "small")
Static.alert = function(msg, type){
    if(Static.alertObj == undefined){
        Static.alertObj = new Static.alertDlg()
    }
    Static.alertObj.alert(msg, type)

}

//e.g.
/*Static.alertYesNo("Do you want to save the changes to the Grapher?", function(answer){
	switch(answer){
		case Static.Cancel:
		  //do Cancel stuff
		  console.log('do Cancel stuff')
		  break;
		case Static.Yes:
		  //do Cancel stuff
		  console.log('do Yes stuff')
		  break;
		case Static.No:
		  //do Cancel stuff
		  console.log('do No stuff')
		  break;
		default:
		  // code block
	}	
}) */
Static.alertYesNo = function(msg, cb, type){
    if(Static.alertObj == undefined){
        Static.alertObj = new Static.alertDlg()
    }
    Static.alertObj.alertYesNo(msg, cb, type)   

}



//Static.alert("hello\nWorld")

Static.promptDlg = function(){
var prompt_dlg =  $('<div class="modal fade" id="promptModal" role="dialog">\
    <div id="prompt_dlg" class="modal-dialog">\
      <!-- Modal content-->\
      <div class="modal-content">\
        <div class="modal-header">\
          <button type="button" class="close" data-dismiss="modal"></button>\
          <h4 class="modal-title" id="prompt_title">Alert</h4>\
        </div>\
        <div class="modal-body">\
          <input id="prompt_msg" style="width:100%" autofocus />\
        </div>\
        <div class="modal-footer">\
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\
          <button id="prompt_ok" type="button" class="btn btn-default">Ok</button>\
        </div>\
      </div>\
    </div>\
  </div>')

 //console.log(dlg)
 $("body").append(prompt_dlg);

 var self = this


 this.prompt = function(title, defaultMsg, cb, type){
                if(type == "small"){
                    $("#prompt_dlg").addClass("modal-sm")
                }
                $("#prompt_title").text(title)
                $("#prompt_msg").val(defaultMsg)
                $("#prompt_msg").select()
                this.cb = cb
                prompt_dlg.modal({backdrop: "static"});
            }


    $("#prompt_ok").on('click', function(){
        if(self.cb($("#prompt_msg").val())){
            $(".close").click();
        }else{
            $("#prompt_msg").select()
        }
    })
}

Static.prompt = function(msg, defaultMsg, cb, type){
    if(Static.promptObj == undefined){
        Static.promptObj = new Static.promptDlg()
    }
    Static.promptObj.prompt(msg, defaultMsg, cb, type)
}

/*Static.prompt("Enter a new name for", "AAAA", function(str){
    console.log(str)
    //return false
    return true
})*/



Static.isMobile = function(){
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent||navigator.vendor||window.opera)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent||navigator.vendor||window.opera).substr(0,4)))
}

/* function adjustForLogKeyword(expStr){
	var result = expStr;
	if(expStr.includes("log2")){ //e.g. log2(x) should be log(x, 2)
		result.replace("log2", "log")
	}
	
} */

function insertLogBase(expStr, logStr){
	 var str = expStr;
	 //var resultStr = "";
	 if(expStr.includes(logStr)){
		 var base = logStr.replace("log", "");
		 //console.log(base)
		 while(str.indexOf(logStr)!== -1){
			 var i = str.indexOf(logStr)+logStr.length;
			 var leftPar = 0;
			 var rightPar = 0;
			 for(i; i<str.length; ++i){
				 if(str[i]=='(')
					 leftPar++;
				 if(str[i]==')')
					 rightPar++;
				 if(leftPar==rightPar){
					 str = str.insertAt(i, 0, ","+base)
					 str = str.replace(logStr, "log")
					 //console.log(str)
					 break;
				 }
			 }
		 }		 
	 }
	 return str;
 }
 
 function logBaseAdjust(expStr){
	 var logBaseStr = ["log2","log3","log4","log5","log6","log7","log8","log9","log10"];
	 
	 for(var i=0; i<logBaseStr.length; i++){
		 expStr = insertLogBase(expStr, logBaseStr[i])
	 }
	 return expStr;
 }
 

function EvaluateExp(expStr){
    var m_expStr = expStr;
    var f ;
    var simplified;
    this.error = false
	
	//m_expStr = logBaseAdjust(m_expStr)

    function init(){
        try {
            //f = math.parse(m_expStr);
			simplified = math.parse(m_expStr);
			if(!m_expStr.includes("log"))
				simplified = math.simplify(simplified);
        }
        catch(err) {
            Static.alert(err.message);
            this.error = true
        }
    }

    if(m_expStr !== undefined){
		m_expStr = logBaseAdjust(m_expStr);
        init()
    }

    this.setExpString = function(s){
        m_expStr = s
        init()
    }

    this.getExpString = function(){
        return m_expStr
    }

    this.eval = function(obj){
        this.error = false
        try {			
            return simplified.eval(obj)
        }       
        catch(err) {
            //console.log(55)
            //Static.alert(err.message);
            this.errorMessage = err.message
            this.error = true
            return 0;
        }
        
    }

}

var keywords = 
["asinh", "acosh", "atanh", "acoth", "asech", "acsch",
"asin", "acos", "atan", "acot", "asec", "acsc",
"sinh", "cosh", "tanh", "coth", "sech", "csch",
"sin", "cos", "tan", "sec", "csc", "cot", "log2", "log3",  "log4", "log5", "log6", "log7", "log8", "log9", "log10", "deg", 
 "pi", "PI", "e", "E"]//"deg" comes before "e", deliberately.

 function purgeKewords(str){
   for(var i=0; i<keywords.length; ++i){
      while (str.indexOf(keywords[i]) != -1)
        str = str.replace(keywords[i], "")
   }
   return str
} 

function findIndepVar(fx) {
	    //e = 2.718281828, thus 'e' is excluded from alphas
        var alphas = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var i = 0;
		
		var fnWithoutKeywords = purgeKewords(fx)
		
        /* while (i < fx.length) {
            var c = fx.charAt(i);
            //alert(c)
            var str = "";
            //if(alphas.indexOf(c) != -1){
            while (alphas.indexOf(c) != -1 && i < fx.length) {
                str += c;
                ++i;
                c = fx.charAt(i);
            }
            //alert(str)
            if (str.length === 1) {
                //alert(str)
                return str
            }
            ++i;

        } */
		
		while (i < fnWithoutKeywords.length) {
            var c = fnWithoutKeywords.charAt(i);
            //alert(c)
            var str = "";
            //if(alphas.indexOf(c) != -1){
            while (alphas.indexOf(c) != -1 && i < fnWithoutKeywords.length) {
                str += c;
                ++i;
                c = fnWithoutKeywords.charAt(i);
            }
            //alert(str)
            if (str.length === 1) {
                //alert(str)
                return str
            }
            ++i;

        }
        return undefined;
    }
	
	/* Static.alertYesNo("Do you want to save the changes to the Grapher?", function(answer){
	switch(answer){
		case Static.Cancel:
		  //do Cancel stuff
		  console.log('do Cancel stuff')
		  break;
		case Static.Yes:
		  //do Cancel stuff
		  console.log('do Yes stuff')
		  break;
		case Static.No:
		  //do Cancel stuff
		  console.log('do No stuff')
		  break;
		default:
		  // code block
	}	
}) */






define(['regression'], function(regression){
    Static.regression = regression
})




function regress(curve, type, order, throughOrigin){
    if(type=="linear" && throughOrigin){
        type = "linearthroughorigin"        
    }
    //if(!curve.fitType){
        //curve.fitType = type
    //}
    var samples = curve.data().samples()
    var points = []
    var point = [0, 0]
    for(var i=0; i<samples.length; ++i){
        points.push([samples[i].x, samples[i].y])
    }
    return Static.regression(type, points, order); 
}

//Called by LegendMenu and CurveSettings
/*var curveFitInfoCb = function(curve){
    var info = ""
    if(curve.fitType == "natural"){
        info += "Fit type:Natural Spline"
    }
    if(curve.fitType == "periodic"){
        info += "Fit type:Periodic Spline"
    }
    if(curve.fitType == "polynomial"){
        info += "Fit type:Polynomial"
        info += "; Equation:"+curve.equation
    }
    if(curve.fitType == "linear"){
        if(curve.origin){
            info += "Fit type:Linear Through Origin"
        }else{
            info += "Fit type:Linear"
        }
        info += "; Equation:"+curve.equation
    }   
    return info
}*/

///Prevent default right click menu
$('body').on("contextmenu", function(e){        
    e.preventDefault();        
});

/**
 * The expression parser of math.js has support for letting functions
 * parse and evaluate arguments themselves, instead of calling them with
 * evaluated arguments.
 *
 * By adding a property `raw` with value true to a function, the function
 * will be invoked with unevaluated arguments, allowing the function
 * to process the arguments in a customized way.
 */
//var math = require('../../index');

/**
 * Calculate the numeric integration of a function
 * @param {Function} f
 * @param {number} start
 * @param {number} end
 * @param {number} [step=0.01]
 */
 function integrate(f, start, end, volumeX, step) {
    Static.total_area = 0;
    Static.total_volume = 0;
    //step = step || 0.000002; //H
    //step = step || (end - start)/Static.accuracyMaxSteps
	//step = Math.max(step, Static.accuracyMinStepSize)
	//step = step || (end - start)/10000000
	//step = step || (end - start)/10
	//console.log(step)
    volumeX = volumeX || false
    for (var x = start; x < end; x += step) {
        var _x = x + step / 2
        if(_x > end)
            step = step -(_x-end)
        var y = f(x + step / 2)
        if(volumeX)
            Static.total_volume += y * step * y * Math.PI;
        else
            Static.total_area += y * step;
    }
    if(volumeX)
       // return Static.adjustForDecimalPlaces(Static.total_volume, Static.decimalPlaces);   
	//return Static.adjustForDecimalPlaces(Static.total_area, Static.decimalPlaces); 
    	return Static.total_volume;   
	return Static.total_area; 
}


/**
 * A transformation for the integrate function. This transformation will be
 * invoked when the function is used via the expression parser of math.js.
 *
 * Syntax:
 *
 *     integrate(integrand, variable, start, end)
 *     integrate(integrand, variable, start, end, step)
 *
 * Usage:
 *
 *     math.eval('integrate(2*x, x, 0, 2)')
 *     math.eval('integrate(2*x, x, 0, 2, 0.01)')
 *
 * @param {Array.<math.expression.node.Node>} args
 *            Expects the following arguments: [f, x, start, end, step]
 * @param {Object} math
 * @param {Object} [scope]
 */
integrate.transform = function (args, math, scope) {
  // determine the variable name
  if (args[1] instanceof math.expression.node.SymbolNode) {
    var variable = args[1].name;
  }
  else {
    throw new Error('Second argument must be a symbol');
  }

  // evaluate start, end, and step
  var start = args[2].compile().eval(scope);
  var end   = args[3].compile().eval(scope);
  var volumeX  = args[4] && args[4].compile().eval(scope); // volumeX is optional
  var step  = args[5] && args[5].compile().eval(scope); // step is optional

  // create a new scope, linked to the provided scope. We use this new scope
  // to apply the variable.
  var fnScope = Object.create(scope);

  // construct a function which evaluates the first parameter f after applying
  // a value for parameter x.
  var fnCode = args[0].compile();
  var f = function (x) {
    fnScope[variable] = x;
    return fnCode.eval(fnScope);
  };

  
  // execute the integration
  return integrate(f, start, end, volumeX, step);
};

// mark the transform function with a "rawArgs" property, so it will be called
// with uncompiled, unevaluated arguments.
integrate.transform.rawArgs = true;



// import the function into math.js. Raw functions must be imported in the
// math namespace, they can't be used via `eval(scope)`.
  math.import({
  integrate: integrate
});  

// use the function in JavaScript
// function f(x) {
//   return math.pow(x, 0.5);
// }
// console.log(math.integrate(f, 0, 1));                       // outputs 0.6667254718034714

// use the function via the expression parser
//console.log(math.eval('integrate(x^2, x, -10, 10)'));        // outputs 0.6667254718034714

// use the function via the expression parser (2)
// var scope = {};
// math.eval('f(x) = 2 * x', scope);
// console.log(math.eval('integrate(f(x), x, 0, 2)', scope));  // outputs 4.000000000000003

Static.isAlpha = function(ch){
  /*return typeof ch === "string" && ch.length === 1
         && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");*/
    ch = ch.toLowerCase().charCodeAt(0)
   return (ch>96 && ch<122)
}

Static.printFn = function() {
        //console.log($("#centralDiv")[0].children)
        window.print()                              
    }
	
Static.calcStep = function(curve){
	/* var plot = curve.plot();
	var scaleDiv = plot.axisScaleDiv(curve.xAxis());
	return scaleDiv.range()/Static.accuracyMaxSteps; */
	return (curve.maxXValue()-curve.minXValue())/Static.accuracyMaxSteps;  
}



Static.addCSS = function(path){ 
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    //link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = path;
    link.media = 'all';
    head.appendChild(link);
}



// Static.addCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css')
// Static.addCSS('css/layout.css')
// Static.addCSS('css/contextMenu.css') 
// Static.addCSS('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css') 


/*Static.insertProductSign = function(str){
    var result = "";
    result += str[0]
    for(var i=1; i<str.length; ++i){
        if(Static.isAlpha(str[i-1]) && Static.isAlpha(str[i])){
            result += '*';
        }
        result += str[i];        
    }
    return result;
}*/