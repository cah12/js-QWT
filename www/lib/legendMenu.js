

'use strict';
var LegendMenu = {}
	LegendMenu.plot = null
    LegendMenu.detachReset = null
    LegendMenu.curveFitCb = null
    LegendMenu.curveFitInfoCb = null
    LegendMenu.axisCb = null
	LegendMenu.curveStyleCb = null

    //Names of menu items
    //'remove', 'fit','axis', 'rename', 'symbol', 'pen'
    LegendMenu.hiddenItems = null //['fit', 'symbol']


/////////////submenu1///////////////////
LegendMenu.subMenu1 = [
	/*style
	solid
	dash : ctx.setLineDash([10, 5])
	dashDot : ctx.setLineDash([12, 5, 3, 5])
	dashDotDot : ctx.setLineDash([12, 5, 3, 5, 3, 5])
	dot : ctx.setLineDash([2, 8])
	 */

	{
		name: 'style',
		//title: 'It will replace row',
		//img:'images/replace.png',
		subMenu: [{
				name: 'Rectangle',
				//img:'images/top.png',
				fun: function () {
					LegendMenu.addSymbol(MRect)
				}

			}, {
				name: 'Cross',
				//img:'images/top.png',
				fun: function () {
					LegendMenu.addSymbol(Cross)
				}

			}, {
				name: 'Diamond',
				//img:'images/all.png',
				fun: function () {
					LegendMenu.addSymbol(Diamond)
				}
			}, {
				name: 'Ellipse',
				//img:'images/all.png',
				fun: function () {
					LegendMenu.addSymbol(Ellipse)
				}
			}, {
				name: 'Diagonal cross',
				//img:'images/all.png',
				fun: function () {
					LegendMenu.addSymbol(XCross)
				}
			}
			/*,{
			name: 'Triangle',
			//img:'images/all.png',
			fun:function(){
			LegendMenu.addSymbol(Triangle)
			}
			}*/
		, {
				name: 'None',
				//img:'images/all.png',
				fun: function () {
					var curve = LegendMenu.getCurve()
					if(!curve) return
					curve.setSymbol(null)
				}
			}
		]
	}

]
///////////////////////////////
////////////////////////////subMenu2
LegendMenu.subMenu2 = [///////////

	/*style
	solid
	dash : ctx.setLineDash([10, 5])
	dashDot : ctx.setLineDash([12, 5, 3, 5])
	dashDotDot : ctx.setLineDash([12, 5, 3, 5, 3, 5])
	dot : ctx.setLineDash([2, 8])
	 */

	{
		name: 'style',
		//title: 'It will replace row',
		//img:'images/replace.png',
		subMenu: [{
				name: 'Rectangle',
				//img:'images/top.png',
				fun: function () {
					LegendMenu.addSymbol(MRect)
				}

			}, {
				name: 'Cross',
				//img:'images/top.png',
				fun: function () {
					LegendMenu.addSymbol(Cross)
				}

			}, {
				name: 'Diamond',
				//img:'images/all.png',
				fun: function () {
					LegendMenu.addSymbol(Diamond)
				}
			}, {
				name: 'Ellipse',
				//img:'images/all.png',
				fun: function () {
					LegendMenu.addSymbol(Ellipse)
				}
			}, {
				name: 'Diagonal cross',
				//img:'images/all.png',
				fun: function () {
					LegendMenu.addSymbol(XCross)
				}
			}
			/*,{
			name: 'Triangle',
			//img:'images/all.png',
			fun:function(){
			LegendMenu.addSymbol(Triangle)
			}
			}*/
		, {
				name: 'None',
				//img:'images/all.png',
				fun: function () {
					var curve = LegendMenu.getCurve()
					if(!curve) return
					curve.setSymbol(null)
				}
			}
		]
	}, {
		name: 'size',
		//title: 'It will replace row',
		//img:'images/replace.png',
		//disable: true,
		subMenu: [{
				name: '5x5',
				//img:'images/top.png',
				fun: function () {
					LegendMenu.setSymbolSize(5)
				}

			}, {
				name: '6x6',
				//img:'images/top.png',
				fun: function () {
					LegendMenu.setSymbolSize(6)
				}

			}, {
				name: '8x8',
				//img:'images/all.png',
				fun: function () {
					LegendMenu.setSymbolSize(8)
				}
			}, {
				name: '10x10',
				//img:'images/all.png',
				fun: function () {
					LegendMenu.setSymbolSize(10)
				}
			}, {
				name: '12x12',
				//img:'images/all.png',
				fun: function () {
					LegendMenu.setSymbolSize(12)
				}
			}
			/*,{
			name: '14x14',
			//img:'images/all.png',
			fun:function(){
			LegendMenu.setSymbolSize(14)
			}
			}*/
		, {
				name: '15x15',
				//img:'images/all.png',
				fun: function () {
					LegendMenu.setSymbolSize(15)
				}
			}
		]
	}, {
		name: 'fill brush',
		//title: 'It will merge row',
		//img:'images/merge.png',
		//disable: true,
		fun: function () {
			var colorSelector = $('<input type="color" style="opacity:0;">')
				//LegendMenu.el.append(colorSelector)
				var curve = LegendMenu.getCurve()
				if(!curve) return
				var sym = curve.symbol()
				if (sym) {
					var brush = sym.brush()
					var c = brush.color
					if(c == "noBrush"){
						c = "#000000"
					}
						colorSelector.val(Static.colorNameToHex(c))
						colorSelector.change(function () {
							//console.log($(this).val())
							//console.log(el.text())
							$(this).remove()

							//var pen = curve.pen()
							brush.color = $(this).val()
								sym.setBrush(brush)
								LegendMenu.plot.autoRefresh()
								LegendMenu.plot.updateLegend(curve)

						})
						colorSelector.trigger('click')
				}
		}

	}, {
		name: 'pen',
		//img: 'images/update.png',
		//title: 'update button',
		//disable: true,
		subMenu: [{
				name: 'color',
				//title: 'It will merge row',
				//img:'images/merge.png',
				fun: function () {
					var colorSelector = $('<input type="color" style="opacity:0;">')

						//LegendMenu.el.append(colorSelector)
						var curve = LegendMenu.getCurve()
						if(!curve) return
						var sym = curve.symbol()
						if (!sym)
							return

							colorSelector.val(Static.colorNameToHex(sym.pen().color))
							colorSelector.change(function () {
								//$(this).remove()

								var pen = sym.pen()
									pen.color = $(this).val()
									sym.setPen(pen)
									LegendMenu.plot.autoRefresh()
									LegendMenu.plot.updateLegend(curve)

							})
							colorSelector.trigger('click')
				}

			}, {
				name: 'pen width',
				//title: 'It will replace row',
				//img:'images/replace.png',
				subMenu: [{
						name: '1',
						//img:'images/top.png',
						fun: function () {
							LegendMenu.setSymbolPenWidth(1)
						}

					}, {
						name: '2',
						//img:'images/top.png',
						fun: function () {
							LegendMenu.setSymbolPenWidth(2)
						}

					}, {
						name: '3',
						//img:'images/all.png',
						fun: function () {
							LegendMenu.setSymbolPenWidth(3)
						}
					}, {
						name: '4',
						//img:'images/all.png',
						fun: function () {
							LegendMenu.setSymbolPenWidth(4)
						}
					}, {
						name: '5',
						//img:'images/all.png',
						fun: function () {
							LegendMenu.setSymbolPenWidth(5)
						}
					}
				]
			}

		]
	}

]
/////////////////////////////////////////////////////////
// function curveFitCb(){
// }



