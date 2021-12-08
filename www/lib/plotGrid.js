'use strict';
//define(function(){
/////////////////PlotGrid - subclass of PlotItem//////////start
//PlotGrid.inheritsFrom( PlotItem );
// Define the PlotGrid constructor
//function PlotGrid(tle) {

/**
 * 
 */
class PlotGrid extends  PlotItem {
	constructor(tle) {
    // Call the parent constructor, making sure (using Function#call)
	// that "this" is set correctly during the call
	//PlotItem.call(this, tle);
	super(tle);

    this.setItemAttribute(PlotItem.ItemAttribute.AutoScale, true );



	// Initialize our PlotGrid-specific properties
	// Enables major grid, disables minor grid
	var xEnabled = true;
	var yEnabled = true;
    var xMinEnabled = false;
    var yMinEnabled = false;

	var xScaleDiv = null;
	var yScaleDiv = null;

    var _majorPen = /* "rgb(192, 192, 192)"; */"grey";
    var _minorPen = /* "rgb(221, 221, 221)"; */"lightGrey";

    this.rtti = PlotItem.RttiValues.Rtti_PlotGrid;

    this.setMajorPen = function (penColor) {
        if (_majorPen !== penColor) {
			_majorPen = penColor;
			this.itemChanged();
			//Static.trigger("itemChanged", [this, on]);
		}
	}
    this.majorPen = function () {
        return _majorPen;
    }

    this.setMinorPen = function (penColor) {
        if (_minorPen !== penColor) {
			_minorPen = penColor;
			this.itemChanged();
			//Static.trigger("itemChanged", [this, on]);
		}
	}
    this.minorPen = function () {
        return _minorPen;
    }

	//this.setZ( 10.0 );
	this.enableX = function (on) {
		if (xEnabled != on) {
			xEnabled = on;
			//this.plot().autoRefresh()
			//legendChanged();
			this.itemChanged();
			Static.trigger("itemChanged", [this, on]);
		}
	}
	
	this.xEnabled = function(){
		return xEnabled;
	}
	
	
	this.enableY = function (on) {
		if (yEnabled != on) {
			yEnabled = on;
			//this.plot().autoRefresh()
			//legendChanged();
			this.itemChanged();
			Static.trigger("itemChanged", [this, on]);
		}
	}
	
	this.yEnabled = function(){
		return yEnabled;
	}
	
	this.enableXMin = function (on) {
		if (xMinEnabled != on) {
			xMinEnabled = on;
			//this.plot().autoRefresh()

			//legendChanged();
			this.itemChanged();
		}
	}
	
	this.xMinEnabled = function(){
		return xMinEnabled;
	}
	
	
	this.enableYMin = function (on) {
		if (yMinEnabled != on) {
			yMinEnabled = on;
			//this.plot().autoRefresh()

			//legendChanged();
			this.itemChanged();
		}
	}
	
	this.yMinEnabled = function(){
		return yMinEnabled;
	}
	
	/*
	Assign an x axis scale division
	scaleDiv Scale division
	 */
	this.setXDiv = function (scaleDiv) {
        if (xScaleDiv !== scaleDiv) {
			xScaleDiv = scaleDiv;
			//itemChanged();
		}
	}
    this.xDiv = function () {
        return xScaleDiv;
    }

	/*!
	Assign a y axis division
	scaleDiv Scale division
	 */
	this.setYDiv = function (scaleDiv) {
        if (yScaleDiv !== scaleDiv) {
			yScaleDiv = scaleDiv;
			//itemChanged();
		}
	}
    this.yDiv = function () {
        return yScaleDiv;
    }
	
	/*
	  Draw the grid	
	  The grid is drawn into the bounding rectangle such that
	  grid lines begin and end at the rectangle's borders. The X and Y
	  maps are used to map the scale divisions into the drawing region
	  screen.	
	  param painter  Painter
	  param xMap X axis map
	  param yMap Y axis
	  param canvasRect Contents rectangle of the plot canvas
	*/
	this.draw = function (xMap, yMap) 
	{        
        var p = this.plot();        
        var xScaleDiv = p.axisScaleDiv(this.xAxis());
        var yScaleDiv = p.axisScaleDiv(this.yAxis());


        var ctx = this.getContext();

		//ctx.clearRect ( 0 , 0 , ctx.canvas.width, ctx.canvas.height );
        ctx.strokeStyle = _minorPen;

        if ( xEnabled && xMinEnabled )
	    {

            this.drawLines(ctx, "vertical", xMap, xScaleDiv.ticks( ScaleDiv.TickType.MinorTick ) );
            this.drawLines(ctx,  "vertical", xMap, xScaleDiv.ticks( ScaleDiv.TickType.MediumTick ) );
	    }
	
        if ( yEnabled && yMinEnabled )
	    {
            this.drawLines(ctx, "horizontal", yMap, yScaleDiv.ticks(ScaleDiv.TickType.MinorTick ) );
            this.drawLines(ctx,  "horizontal", yMap, yScaleDiv.ticks(ScaleDiv.TickType.MediumTick ) );
        }
        //ctx.stroke();
	
	    //  draw major grid lines
        ctx.strokeStyle = _majorPen;

        //ctx.beginPath();
	    
        if ( xEnabled )
	    {

            this.drawLines(ctx,  "vertical", xMap, xScaleDiv.ticks(ScaleDiv.TickType.MajorTick ) );
	    }
	
        if ( yEnabled )
	    {
            this.drawLines(ctx,  "horizontal", yMap, yScaleDiv.ticks( ScaleDiv.TickType.MajorTick ) );
	    }

        //ctx.stroke();
	}

    this.drawLines = function(context, orientation, scaleMap, values )
	{
        var x1 = 0;
        var x2 = context.canvas.width - 1.0;

        var y1 = 0;//canvasRect.top()();
        var y2 = context.canvas.height - 1.0;

        var painter = new PaintUtil.Painter(context);
        var lineThickness = painter.pen().width
        
	    for (var i = 0; i < values.length; i++ )
	    {
	        var value = scaleMap.transform( values[i] );
	        //if ( doAlign )
                //value = Math.round( value );

	
            if ( orientation === "horizontal" )
            {               
               painter.drawLine(x1, value-lineThickness, x2, value-lineThickness)
	        }
	        else
            {                
                painter.drawLine(value-lineThickness, y1, value-lineThickness, y2);
	        }
	    }
	    painter = null
	}
    /*!
       Update the grid to changes of the axes scale division

       \param xScaleDiv Scale division of the x-axis
       \param yScaleDiv Scale division of the y-axis

       \sa QwtPlot::updateAxes()
    */
    this.updateScaleDiv = function( xScale_div, yScale_div )
    {
        this.setXDiv( xScale_div );
        this.setYDiv( yScale_div );
    }

    


//PlotGrid.prototype = Object.create(PlotItem.prototype);
//PlotGrid.prototype.constructor = PlotGrid;
//PlotGrid.prototype.parent = PlotItem.prototype;

this.toString = function () {
	return '[PlotGrid]';
}
	}
}
/////////////////////////////////////////////////////end

/*return PlotGrid
})*/