"use strict";

var Cancel = 0;
var No = 1;
var Yes = 2;




class AlertDlg {
	constructor() {
		var dlg = $(
			'<div class="modal fade" id="alert_Modal" role="dialog">\
		<div id="dlg" class="modal-dialog">\
		<!-- Modal content-->\
		<div class="modal-content">\
		<div class="modal-header">\
		<!--button type="button" class="close" data-dismiss="modal">&times;</button-->\
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
		</div>'
		);

		//console.log(dlg)
		$("body").append(dlg);

		dlg.css("z-index", 1000000000); //ensure dialog is not covered

		this.alert = function (msg, type) {
			$("#alertDlgFooter2").hide();
			$("#alertDlgFooter1").show();
			$("#msg").text(msg);
			if (type == "small") {
				$("#dlg").addClass("modal-sm");
			} else {
				$("#dlg").removeClass("modal-sm");
			}
			dlg.modal({
				backdrop: "static",
			});
			//dlg.modal();
		};

		var self = this;

		this.alertYesNo = function (msg, cb, type) {
			//$(".close").hide()
			$("#alert_Modal").modal("hide");
			this.alertYesCb = cb;
			$("#alertDlgFooter1").hide();
			$("#alertDlgFooter2").show();
			$("#msg").text(msg);
			if (type == "small") {
				$("#dlg").addClass("modal-sm");
			} else {
				$("#dlg").removeClass("modal-sm");
			}
			/* dlg.modal({
					backdrop: "static"
				}); */
			//dlg.modal();
			$("#alert_Modal").modal("show");
		};

		$("#yes").click(function () {
			//$(".close").click();
			$("#alert_Modal").modal("hide");
			self.alertYesCb(Yes);
		});

		$("#no").click(function () {
			//$(".close").click();
			$("#alert_Modal").modal("hide");
			self.alertYesCb(No);
		});

		$("#cancel").click(function () {
			// $(".close").click();
			$("#alert_Modal").modal("hide");
			self.alertYesCb(Cancel);
		});
	}
}

class PromptDlg {
	constructor() {
		var prompt_dlg = $(
			'<div class="modal fade" id="promptModal" role="dialog">\
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
		</div>'
		);

		//console.log(dlg)
		$("body").append(prompt_dlg);

		var self = this;

		this.prompt = function (title, defaultMsg, cb, type) {
			if (type == "small") {
				$("#prompt_dlg").addClass("modal-sm");
			}
			$("#prompt_title").text(title);
			$("#prompt_msg").val(defaultMsg);
			$("#prompt_msg").select();
			this.cb = cb;
			prompt_dlg.modal({
				backdrop: "static",
			});
		};

		$("#prompt_ok").on("click", function () {
			if (self.cb($("#prompt_msg").val())) {
				$(".close").click();
			} else {
				$("#prompt_msg").select();
			}
		});
	}
}

/**
 * @classdesc A class of static utility methods. You can derive from this class and add your own utility methods. See the eample below.
 * @example	
 * class MyUtility extends Utility{
 * 	static myUtilityMethod(...){
 * 		...
 * 	}
 * }
 */
class Utility {
	/**
	 * Get the number of decimal places in the number.
	 * @param {number} value The number whose decimal places is to be determined.
	 * @returns {number} A positive integer representing the number of decimal places.
	 */
	static countDecimalPlaces(value) {
		let text = value.toString()
		// verify if number 0.000005 is represented as "5e-6"
		if (text.indexOf('e-') > -1) {
			let [base, trail] = text.split('e-');
			let deg = parseInt(trail, 10);
			return deg;
		}
		// count decimals for number in representation like "0.123456"
		if (Math.floor(value) !== value) {
			return value.toString().split(".")[1].length || 0;
		}
		return 0;
	}