/////////////////////////////menu1////////////////////////////////////
LegendMenu.menu1 = [{
		name: 'curve brush',
		img: 'images/style.png',
		title: 'Set the fill color.',
		fun: function () {
			Utility.setCurveBrush(LegendMenu.getCurve());			
		}
	},{
		name: 'curve style',
		img: 'images/style.png',
		title: 'Sets the style of the curve.',
		fun: function () {			
			var curve = LegendMenu.getCurve()
			if(!curve) return
			LegendMenu.curveStyleCb(curve)
		}
	},{
		name: 'axis',
		img: 'images/axis.png',
		title: 'Sets the axes associated with the curve.',
		fun: function () {			
			var curve = LegendMenu.getCurve()
			if(!curve) return
			LegendMenu.axisCb(curve)
		}
	},{
		name: 'legend attribute',
		img: 'images/attribute.png',
		title: 'Sets how the curve is represented on the legend.',
		fun: function () {			
			var curve = LegendMenu.getCurve()
			if(!curve) return
			LegendMenu.curveAttributeCb(curve)
		}
	},{	    
		name: 'remove',
		img: 'images/scissors.png',
		title: 'Removes the curve from the plot.',
		fun: function () {
			var curve = LegendMenu.getCurve()
			if(!curve) return
				//LegendMenu.detachReset(curve)
				curve.detach()

		}

	},{
		name: 'rename',
		img: 'images/rename.png',
		title: 'Renames the curve.',
		fun: function () {
			var curve = LegendMenu.getCurve()
			if(!curve) return
			Utility.curveRenameDlg(curve.title(), curve.plot())			
		},
	
	},{
		name: 'fit',
		img: 'images/fit.png',
		title: 'Defines a curve fitter.',
		fun: function () {
			var curve = LegendMenu.getCurve()
			if(!curve) return
			LegendMenu.curveFitCb(curve)

		},
	
	}, {
		name: 'symbol',
		img: 'images/symbol.png',
		//title: 'update button',
		subMenu: null
	}, {
		name: 'pen',
		img: 'images/pen.png',
		//title: 'update button',
		subMenu: [{
				name: 'color',
				//title: 'It will merge row',
				//img:'images/merge.png',
				fun: function () {
					    var colorSelector = $('<input type="color" style="opacity:0;">')
					    //LegendMenu.el, and hence colorSelector, is removed from the DOM during legend update
					    //LegendMenu.el.append(colorSelector)

						var curve = LegendMenu.getCurve()
						if(!curve) return
						colorSelector.val(Static.colorNameToHex(curve.pen().color))
						colorSelector.change(function () {
							//console.log($(this).val())
							//console.log(el.text())
							//$(this).remove()

							var pen = curve.pen()
								pen.color = $(this).val()
								curve.setPen(pen)

						})
						colorSelector.trigger('click')
				}

			},

			/*style
			solid
			dash : ctx.setLineDash([10, 5])
			dashDot : ctx.setLineDash([12, 5, 3, 5])
			dashDotDot : ctx.setLineDash([12, 5, 3, 5, 3, 5])
			dot : ctx.setLineDash([2, 8])
			 */

			{
				name: 'line style',
				//title: 'It will replace row',
				//img:'images/replace.png',
				subMenu: [{
						name: 'solid',
						//img:'images/top.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.style = "solid"
								curve.setPen(pen)
						}

					}, {
						name: 'dot',
						//img:'images/top.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.style = "dot"
								curve.setPen(pen)
						}

					}, {
						name: 'dash',
						//img:'images/all.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.style = "dash"
								curve.setPen(pen)
						}
					}, {
						name: 'dashDot',
						//img:'images/all.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.style = "dashDot"
								curve.setPen(pen)
						}
					}, {
						name: 'dashDotDot',
						//img:'images/all.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.style = "dashDotDot"
								curve.setPen(pen)
						}
					}
				]
			}, {
				name: 'pen width',
				//title: 'It will replace row',
				//img:'images/replace.png',
				subMenu: [{
						name: '1',
						//img:'images/top.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.width = 1
								curve.setPen(pen)
						}

					}, {
						name: '2',
						//img:'images/top.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.width = 2
								curve.setPen(pen)
						}

					}, {
						name: '3',
						//img:'images/all.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.width = 3
								curve.setPen(pen)
						}
					}, {
						name: '4',
						//img:'images/all.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.width = 4
								curve.setPen(pen)
						}
					}, {
						name: '5',
						//img:'images/all.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.width = 5
								curve.setPen(pen)
						}
					}
				]
			}

		]
	}];

