
/*!
  \brief QwtRasterData defines an interface to any type of raster data.

  QwtRasterData is an abstract interface, that is used by
  QwtPlotRasterItem to find the values at the pixels of its raster.

  Often a raster item is used to display values from a matrix. Then the
  derived raster data class needs to implement some sort of resampling,
  that maps the raster of the matrix into the requested raster of
  the raster item ( depending on resolution and scales of the canvas ).
*/
class RasterData {
	constructor(){
		var d_intervals = [null, null, null];
		
		/*!
		   Set the bounding interval for the x, y or z coordinates.

		   \param axis Axis
		   \param interval Bounding interval

		   \sa interval()
		*/
		this.setInterval = function(  axis, interval )
		{
			d_intervals[axis] = interval;
		}
		
		this.interval = function(axis)
		{
			return d_intervals[axis];
		}

		/*!
		  \brief Initialize a raster

		  Before the composition of an image QwtPlotSpectrogram calls initRaster(),
		  announcing the area and its resolution that will be requested.

		  The default implementation does nothing, but for data sets that
		  are stored in files, it might be good idea to reimplement initRaster(),
		  where the data is resampled and loaded into memory.

		  \param area Area of the raster
		  \param raster Number of horizontal and vertical pixels

		  \sa initRaster(), value()
		*/
		this.initRaster = function( area, /* const QSize & */raster )
		{
			//Q_UNUSED( area );
			//Q_UNUSED( raster );
		}

		/*!
		  \brief Discard a raster

		  After the composition of an image QwtPlotSpectrogram calls discardRaster().

		  The default implementation does nothing, but if data has been loaded
		  in initRaster(), it could deleted now.

		  \sa initRaster(), value()
		*/
		this.discardRaster = function()
		{
		}
		
		/** @param {number[][]} d - matrix of data to contour
		   * @param {number} ilb,iub,jlb,jub - index bounds of data matrix
		   *
		   *             The following two, one dimensional arrays (x and y) contain
		   *             the horizontal and vertical coordinates of each sample points.
		   * @param {number[]} x  - data matrix column coordinates
		   * @param {number[]} y  - data matrix row coordinates
		   * @param {number} nc   - number of contour levels
		   * @param {number[]} z  - contour levels in increasing order.
		   */
		this.contourLinesData = function(levels, gridSizeX,  gridSizeY){
			var gridSzX = gridSizeX || 100;
			var gridSzY = gridSizeY || 100;
			var intervalX = this.interval( Static.XAxis );
			var intervalY = this.interval( Static.YAxis );
			var dx = intervalX.width()/(gridSzX-1);
			var dy = intervalY.width()/(gridSzY-1);
			var x = [];
			var xMin = intervalX.minValue();
			var y = [];
			var yMin = intervalY.minValue();
			
			
			for(var i=0; i<gridSzX; i++){
				x.push(xMin + i*dx);							
			}
			for(var i=0; i<gridSzY; i++){
				y.push(yMin + i*dy);				
			}
			//Correct last point
			x[gridSzX-1] = intervalX.maxValue();
			y[gridSzY-1] = intervalY.maxValue();			
				
			var d = []; //array of arrarys
                
			for(var xi=0; xi<x.length; xi++){ 
                var col = [];                     
				for(var yi=0; yi<y.length; yi++){                            
					col.push(this.value(x[xi], y[yi]));	
				}
                d.push(col);				
			}			
			return {d:d, x:x, y:y}
		}		
	}	
	
	value(  x,  y )	{		
	}
}