	static BicubicInterpolation(values, x, y) {
		function TERP(t, a, b, c, d) {
			return 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * t) * t) * t + b;
		}
		var i0, i1, i2, i3;

		i0 = TERP(x, values[0][0], values[1][0], values[2][0], values[3][0]);
		i1 = TERP(x, values[0][1], values[1][1], values[2][1], values[3][1]);
		i2 = TERP(x, values[0][2], values[1][2], values[2][2], values[3][2]);
		i3 = TERP(x, values[0][3], values[1][3], values[2][3], values[3][3]);
		return TERP(y, i0, i1, i2, i3);
	}



	/**
	 * 
	 * @param {array} data 
	 * @param {*} x 
	 * @param {*} y 
	 * @returns {void}
	 */
	static bicubicInterpolate(data, x, y) {
		var numberOfColumns = data.length;
		var numberOfRows = data[0].length;
		var rightColumn;
		var bottomRow;

		var colSpacing = (data[data.length - 1][0].x - data[0][0].x) / (data.length - 1)

		var colIndex = Math.floor((x - data[0][0].x) / colSpacing)

		for (var i = colIndex; i < numberOfColumns; i++) {
			if (data[i][0].x > x) {
				rightColumn = i;//data[i][0].x;

				break
			}
		}
		if (rightColumn == undefined)
			rightColumn = numberOfColumns - 1;//data[numberOfColumns-1][0].x;

		var col0 = data[0];

		var rowSpacing = (col0[col0.length - 1].y - col0[0].y) / (col0.length - 1)

		var rowIndex = Math.floor((y - col0[0].y) / rowSpacing)
		for (var i = rowIndex; i < numberOfRows; i++) {
			if (col0[i].y > y) {
				bottomRow = i;//col0[i].y;

				break
			}
		}
		if (bottomRow == undefined)
			bottomRow = numberOfRows - 1;//col0[numberOfRows-1].y;

		if (x > data[rightColumn][0].x || x < data[0][0].x) {
			throw "x out of range";
		}

		if (y > data[0][bottomRow].y || y < data[0][0].y) {
			throw "y out of range";
		}


		var leftBoundary = rightColumn - 2;
		var topBoundary = bottomRow - 2;

		if (leftBoundary >= 0 && topBoundary >= 0 &&
			rightColumn + 1 < numberOfColumns && bottomRow + 1 < numberOfRows) {//inner case
			var p0 = [data[rightColumn - 2][bottomRow - 2].z,
			data[rightColumn - 2][bottomRow - 1].z,
			data[rightColumn - 2][bottomRow].z,
			data[rightColumn - 2][bottomRow + 1].z
			]

			var p1 = [data[rightColumn - 1][bottomRow - 2].z,
			data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow].z,
			data[rightColumn - 1][bottomRow + 1].z
			]

			var p2 = [data[rightColumn][bottomRow - 2].z,
			data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow].z,
			data[rightColumn][bottomRow + 1].z]

			var p3 = [data[rightColumn + 1][bottomRow - 2].z,
			data[rightColumn + 1][bottomRow - 1].z,
			data[rightColumn + 1][bottomRow].z,
			data[rightColumn + 1][bottomRow + 1].z]

			return Utility.BicubicInterpolation([p0, p1, p2, p3],
				(x - data[rightColumn - 1][0].x) / (data[rightColumn][0].x - data[rightColumn - 1][0].x),
				(y - col0[bottomRow - 1].y) / (col0[bottomRow].y - col0[bottomRow - 1].y)
			);
		}

		else if (leftBoundary < 0 && topBoundary >= 0 &&
			rightColumn + 1 < numberOfColumns && bottomRow + 1 < numberOfRows) {//left boundary case
			var p0 = [data[rightColumn - 1][bottomRow - 2].z,
			data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow].z,
			data[rightColumn - 1][bottomRow + 1].z]

			var p1 = [data[rightColumn - 1][bottomRow - 2].z,
			data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow].z,
			data[rightColumn - 1][bottomRow + 1].z]

			var p2 = [data[rightColumn][bottomRow - 2].z,
			data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow].z,
			data[rightColumn][bottomRow + 1].z]

			var p3 = [data[rightColumn + 1][bottomRow - 2].z,
			data[rightColumn + 1][bottomRow - 1].z,
			data[rightColumn + 1][bottomRow].z,
			data[rightColumn + 1][bottomRow + 1].z]

			return Utility.BicubicInterpolation([p0, p1, p2, p3],
				(x - data[rightColumn - 1][0].x) / (data[rightColumn][0].x - data[rightColumn - 1][0].x),
				(y - col0[bottomRow - 1].y) / (col0[bottomRow].y - col0[bottomRow - 1].y)
			);
		}

		else if (leftBoundary >= 0 && topBoundary < 0 &&
			rightColumn + 1 < numberOfColumns && bottomRow < numberOfRows) {//top boundary case
			var p0 = [data[rightColumn - 2][bottomRow - 1].z,
			data[rightColumn - 2][bottomRow - 1].z,
			data[rightColumn - 2][bottomRow].z,
			data[rightColumn - 2][bottomRow + 1].z]

			var p1 = [data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow].z,
			data[rightColumn - 1][bottomRow + 1].z]

			var p2 = [data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow].z,
			data[rightColumn][bottomRow + 1].z]

			var p3 = [data[rightColumn + 1][bottomRow - 1].z,
			data[rightColumn + 1][bottomRow - 1].z,
			data[rightColumn + 1][bottomRow].z,
			data[rightColumn + 1][bottomRow + 1].z]

			return Utility.BicubicInterpolation([p0, p1, p2, p3],
				(x - data[rightColumn - 1][0].x) / (data[rightColumn][0].x - data[rightColumn - 1][0].x),
				(y - col0[bottomRow - 1].y) / (col0[bottomRow].y - col0[bottomRow - 1].y)
			);
		}

		else if (leftBoundary >= 0 && topBoundary >= 0 &&
			rightColumn + 1 >= numberOfColumns && bottomRow + 1 < numberOfRows) {//right boundary case
			var p0 = [data[rightColumn - 2][bottomRow - 2].z,
			data[rightColumn - 2][bottomRow - 1].z,
			data[rightColumn - 2][bottomRow].z,
			data[rightColumn - 2][bottomRow + 1].z]

			var p1 = [data[rightColumn - 1][bottomRow - 2].z,
			data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow].z,
			data[rightColumn - 1][bottomRow + 1].z]

			var p2 = [data[rightColumn][bottomRow - 2].z,
			data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow].z,
			data[rightColumn][bottomRow + 1].z]

			var p3 = [data[rightColumn][bottomRow - 2].z,
			data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow].z,
			data[rightColumn][bottomRow + 1].z]

			return Utility.BicubicInterpolation([p0, p1, p2, p3],
				(x - data[rightColumn - 1][0].x) / (data[rightColumn][0].x - data[rightColumn - 1][0].x),
				(y - col0[bottomRow - 1].y) / (col0[bottomRow].y - col0[bottomRow - 1].y)
			);
		}

		else if (leftBoundary >= 0 && topBoundary >= 0 &&
			rightColumn + 1 < numberOfColumns && bottomRow + 1 >= numberOfRows) {//bottom boundary case
			var p0 = [data[rightColumn - 2][bottomRow - 2].z,
			data[rightColumn - 2][bottomRow - 1].z,
			data[rightColumn - 2][bottomRow].z,
			data[rightColumn - 2][bottomRow].z]

			var p1 = [data[rightColumn - 1][bottomRow - 2].z,
			data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow].z,
			data[rightColumn - 1][bottomRow].z]

			var p2 = [data[rightColumn][bottomRow - 2].z,
			data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow].z,
			data[rightColumn][bottomRow].z]

			var p3 = [data[rightColumn + 1][bottomRow - 2].z,
			data[rightColumn + 1][bottomRow - 1].z,
			data[rightColumn + 1][bottomRow].z,
			data[rightColumn + 1][bottomRow].z]

			return Utility.BicubicInterpolation([p0, p1, p2, p3],
				(x - data[rightColumn - 1][0].x) / (data[rightColumn][0].x - data[rightColumn - 1][0].x),
				(y - col0[bottomRow - 1].y) / (col0[bottomRow].y - col0[bottomRow - 1].y)
			);
		}

		else if (leftBoundary < 0 && topBoundary < 0 &&
			rightColumn + 1 < numberOfColumns && bottomRow < numberOfRows) {//left + top boundary case
			var p0 = [data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow].z,
			data[rightColumn - 1][bottomRow + 1].z]

			var p1 = [data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow].z,
			data[rightColumn - 1][bottomRow + 1].z]

			var p2 = [data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow].z,
			data[rightColumn][bottomRow + 1].z]

			var p3 = [data[rightColumn + 1][bottomRow - 1].z,
			data[rightColumn + 1][bottomRow - 1].z,
			data[rightColumn + 1][bottomRow].z,
			data[rightColumn + 1][bottomRow + 1].z]

			return Utility.BicubicInterpolation([p0, p1, p2, p3],
				(x - data[rightColumn - 1][0].x) / (data[rightColumn][0].x - data[rightColumn - 1][0].x),
				(y - col0[bottomRow - 1].y) / (col0[bottomRow].y - col0[bottomRow - 1].y)
			);
		}

		else if (leftBoundary >= 0 && topBoundary < 0 &&
			rightColumn + 1 >= numberOfColumns && bottomRow < numberOfRows) {//right + top boundary case
			var p0 = [data[rightColumn - 2][bottomRow - 1].z,
			data[rightColumn - 2][bottomRow - 1].z,
			data[rightColumn - 2][bottomRow].z,
			data[rightColumn - 2][bottomRow + 1].z]

			var p1 = [data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow].z,
			data[rightColumn - 1][bottomRow + 1].z]

			var p2 = [data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow].z,
			data[rightColumn][bottomRow + 1].z]

			var p3 = [data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow].z,
			data[rightColumn][bottomRow + 1].z]

			return Utility.BicubicInterpolation([p0, p1, p2, p3],
				(x - data[rightColumn - 1][0].x) / (data[rightColumn][0].x - data[rightColumn - 1][0].x),
				(y - col0[bottomRow - 1].y) / (col0[bottomRow].y - col0[bottomRow - 1].y)
			);
		}

		else if (leftBoundary < 0 && topBoundary >= 0 &&
			rightColumn + 1 < numberOfColumns && bottomRow + 1 >= numberOfRows) {//left + bottom boundary case
			var p0 = [data[rightColumn - 1][bottomRow - 2].z,
			data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow].z,
			data[rightColumn - 1][bottomRow].z]

			var p1 = [data[rightColumn - 1][bottomRow - 2].z,
			data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow].z,
			data[rightColumn - 1][bottomRow].z]

			var p2 = [data[rightColumn][bottomRow - 2].z,
			data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow].z,
			data[rightColumn][bottomRow].z]

			var p3 = [data[rightColumn + 1][bottomRow - 2].z,
			data[rightColumn + 1][bottomRow - 1].z,
			data[rightColumn + 1][bottomRow].z,
			data[rightColumn + 1][bottomRow].z]

			return Utility.BicubicInterpolation([p0, p1, p2, p3],
				(x - data[rightColumn - 1][0].x) / (data[rightColumn][0].x - data[rightColumn - 1][0].x),
				(y - col0[bottomRow - 1].y) / (col0[bottomRow].y - col0[bottomRow - 1].y)
			);
		}

		else if (leftBoundary >= 0 && topBoundary >= 0 &&
			rightColumn + 1 >= numberOfColumns && bottomRow + 1 >= numberOfRows) {//right + bottom boundary case
			var p0 = [data[rightColumn - 2][bottomRow - 2].z,
			data[rightColumn - 2][bottomRow - 1].z,
			data[rightColumn - 2][bottomRow].z,
			data[rightColumn - 2][bottomRow].z]

			var p1 = [data[rightColumn - 1][bottomRow - 2].z,
			data[rightColumn - 1][bottomRow - 1].z,
			data[rightColumn - 1][bottomRow].z,
			data[rightColumn - 1][bottomRow].z]

			var p2 = [data[rightColumn][bottomRow - 2].z,
			data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow].z,
			data[rightColumn][bottomRow].z]

			var p3 = [data[rightColumn][bottomRow - 2].z,
			data[rightColumn][bottomRow - 1].z,
			data[rightColumn][bottomRow].z,
			data[rightColumn][bottomRow].z
			]

			return Utility.BicubicInterpolation([p0, p1, p2, p3],
				(x - data[rightColumn - 1][0].x) / (data[rightColumn][0].x - data[rightColumn - 1][0].x),
				(y - col0[bottomRow - 1].y) / (col0[bottomRow].y - col0[bottomRow - 1].y)
			);
		}
		return undefined;
	}

	static BilinearInterpolation(q11, q12, q21, q22, x1, x2, y1, y2, x, y) {
		/*  var x2x1, y2y1, x2x, y2y, yy1, xx1;
		x2x1 = x2 - x1;
		y2y1 = y2 - y1;
		x2x = x2 - x;
		y2y = y2 - y;
		yy1 = y - y1;
		xx1 = x - x1; 
		  return 1.0 / (x2x1 * y2y1) * (
			q11 * x2x * y2y +
			q21 * xx1 * y2y +
			q12 * x2x * yy1 +
			q22 * xx1 * yy1
		);  */

		return 1.0 / ((x2 - x1) * (y2 - y1)) * (
			q11 * (x2 - x) * (y2 - y) +
			q21 * (x - x1) * (y2 - y) +
			q12 * (x2 - x) * (y - y1) +
			q22 * (x - x1) * (y - y1)
		);
	}

	/**
	 * 
	 * @param {*} data 
	 * @param {*} x 
	 * @param {*} y 
	 * @returns {void}
	 */
	static bilinearInterpolate(data, x, y) {
		var numberOfColumns = data.length;
		var numberOfRows = data[0].length;
		var rightColumn;
		var bottomRow;

		var colSpacing = (data[data.length - 1][0].x - data[0][0].x) / (data.length - 1)

		var colIndex = Math.floor((x - data[0][0].x) / colSpacing)
		//console.log(colIndex)

		for (var i = colIndex; i < numberOfColumns; i++) {
			if (data[i][0].x > x) {
				rightColumn = i;//data[i][0].x;

				break
			}
		}
		if (rightColumn == undefined)
			rightColumn = numberOfColumns - 1

		var col0 = data[0];

		var rowSpacing = (col0[col0.length - 1].y - col0[0].y) / (col0.length - 1)

		var rowIndex = Math.floor((y - col0[0].y) / rowSpacing)

		for (var i = rowIndex; i < numberOfRows; i++) {
			if (col0[i].y > y) {
				bottomRow = i;//col0[i].y;

				break
			}
		}
		if (bottomRow == undefined)
			bottomRow = numberOfRows - 1;

		if (x > data[rightColumn][0].x || x < data[0][0].x) {
			throw "x out of range";
		}

		if (y > data[0][bottomRow].y || y < data[0][0].y) {
			throw "y out of range";
		}


		var leftBoundary = rightColumn - 1;
		var topBoundary = bottomRow - 1;

		var x1, y1, x2, y2, q11, q12, q21, q22

		x1 = data[leftBoundary][0].x
		x2 = data[rightColumn][0].x
		y1 = data[0][bottomRow].y
		y2 = data[0][topBoundary].y

		q11 = data[leftBoundary][bottomRow].z
		q12 = data[leftBoundary][topBoundary].z
		q21 = data[rightColumn][bottomRow].z
		q22 = data[rightColumn][topBoundary].z

		return Utility.BilinearInterpolation(q11, q12, q21, q22, x1, x2, y1, y2, x, y)

	}

	/**
	 * 
	 * @param {*} plot 
	 * @param {*} prefix 
	 * @returns {string} unique curve name
	 */
	static generateCurveName(plot, prefix) {
		let postFix = 1;
		let preFix = prefix || "curve_";
		let curveName = preFix.concat(postFix);
		while (plot.findPlotCurve(curveName))
			curveName = preFix.concat(++postFix);
		return curveName;
	}

	static modifiers(event) {
		var _modifiers = Static.NoModifier
		if (event.altKey && event.ctrlKey && event.shiftKey)
			return _modifiers | Static.AltModifier |
				Static.ControlModifier | Static.ShiftModifier
		if (event.altKey && event.ctrlKey)
			return _modifiers | Static.AltModifier |
				Static.ControlModifier
		if (event.altKey && event.shiftKey)
			return _modifiers | Static.AltModifier | Static.ShiftModifier
		if (event.ctrlKey && event.shiftKey)
			return _modifiers | Static.ControlModifier | Static.ShiftModifier
		if (event.altKey)
			return _modifiers | Static.AltModifier
		if (event.ctrlKey)
			return _modifiers | Static.ControlModifier
		if (event.shiftKey)
			return _modifiers | Static.ShiftModifier
		return _modifiers
	}

	static button(event) {
		if (event == null)
			return false;
		return event.button
	}

	static colorList() {
		return ["black", "red", "green", "blue", "yellow", "brown"]
	}

	static makePoints(arrayOfTwoMemberArrays) {
		//console.log(arr)
		var res = [];
		arrayOfTwoMemberArrays.forEach(function (arrayOfTwoMembers) {
			res.push(new Misc.Point(parseFloat(arrayOfTwoMembers[0]),
				parseFloat(arrayOfTwoMembers[1])))
		})
		return res;
	}

	static makeSpectrocurvePoints(arrayOfThreeMemberArrays) {
		//console.log(arr)
		var res = [];
		var minZ = Number.MAX_VALUE;
		var maxZ = Number.MIN_VALUE;
		arrayOfThreeMemberArrays.forEach(function (arrayOfThreeMembers) {
			var zVal = parseFloat(arrayOfThreeMembers[2]);
			if (zVal < minZ)
				minZ = arrayOfThreeMembers[2];
			if (zVal > maxZ)
				maxZ = arrayOfThreeMembers[2];
			res.push({
				x: parseFloat(arrayOfThreeMembers[0]),
				y: parseFloat(arrayOfThreeMembers[1]),
				z: zVal
			})
		})
		return { points: res, zMin: minZ, zMax: maxZ };
	}

	static pointsToXYObjectArray(points) {
		//console.log(arr)
		var res = [];
		points.forEach(function (pt) {
			res.push({
				x: pt.x,
				y: pt.y
			});
		})
		return res;
	}

	static pointsFromXYObjectArray(XYpoints) {
		//console.log(arr)
		var res = [];
		XYpoints.forEach(function (pt) {
			res.push(new Misc.Point(pt.x, pt.y));
		})
		return res;
	}

	static linearEquationFromPoints(p1, p2) {
		var m = (p2.y - p1.y) / (p2.x - p1.x)
		var c = -m * p1.x + p1.y;
		var fn = m.toString();
		fn += "x+";
		fn += c.toString();
		return fn;
	}

	static toArrays(csvContent) {
		var _minZ = Number.MAX_VALUE;
		var _maxZ = Number.MIN_VALUE;
		var type = null;
		var arr = csvContent.split('\n')
		var keyword = arr[0].toLowerCase();
		if (keyword.includes("curve")) {
			type = "curve";
		} else if (keyword.includes("spectrocurve")) {
			type = "spectrocurve";
		} else if (keyword.includes("spectrogram")) {
			type = "spectrogram";
		}
		var result = [];
		for (var i = 0; i < arr.length; ++i) {
			var pt = arr[i].split(',');
			if (isNaN(parseFloat(pt))) {
				continue;
			}
			pt = pt.map(function (item) {
				return parseFloat(item);
			});
			if (pt.length == 3) { //3d data
				result.push({ x: pt[0], y: pt[1], z: pt[2] });
				if (result[result.length - 1].z < _minZ)
					_minZ = result[result.length - 1].z;
				if (result[result.length - 1].z > _maxZ)
					_maxZ = result[result.length - 1].z;
			} else {
				result.push(pt);
			}
		}
		return { array: result, dataType: type, minZ: _minZ, maxZ: _maxZ };
	}

	static setAutoScale(plot, auto) {
		plot.setAxisAutoScale(Axis.AxisId.xBottom, auto);
		plot.setAxisAutoScale(Axis.AxisId.yLeft, auto);
		plot.setAxisAutoScale(Axis.AxisId.xTop, auto);
		plot.setAxisAutoScale(Axis.AxisId.yRight, auto);
		Static.trigger("rescaled", auto);
	}

	static majorGridLines(grid, on) {
		grid.enableX(on);
		grid.enableY(on);
		Static.trigger("majorGridLines", [grid, on]);
	}

	static minorGridLines(grid, on) {
		grid.enableXMin(on);
		grid.enableYMin(on);
		Static.trigger("minorGridLines", [grid, on]);
	}

	static randomColor(brightness = 0) {
		// Six levels of brightness from 0 to 5, 0 being the darkest
		var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
		var mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
		var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) {
			return Math.round(x / 2.0)
		})
		return "rgb(" + mixedrgb.join(",") + ")";
	}

	static setCurveBrush(curve, successCb) {
		var colorSelector = $('<input type="color" style="opacity:0;">');
		if (!curve || curve.rtti !== PlotItem.RttiValues.Rtti_PlotCurve)
			return;
		if (curve.brush().color == Static.NoBrush)
			colorSelector.val(Utility.colorNameToHex("rgb(255, 255, 254)"));
		else
			colorSelector.val(Utility.colorNameToHex(curve.brush().color));
		colorSelector.change(function () {
			var brush = curve.brush();
			brush.color = $(this).val();
			curve.setBrush(brush);
			if (successCb !== undefined) {
				successCb(curve);
			}
		})
		colorSelector.trigger('click');
	}

	static removeCurveBrush(curve) {
		var brush = curve.brush()
		brush.color = Static.NoBrush;
		curve.setBrush(brush);
	}

	static setSymbolPenWidth(curve, width) {
		var sym = curve.symbol()
		if (!sym) {
			return
		}
		var pen = sym.pen()
		pen.width = width
		//sym.setPen(pen)
		//curve.setSymbol(sym) //reset the symbol so that the legend size is recalculated
		curve.plot().autoRefresh()

		Utility.updateLegendIconSize(curve) //recalculate legend icon size
		curve.plot().updateLegend(curve)
		//curve.itemChanged();
		//curve.legendChanged();
		Static.trigger("symbolAttributeChanged", curve);
	}

	static updateLegendIconSize(curve) {
		var sz = curve.getLegendIconSize();
		if (curve.symbol()) {
			sz = curve.symbol().boundingRect().size();
			//sz.width += 2; // margin
			//sz.height += 3; // margin
		}

		if (curve.symbol() && curve.testLegendAttribute(Curve.LegendAttribute.LegendShowSymbol)) {

			if (curve.testLegendAttribute(Curve.LegendAttribute.LegendShowLine)) {
				// Avoid, that the line is completely covered by the symbol

				var w = Math.ceil(1.5 * sz.width);

				if (w % 2)
					w++;

				sz.width = Math.max(40, w);
			}
			curve.setLegendIconSize(sz);
		} else if (curve.testLegendAttribute(Curve.LegendAttribute.LegendShowLine)) {
			sz.width = 40;
			curve.setLegendIconSize(sz);
		}

	}

	static setSymbolSize(curve, value) {
		//console.log(value)
		var sym = curve.symbol();
		if (!sym)
			return;
		var sz = sym.size();
		sz.width = value;
		sz.height = value;
		sym.setSize(sz);
		curve.plot().autoRefresh();
		Utility.updateLegendIconSize(curve); //recalculate legend icon size
		//curve.itemChanged();
		//curve.legendChanged();
		curve.plot().updateLegend(curve);
		Static.trigger("symbolAttributeChanged", curve);
	}

	static addSymbol(curve, style) {
		if (!curve || curve.rtti !== PlotItem.RttiValues.Rtti_PlotCurve)
			return;
		if (style == Symbol.Style.NoSymbol) {
			curve.setSymbol(null);
			//return;
		}
		var sym = curve.symbol();
		if (sym == null) {
			sym = new Symbol();
			sym.setBrush(new Misc.Brush(Static.NoBrush));
			sym.setSize(new Misc.Size(10, 10));
			curve.setSymbol(sym);
		}
		//console.log(sym.size())
		if (sym.size().width <= 0)
			sym.setSize(new Misc.Size(10, 10));
		sym.setStyle(style);
		curve.itemChanged();
		curve.legendChanged();
		Static.trigger("symbolAdded", curve);
	}

	static curveRenameDlg(existingName, plot, successCb) {
		Utility.prompt("Enter a new name for \"" + existingName + "\"",
			existingName, function (newName) {

				if (existingName == newName) { //User decided not change the name
					Utility.alert("You did not change the name!");
					return false;
				}
				var curve = plot.findPlotCurve(existingName);
				if (!plot.findPlotCurve(newName)) { //A curve with title "name" (i.e the new name chosen by user is not known to the app)
					curve.setTitle(newName);
					if (successCb !== undefined)
						successCb(newName, curve);
					Static.trigger("curveRenamed", curve);
					return true;
				} else {
					Utility.alert(newName + " already exist");
					return false;
				}
			}, "small");
	}

	static setLegendAttribute(curve, attribute, defaultIconSize) { //attribute = "line" or "symbol" or "lineAndSymbol"
		if (attribute == "line") {
			//LegendShowLine is dependent on defaultIconSize. Be sure icon size is set to defaultIconSize
			//before setting LegendShowLine.
			curve.setLegendIconSize(new Misc.Size(defaultIconSize));
			curve.setLegendAttribute(Curve.LegendAttribute.LegendShowSymbol, false);
			curve.setLegendAttribute(Curve.LegendAttribute.LegendShowLine, true);
			return;

		}
		if (attribute == "symbol") {
			//LegendShowSymbol is dependent on defaultIconSize. Be sure icon size is set to defaultIconSize
			//before setting LegendShowSymbol.
			curve.setLegendIconSize(new Misc.Size(defaultIconSize))
			curve.setLegendAttribute(Curve.LegendAttribute.LegendShowLine, false)
			curve.setLegendAttribute(Curve.LegendAttribute.LegendShowSymbol, true);
			return;

		}
		if (attribute == "lineAndSymbol") {
			//LegendShowSymbol is dependent on defaultIconSize. Be sure icon size is set to defaultIconSize
			//before setting LegendShowSymbol.
			curve.setLegendIconSize(new Misc.Size(defaultIconSize))
			curve.setLegendAttribute(Curve.LegendAttribute.LegendShowLine, true)
			curve.setLegendAttribute(Curve.LegendAttribute.LegendShowSymbol, true);
			return;

		}
		//defaultIconSize.width = defaultIconSize.height;//ensure the icon is square
		//curve.setLegendIconSize(new Misc.Size(defaultIconSize))
		curve.setLegendAttribute(Curve.LegendAttribute.LegendShowLine, false)
		curve.setLegendAttribute(Curve.LegendAttribute.LegendShowSymbol, false)
		//iconSize is dependent on attributes. be sure to clear any attributes
		//before setting iconSize.


	}

	/*var Backbone = 0x01;
	//! Ticks
	var Ticks = 0x02;
	//! Labels
	var Labels = 0x04;*/
	static enableComponent(plot, component, on) {
		var scaleDraw = null;
		for (var axisId = 0; axisId < Axis.AxisId.axisCnt; ++axisId) {
			scaleDraw = plot.axisScaleDraw(axisId)
			scaleDraw.enableComponent(component, on)
		}
		plot.autoRefresh()
	}

	static setTickLength(plot, length) { //length = "small", "medium" or "large"
		var scaleDraw = null;
		for (var axisId = 0; axisId < Axis.AxisId.axisCnt; ++axisId) {
			scaleDraw = plot.axisScaleDraw(axisId);
			if (length == "small") {
				scaleDraw.setTickLength(ScaleDiv.TickType.MajorTick, 6);
				scaleDraw.setTickLength(ScaleDiv.TickType.MinorTick, 3);
			} else if (length == "medium") {
				scaleDraw.setTickLength(ScaleDiv.TickType.MajorTick, 8);
				scaleDraw.setTickLength(ScaleDiv.TickType.MinorTick, 4);
			} else if (length == "large") {
				scaleDraw.setTickLength(ScaleDiv.TickType.MajorTick, 12);
				scaleDraw.setTickLength(ScaleDiv.TickType.MinorTick, 6);
			}
		}
		plot.autoRefresh();
	}

	static mVerifyRange(size, i1, i2) {
		if (size < 1)
			return 0;

		i1 = Math.max(0, Math.min(i1, size - 1));
		i2 = Math.max(0, Math.min(i2, size - 1));

		if (i1 > i2) {
			//qSwap( i1, i2 );
			var temp = i1;
			i1 = i2;
			i2 = temp;
		}

		return (i2 - i1 + 1);
	}


	static makeSamples(obj) {

		var fx = obj.fx
		var lowerX = obj.lowerX
		var upperX = obj.upperX
		var lowerY;
		var upperY;
		var numOfSamples = obj.numOfSamples
		var indepVarIsDegree = obj.indepVarIsDegree
		var indepVar = obj.variable || Utility.findIndepVar(fx);
		var indepVarY = obj.variableY;// || findIndepVarY(fx); TODO

		if (typeof numOfSamples === 'undefined')
			numOfSamples = _numOfSamples;
		if (indepVar !== "x") {
			while (fx.indexOf(indepVar) != -1)
				fx = fx.replace(indepVar, "x")
		}

		if (obj.threeD && indepVarY !== "y") {
			while (fx.indexOf(indepVarY) != -1)
				fx = fx.replace(indepVarY, "y")

			lowerY = obj.lowerY
			var upperY = obj.upperY
		}

		if (obj.threeD) {
			lowerY = obj.lowerY
			upperY = obj.upperY
		}

		var samples = [];
		//samples.push(Misc.Point(-10, -10))
		var parser = new EvaluateExp(fx)

		if (parser.error) {
			Utility.alert(parser.errorMessage);
			return null
		}

		/* const node = math.parse(fx); // parse expression into a node tree
		const code = node.compile();  */

		var step = (upperX - lowerX) / (numOfSamples - 1);
		var stepY;
		if (obj.threeD) {
			stepY = (upperY - lowerY) / (numOfSamples - 1);
		}

		var yVal;
		var zVal;
		var zMin = Number.MAX_VALUE;
		var zMax = Number.MIN_VALUE;
		for (var i = 0; i <= numOfSamples - 1; ++i) {

			var xVal = lowerX + i * step;

			if (obj.threeD) {
				yVal = lowerY + i * stepY;
				zVal = parser.eval({ x: xVal, y: yVal })
				if (zVal < zMin)
					zMin = zVal;
				if (zVal > zMax)
					zMax = zVal;
			} else {
				yVal = parser.eval({ x: xVal })
			}
			//var yVal = code.eval({x: xVal});

			if (!isFinite(yVal)) {
				if (Utility.errorResponse == Utility.warn) {
					Utility.alert("f(" + xVal + "): yields infinity. Probably a \"divide by zero\" error. Try changing the limits or adjusting number of points.");
					return null;
				}
				else if (Utility.errorResponse == Utility.warnIgnore) {
					Utility.alertYesNo("Error found!!! Do you want to silently ignore errors?", function (answer) {
						if (answer == Cancel) {
							console.log("C")
							return null;
						}
						if (answer == Yes) {
							console.log("Y")

							Utility.errorResponse = Utility.silentIgnore;
							Utility.errorResponseChanged = true;
							//obj.ok_fn(obj);

							return null;
						}
						if (answer == No) {
							console.log("N")
							return null;
						}
						//return 1
					})
					samples = [];
					break
				}
				else {
					continue;
				}
			}
			if (obj.threeD && !isFinite(zVal)) {
				if (Utility.errorResponse == Utility.warn) {
					Utility.alert("f(" + xVal + "," + yVal + "): yields infinity. Probably a \"divide by zero\" error. Try changing the limits or adjusting number of points.");
					return null;
				}
				else if (Utility.errorResponse == Utility.warnIgnore) {
					Utility.alertYesNo("Error found!!! Do you want to silently ignore errors?", function (answer) {
						if (answer == Cancel) {
							console.log("C")
							return null;
						}
						if (answer == Yes) {
							console.log("Y")

							Utility.errorResponse = Utility.silentIgnore;
							Utility.errorResponseChanged = true;
							//obj.ok_fn(obj);

							return null;
						}
						if (answer == No) {
							console.log("N")
							return null;
						}
						//return 1
					})
					samples = [];
					break
				}
				else {
					continue;
				}
			}
			if (parser.error) {
				Utility.alert(parser.errorMessage);
				return null
			}
			if (obj.threeD) {
				samples.push({ x: xVal, y: yVal, z: zVal })

			} else {
				samples.push(new Misc.Point(xVal, yVal))
			}

		}
		if (Utility.errorResponseChanged) {
			Utility.errorResponseChanged = false;
			Utility.errorResponse = Utility.warnIgnore;
		}
		//console.log(samples)
		if (obj.threeD) {
			return { data: samples, zLimits: { min: zMin, max: zMax } };
		}
		return samples;
	}

	static makeAbstract(obj, constructor) {
		if (obj.constructor == constructor) {
			throw new Error("Abstract classes can't be instantiated.");
		}
	}

	static qBound(min, val, max) {
		return Math.max(min, Math.min(val, max));
	}

	/**
	 * Adjust the precision of a number.
	 * 
	 * In most cases, round-off errors don’t matter: they have no significant impact on the results. However, 
	 * it looks ugly when displaying output to a user. A solution is to limit the precision just below 
	 * the actual precision of 16 digits in the displayed output:
	 * @param {number} value number to be adjusted.
	 * @param {number} numberOfDigits required precision.
	 * @returns {number} adjusted number.
	 */
	static toPrecision(value, numberOfDigits) {
		if (numberOfDigits < 1) {
			numberOfDigits = 1;
		} else if (numberOfDigits > 16) {
			numberOfDigits = 16;
		}
		//return math.format(value, {precision: numberOfDigits});
		return value.toPrecision(numberOfDigits);
	}

	/**
	 * Adjust the decimal places of a number.
	 * @param {number} number number to be adjusted.
	 * @param {number} places number of decimal places.
	 * @returns {number} adjusted number.
	 */
	static adjustForDecimalPlaces(number, places) {
		if (places == undefined) places = 5;

		// if (places > 300) places = 300;
		var multiplier = Math.pow(10, places);
		return Math.round(number * multiplier) / multiplier;
	}

	static mFuzzyCompare(a, b) {
		var diff = Math.abs(a - b);
		if (diff < Static._eps) {
			return true;
		}
		return false;
		//return (Math.abs(a - b) * 1000000000000. <= Math.min(Math.abs(a), Math.abs(b)));
	}

	static m3FuzzyCompare(value1, value2, intervalSize) {
		var eps = Math.abs(Static._eps * intervalSize);

		if (value2 - value1 > eps) return -1;

		if (value1 - value2 > eps) return 1;

		return 0;
	}

	static invert(rgb) {
		rgb = [].slice
			.call(arguments)
			.join(",")
			.replace(/rgb\(|\)|rgba\(|\)|\s/gi, "")
			.split(",");
		for (var i = 0; i < rgb.length; i++) rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
		return "rgb(" + rgb.join(", ") + ")";
	}

	static RGB2HTML(red, green, blue) {
		if (typeof red == "string") {
			var str = red;
			//console.log(red)
			str = str.replace("rgb(", "");
			red = parseInt(str);
			str = str.replace(",", "");
			str = str.replace(red, "");
			green = parseInt(str);
			str = str.replace(",", "");
			str = str.replace(green, "");
			blue = parseInt(str);
		}
		if (red.r !== undefined) {
			var temp = red;
			red = red.r;
			green = temp.g;
			blue = temp.b;
		}
		var decColor = 0x1000000 + blue + 0x100 * green + 0x10000 * red;
		return "#" + decColor.toString(16).substr(1);
	}

	static colorNameToHex(colour) {
		var colours = {
			aliceblue: "#f0f8ff",
			antiquewhite: "#faebd7",
			aqua: "#00ffff",
			aquamarine: "#7fffd4",
			azure: "#f0ffff",
			beige: "#f5f5dc",
			bisque: "#ffe4c4",
			black: "#000000",
			blanchedalmond: "#ffebcd",
			blue: "#0000ff",
			blueviolet: "#8a2be2",
			brown: "#a52a2a",
			burlywood: "#deb887",
			cadetblue: "#5f9ea0",
			chartreuse: "#7fff00",
			chocolate: "#d2691e",
			coral: "#ff7f50",
			cornflowerblue: "#6495ed",
			cornsilk: "#fff8dc",
			crimson: "#dc143c",
			cyan: "#00ffff",
			darkblue: "#00008b",
			darkcyan: "#008b8b",
			darkgoldenrod: "#b8860b",
			darkgray: "#a9a9a9",
			darkgrey: "#a9a9a9",
			darkgreen: "#006400",
			darkkhaki: "#bdb76b",
			darkmagenta: "#8b008b",
			darkolivegreen: "#556b2f",
			darkorange: "#ff8c00",
			darkorchid: "#9932cc",
			darkred: "#8b0000",
			darksalmon: "#e9967a",
			darkseagreen: "#8fbc8f",
			darkslateblue: "#483d8b",
			darkslategray: "#2f4f4f",
			darkturquoise: "#00ced1",
			darkviolet: "#9400d3",
			deeppink: "#ff1493",
			deepskyblue: "#00bfff",
			dimgray: "#696969",
			dodgerblue: "#1e90ff",
			firebrick: "#b22222",
			floralwhite: "#fffaf0",
			forestgreen: "#228b22",
			fuchsia: "#ff00ff",
			gainsboro: "#dcdcdc",
			ghostwhite: "#f8f8ff",
			gold: "#ffd700",
			goldenrod: "#daa520",
			gray: "#808080",
			grey: "#808080",
			green: "#008000",
			greenyellow: "#adff2f",
			honeydew: "#f0fff0",
			hotpink: "#ff69b4",
			"indianred ": "#cd5c5c",
			indigo: "#4b0082",
			ivory: "#fffff0",
			khaki: "#f0e68c",
			lavender: "#e6e6fa",
			lavenderblush: "#fff0f5",
			lawngreen: "#7cfc00",
			lemonchiffon: "#fffacd",
			lightblue: "#add8e6",
			lightcoral: "#f08080",
			lightcyan: "#e0ffff",
			lightgoldenrodyellow: "#fafad2",
			lightgrey: "#d3d3d3",
			lightgray: "#d3d3d3",
			lightgreen: "#90ee90",
			lightpink: "#ffb6c1",
			lightsalmon: "#ffa07a",
			lightseagreen: "#20b2aa",
			lightskyblue: "#87cefa",
			lightslategray: "#778899",
			lightsteelblue: "#b0c4de",
			lightyellow: "#ffffe0",
			lime: "#00ff00",
			limegreen: "#32cd32",
			linen: "#faf0e6",
			magenta: "#ff00ff",
			maroon: "#800000",
			mediumaquamarine: "#66cdaa",
			mediumblue: "#0000cd",
			mediumorchid: "#ba55d3",
			mediumpurple: "#9370d8",
			mediumseagreen: "#3cb371",
			mediumslateblue: "#7b68ee",
			mediumspringgreen: "#00fa9a",
			mediumturquoise: "#48d1cc",
			mediumvioletred: "#c71585",
			midnightblue: "#191970",
			mintcream: "#f5fffa",
			mistyrose: "#ffe4e1",
			moccasin: "#ffe4b5",
			navajowhite: "#ffdead",
			navy: "#000080",
			oldlace: "#fdf5e6",
			olive: "#808000",
			olivedrab: "#6b8e23",
			orange: "#ffa500",
			orangered: "#ff4500",
			orchid: "#da70d6",
			palegoldenrod: "#eee8aa",
			palegreen: "#98fb98",
			paleturquoise: "#afeeee",
			palevioletred: "#d87093",
			papayawhip: "#ffefd5",
			peachpuff: "#ffdab9",
			peru: "#cd853f",
			pink: "#ffc0cb",
			plum: "#dda0dd",
			powderblue: "#b0e0e6",
			purple: "#800080",
			rebeccapurple: "#663399",
			red: "#ff0000",
			rosybrown: "#bc8f8f",
			royalblue: "#4169e1",
			saddlebrown: "#8b4513",
			salmon: "#fa8072",
			sandybrown: "#f4a460",
			seagreen: "#2e8b57",
			seashell: "#fff5ee",
			sienna: "#a0522d",
			silver: "#c0c0c0",
			skyblue: "#87ceeb",
			slateblue: "#6a5acd",
			slategray: "#708090",
			snow: "#fffafa",
			springgreen: "#00ff7f",
			steelblue: "#4682b4",
			tan: "#d2b48c",
			teal: "#008080",
			thistle: "#d8bfd8",
			tomato: "#ff6347",
			turquoise: "#40e0d0",
			violet: "#ee82ee",
			wheat: "#f5deb3",
			white: "#ffffff",
			whitesmoke: "#f5f5f5",
			yellow: "#ffff00",
			yellowgreen: "#9acd32",
		};

		if (typeof colour === "object")
			return Utility.RGB2HTML(colour.r, colour.g, colour.b);

		if (colour[0] == "r" && colour[1] == "g" && colour[2] == "b")
			return Utility.RGB2HTML(colour);

		if (colour[0] == "#") return colour;

		if (typeof colours[colour.toLowerCase()] != "undefined")
			return colours[colour.toLowerCase()];

		return "#000000";
	}




	//e.g.  Utility.alert("No curves found", "small")
	/**
	 * Displays a dialog box with a message.
	 * @param {string} msg The text to display in the dialog box
	 * @param {string} [type = "big"] To display a small dialog, use "small" for this argument. 
	 */
	static alert(msg, type) {
		if (Utility.alertObj == undefined) {
			Utility.alertObj = new AlertDlg();
		}
		Utility.alertObj.alert(msg, type);
	};


	/**
	 * Displays a dialog box with a question and allow the user to cancel or answer Yes or No.
	 * @param {string} msg The text(question) to display in the dialog box.
	 * @param {Function} cb A callback, that takes one argument(an integer), that is called when the user clicks Yes, No or Cancel. See example below.
	 * @param {string} [type = "big"] To display a small dialog, use "small" for this argument.
	 * @example Utility.alertYesNo("Do you want to save the changes to the Grapher?", function(answer){
		switch(answer){
			case Cancel:
				console.log('do Cancel stuff')
				break;
			case Yes:
				console.log('do Yes stuff')
				break;
			case No:
				console.log('do No stuff')
				break;
			default:
				// code block
		}
		}); 
	 */
	static alertYesNo(msg, cb, type) {
		if (Utility.alertObj == undefined) {
			Utility.alertObj = new AlertDlg();
		}
		Utility.alertObj.alertYesNo(msg, cb, type);
	};


	/**
	 * Displays a dialog box that prompts the visitor for input.
	 * @param {string} msg The text to display in the dialog box
	 * @param {string} defaultMsg The default input text
	 * @param {Function} cb A callback, that takes one argument, that is called when the visitor clicks OK. See example below.
	 * @param {string} [type = "big"] To display a small dialog, use "small" for this argument.
	 * @example Utility.prompt("Enter a new name for", "AAAA", function(str){
			console.log(str) //If the visitor clicks OK, the input is log to the console. 
			return true
			})
	 */
	static prompt(msg, defaultMsg, cb, type) {
		if (Utility.promptObj == undefined) {
			Utility.promptObj = new PromptDlg();
		}
		Utility.promptObj.prompt(msg, defaultMsg, cb, type);
	};

	static HTMLToRGB(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? Utility.mRgb(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) : null;
	};

	static mRgb(red, green, blue) {
		return {
			r: red,
			g: green,
			b: blue,
			toString: function () {
				return "rgb(" + red + "," + green + "," + blue + ")";
			},
		};
	};

	static mRgba(red, green, blue, alpha) {
		return {
			r: red,
			g: green,
			b: blue,
			a: alpha,
			toString: function () {
				return "rgb(" + red + "," + green + "," + blue + "," + alpha + ")";
			},
		};
	};

	static isAlpha(ch) {
		/*return typeof ch === "string" && ch.length === 1
		  && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");*/
		ch = ch.toLowerCase().charCodeAt(0);
		return ch > 96 && ch < 122;
	};