/////////////////////////////////////

/////////////////////////////menu2////////////////////////////////////
LegendMenu.menu2 = [{
		name: 'curve brush',
		img: 'images/style.png',
		title: 'Set the fill color.',
		fun: function () {
			Utility.setCurveBrush(LegendMenu.getCurve());			
		}
	},{
		name: 'curve style',
		img: 'images/style.png',
		title: 'Sets the style of the curve.',
		fun: function () {			
			var curve = LegendMenu.getCurve()
			if(!curve) return
			LegendMenu.curveStyleCb(curve)
		}
	},{
		name: 'axis',
		img: 'images/axis.png',
		title: 'Set the axes associated with the curve.',
		fun: function () {			
			var curve = LegendMenu.getCurve()
			if(!curve) return
			LegendMenu.axisCb(curve)
		}
	},{
		name: 'legend attribute',
		img: 'images/attribute.png',
		title: 'Sets how the curve is represented on the legend.',
		fun: function () {			
			var curve = LegendMenu.getCurve()
			if(!curve) return
			LegendMenu.curveAttributeCb(curve)
		}
	},{	    
		name: 'remove',
		img: 'images/scissors.png',
		title: 'Removes the curve from the plot.',
		fun: function () {
			var curve = LegendMenu.getCurve()
			if(!curve) return
				//LegendMenu.detachReset(curve)
				curve.detach()

		}

	},{
		name: 'rename',
		img: 'images/rename.png',
		title: 'Renames the curve.',
		fun: function () {
			var curve = LegendMenu.getCurve()
			if(!curve) return
			Utility.curveRenameDlg(curve.title(), curve.plot())			
		},
	
	},{
		name: 'fit',
		img: 'images/fit.png',
		title: 'Defines a curve fitter.',
		fun: function () {
			var curve = LegendMenu.getCurve()
			if(!curve) return
			LegendMenu.curveFitCb(curve)

		},
	
	}, {
		name: 'symbol',
		img: 'images/symbol.png',
		//title: 'update button',
		subMenu: null
	}, {
		name: 'pen',
		//img: 'images/update.png',
		//title: 'update button',
		subMenu: [{
				name: 'color',
				//title: 'It will merge row',
				//img:'images/merge.png',
				fun: function () {
					var colorSelector = $('<input type="color" style="opacity:0;">')

						//LegendMenu.el.append(colorSelector)
						var curve = LegendMenu.getCurve()
						if(!curve) return
						colorSelector.val(Static.colorNameToHex(curve.pen().color))
						colorSelector.change(function () {
							//console.log($(this).val())
							//console.log(el.text())
							//$(this).remove()

							var pen = curve.pen()
								pen.color = $(this).val()
								curve.setPen(pen)

						})
						colorSelector.trigger('click')
				}

			},

			/*style
			solid
			dash : ctx.setLineDash([10, 5])
			dashDot : ctx.setLineDash([12, 5, 3, 5])
			dashDotDot : ctx.setLineDash([12, 5, 3, 5, 3, 5])
			dot : ctx.setLineDash([2, 8])
			 */

			{
				name: 'line style',
				//title: 'It will replace row',
				//img:'images/replace.png',
				subMenu: [{
						name: 'solid',
						//img:'images/top.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.style = "solid"
								curve.setPen(pen)
						}

					}, {
						name: 'dot',
						//img:'images/top.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.style = "dot"
								curve.setPen(pen)
						}

					}, {
						name: 'dash',
						//img:'images/all.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.style = "dash"
								curve.setPen(pen)
						}
					}, {
						name: 'dashDot',
						//img:'images/all.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.style = "dashDot"
								curve.setPen(pen)
						}
					}, {
						name: 'dashDotDot',
						//img:'images/all.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.style = "dashDotDot"
								curve.setPen(pen)
						}
					}
				]
			}, {
				name: 'pen width',
				//title: 'It will replace row',
				//img:'images/replace.png',
				subMenu: [{
						name: '1',
						//img:'images/top.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.width = 1
								curve.setPen(pen)
						}

					}, {
						name: '2',
						//img:'images/top.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.width = 2
								curve.setPen(pen)
						}

					}, {
						name: '3',
						//img:'images/all.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.width = 3
								curve.setPen(pen)
						}
					}, {
						name: '4',
						//img:'images/all.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.width = 4
								curve.setPen(pen)
						}
					}, {
						name: '5',
						//img:'images/all.png',
						fun: function () {
							var curve = LegendMenu.getCurve()
							if(!curve) return
								var pen = curve.pen()
								pen.width = 5
								curve.setPen(pen)
						}
					}
				]
			}

		]
	},

