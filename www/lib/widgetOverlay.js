'use strict';
///////////////////WidgetOverlay////////////////////////start
//WidgetOverlay.inheritsFrom(Widget);
class WidgetOverlay extends Widget{
//function WidgetOverlay(w) {
	constructor(w){
		/*if (typeof(w) === 'undefined')
			return;*/
		//Widget.call(this, w.getElement()); ////////////////
		super(w)
		let self = this;

		
		this.draw = function () {
			let p = new PaintUtil.Painter(this);
			this.drawOverlay(p)//new PaintUtil.Painter(this))
			p=null
		}



		/*Static.bind("replot", function(){
	        self.draw()
	    })*/

	    

		this.toString = function () {
			return '[WidgetOverlay]';
		}
	}
	updateOverlay(){
		//console.log('updateOverlay() called in WidgetOverlay')
		this.draw();
	}
	drawOverlay(painter) {console.warn('drawOverlay() not reimplemented')}
}
//subclass reimplement this method to draw the widget overlay
//WidgetOverlay.prototype.drawOverlay = function (painter) {}
///////////////////////////////////////////////////end