// 	/*
//  * The expression parser of math.js has support for letting functions
//  * parse and evaluate arguments themselves, instead of calling them with
//  * evaluated arguments.
//  *
//  * By adding a property `raw` with value true to a function, the function
//  * will be invoked with unevaluated arguments, allowing the function
//  * to process the arguments in a customized way.
//  */


	/**
	 * AAAAAA
	 *
	 * @returns {void}
	 * @see {@link enableIntegrate~integrate integrate()}
	 */
	static enableIntegrate() {
		if (math.integrate) return;
		//integraeEnabled = true;

		/**
		 * Calculate the numeric integration of a function
		 * 
		 * @param {Function} f
		 * @param {number} start
		 * @param {number} end
		 * @param {number} [step=0.01]
		 * @inner
		 */
		function integrate(f, start, end, volumeX, step) {
			//Reset
			Static.total_area = 0;
			Static.total_volume = 0;
			var _x = 0;
			volumeX = volumeX || false;
			var x = start;
			var y = 0;
			if (volumeX) {
				if (step > Static._eps) {
					for (x; x < end; x += step) {
						var _x = x + step;
						if (_x > end) step = step - (_x - end);
						y = f(x + step / 2);
						Static.total_volume += y * step * y * Math.PI;
					}
				} else {
					alert(
						"The aplication is attempting to use too small a step in the trapezoidial rule."
					);
				}
				return Static.total_volume;
			}
			if (step > Static._eps) {
				for (x; x < end; x += step) {
					var _x = x + step;
					if (_x > end) step = step - (_x - end);
					y = f(x + step / 2);
					Static.total_area += y * step;
				}
			} else {
				alert(
					"The aplication is attempted to use too small a step in the trapezoidial rule."
				);
			}

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
		 *     math.evaluate('integrate(2*x, x, 0, 2)')
		 *     math.evaluate('integrate(2*x, x, 0, 2, 0.01)')
		 *
		 * @param {Array.<math.expression.node.Node>} args
		 *            Expects the following arguments: [f, x, start, end, step]
		 * @param {Object} math
		 * @param {Object} [scope]
		 */
		integrate.transform = function (args, math, scope) {
			// determine the variable name
			if (!args[1].isSymbolNode) {
				throw new Error("Second argument must be a symbol");
			}
			const variable = args[1].name;

			// evaluate start, end, and step
			var start = args[2].compile().evaluate(scope);
			var end = args[3].compile().evaluate(scope);
			var volumeX = args[4] && args[4].compile().evaluate(scope); // volumeX is optional
			var step = args[5] && args[5].compile().evaluate(scope); // step is optional

			// create a new scope, linked to the provided scope. We use this new scope
			// to apply the variable.
			var fnScope = Object.create(scope);

			// construct a function which evaluates the first parameter f after applying
			// a value for parameter x.
			var fnCode = args[0].compile();
			var f = function (x) {
				fnScope[variable] = x;
				return fnCode.evaluate(fnScope);
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
			integrate: integrate,
		});
	}

	/**
	 * Determine if a character is alpha.
	 * @param {string} ch Character to test.
	 * @returns {booelean} true / false
	 */
	static isAlpha(ch) {
		return typeof ch === "string" && ch.length === 1
			&& (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
	}

		
	//remove the keywords from a expression string
	static purgeKewords(str) {
		var result = str;
		for (var i = 0; i < Static.keywords.length; ++i) {
			while (result.indexOf(Static.keywords[i]) != -1) result = result.replace(Static.keywords[i], "");
		}
		return result;
	}

	static findIndepVar(fx) {
		//e = 2.718281828, thus 'e' is excluded from alphas
		var alphas = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var i = 0;

		var fnWithoutKeywords = Utility.purgeKewords(fx);

		while (i < fnWithoutKeywords.length) {
			var c = fnWithoutKeywords.charAt(i);
			var str = "";
			while (alphas.indexOf(c) != -1 && i < fnWithoutKeywords.length) {
				str += c;
				++i;
				c = fnWithoutKeywords.charAt(i);
			}
			if (str.length === 1) {
				return str;
			}
			++i;
		}
		return undefined;
	}

	//Check the expression strihg for a keyword
	//returns the keyword found or null if no keyword was found
	static containsKeyword(str) {
		for (var i = 0; i < Static.keywords.length; i++) {
			if (str.indexOf(Static.keywords[i]) == -1) continue;
			return Static.keywords[i];
		}
		return null;
	}

	//Receives an expression string from the Curve Function Dlg (e.g loo10(x)) and returns a string that is expected by math.js (log(x, 10))
	static logBaseAdjust(expStr) {
		var logBaseStr = [
			"log2",
			"log3",
			"log4",
			"log5",
			"log6",
			"log7",
			"log8",
			"log9",
			"log10",
		];

		//helper
		function insertLogBase(expStr, logStr) {
			var str = expStr;
			//var resultStr = "";
			if (expStr.includes(logStr)) {
				var base = logStr.replace("log", "");
				//console.log(base)
				while (str.indexOf(logStr) !== -1) {
					var i = str.indexOf(logStr) + logStr.length;
					var leftPar = 0;
					var rightPar = 0;
					for (i; i < str.length; ++i) {
						if (str[i] == "(") leftPar++;
						if (str[i] == ")") rightPar++;
						if (leftPar == rightPar) {
							str = str.insertAt(i, 0, "," + base);
							str = str.replace(logStr, "log");
							//console.log(str)
							break;
						}
					}
				}
			}
			return str;
		}

		for (var i = 0; i < logBaseStr.length; i++) {
			expStr = insertLogBase(expStr, logBaseStr[i]);
		}
		return expStr;
	}

	static sqr(value) {
		return Math.pow(value, 2);
	};

}
Utility.warn = 0;
Utility.warnIgnore = 1;
Utility.silentIgnore = 2;
Utility.errorResponseChanged = false;
Utility.errorResponse = Utility.warn;