{	    
		name: 'fit info...',
		title: 'Displays information associated with curve fitting.',
		fun: function () {
			var curve = LegendMenu.getCurve()
			if(!curve) return
			var info = LegendMenu.curveFitInfoCb(curve)
			if(info.length){				
				Static.alert(info/*, "small"*/)
			}else{
				Static.alert("No curve fitting equation found for \""+curve.title()+".\"")	
			}
		}

	}];

/////////////////////////////////////



LegendMenu.addSymbol = function (style) {
	Utility.addSymbol(LegendMenu.getCurve(), style)
}

LegendMenu.setSymbolPenWidth = function (width) {
	Utility.setSymbolPenWidth(LegendMenu.getCurve(), width)
}

LegendMenu.setSymbolSize = function (value) {
	Utility.setSymbolSize(LegendMenu.getCurve(), value)
}

LegendMenu.getCurve = function () {
	if(LegendMenu.el==undefined){
		return null
	}
	var txt = LegendMenu.el.text().replace(' ', '') //remove leading white space
		return LegendMenu.plot.findPlotCurve(txt)
}



LegendMenu.initialize = function (){//plot, detachCb, curveFitCb) {	


   
	//console.log(LegendMenu.menu1)
	//LegendMenu.menu1.splice(3, 1)
	//console.log(LegendMenu.menu1)
	//console.log(LegendMenu.hiddenItems)
//////////////////////////////////
	var _menuItemName = ""

	function indexOfMenuItemCb(_name, legendMenu) {
		_menuItemName = _name
		return legendMenu.findIndex(findIndexOfMenuItemCb);
	}

    function findIndexOfMenuItemCb(obj) {
		return obj.name == _menuItemName;
	}

	//ages.findIndex(findIndexOfMenuItemCb)

	function hideMenuItem(menuItemName){
		_menuItemName = menuItemName
		//var n = LegendMenu.menu1.findIndex(findIndexOfMenuItemCb)
		//console.log(n)
		LegendMenu.menu1.splice(LegendMenu.menu1.findIndex(findIndexOfMenuItemCb), 1)
		LegendMenu.menu2.splice(LegendMenu.menu2.findIndex(findIndexOfMenuItemCb), 1)
	}

	if(LegendMenu.hiddenItems)
		LegendMenu.hiddenItems.forEach(hideMenuItem)
	//console.log(LegendMenu.menu1)
	//console.log(indexOfMenuItemCb('symbol', LegendMenu.menu1))


	
      
		LegendMenu.table = $(LegendMenu.plot.getLayout().getLegendDiv().children()[0])

		/*LegendMenu.table.mouseover(function (e) {
			LegendMenu.el = Static.elementsFromPoint(e.pageX, e.pageY, LegendMenu.table).find('LABEL')
			//console.log(LegendMenu.el)	
				/////////////////////////////
			var curve = LegendMenu.getCurve()
			LegendMenu.menu = LegendMenu.menu1
			if (curve){
				if(curve.equation){
					LegendMenu.menu = LegendMenu.menu2
				}
			}
				/////////////////////////////


				var str = LegendMenu.el.text()
				LegendMenu.menu[3].subMenu = LegendMenu.subMenu1




				if (curve && curve.symbol()) {
					LegendMenu.menu[3].subMenu = LegendMenu.subMenu2
				}


				LegendMenu.el.parent().contextMenu(LegendMenu.menu, {
					triggerOn: 'contextmenu',
					zIndex: 1000
				});

		})*/

		LegendMenu.table.mousedown(function(e){
			if(e.button!=2){//not right button
				return
			}
			var x = e.pageX, y = e.pageY;
		    var res = [];

		    var ele = document.elementFromPoint(x,y);
		    //console.log(ele.parentElement.tagName)/////////
		    while(ele && ele.tagName != "BODY" && ele.tagName != "HTML"){
		        res.push(ele);
		        ele.style.display = "none";
		        ele = document.elementFromPoint(x,y);
		    }

		    for(var i = 0; i < res.length; i++){
		        res[i].style.display = "";
		    }
		    //console.log($(res[0]).text());
		    LegendMenu.el = $(res[0]).parent()
		    var curve = LegendMenu.getCurve()
		    if(!curve) return
		    //console.log(curve.title())
			LegendMenu.menu = LegendMenu.menu1
			if (curve){
				if(curve.fitType){
					LegendMenu.menu = LegendMenu.menu2
				}
			}
			var subMenuIndex = indexOfMenuItemCb('symbol', LegendMenu.menu1)
			if(subMenuIndex > -1){
				LegendMenu.menu[subMenuIndex].subMenu = LegendMenu.subMenu1
				if (curve && curve.symbol()) {
					LegendMenu.menu[subMenuIndex].subMenu = LegendMenu.subMenu2
				}
			}
			//LegendMenu.el.parent().contextMenu(LegendMenu.menu, {
			LegendMenu.el.contextMenu(LegendMenu.menu, {
				triggerOn: 'contextmenu touchstart',
				zIndex: 1
			});
		})
}
