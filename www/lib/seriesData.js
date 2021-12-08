'use strict';

///////////////////////////SeriesData/////////////////////////////start
/*!
\brief Abstract interface for iterating over samples

Qwt offers several implementations of the QwtSeriesData API,
but in situations, where data of an application specific format
needs to be displayed, without having to copy it, it is recommended
to implement an individual data access.

A subclass of QwtSeriesData<QPointF> must implement:

- size()\n
Should return number of data points.

- sample()\n
Should return values x and y values of the sample at specific position
as QPointF object.

- boundingRect()\n
Should return the bounding rectangle of the data series.
It is used for autoscaling and might help certain algorithms for displaying
the data. You can use qwtBoundingRect() for an implementation
but often it is possible to implement a more efficient algorithm
depending on the characteristics of the series.
The member d_boundingRect is intended for caching the calculated rectangle.

 */
//function SeriesData() {
class SeriesData {
    constructor() {
        this.d_boundingRect = new Misc.Rect(); //{ left:0.0, top:0.0, right:-1.0, bottom:-1.0, width:-1.0, height:-1 };

        Static.mBoundingRectPoint = function (sample) {
            return new Misc.Rect(sample.x, sample.y, 0, 0); //{ left:sample.x, top:sample.y, right:sample.x, bottom:sample.y, width:0.0, height:0.0};
        }

        Static.mBoundingRect = function (series, from, to) {
            var boundingRect = new Misc.Rect(); //{ left:0.0, top:0.0, right:-1.0, bottom:-1.0, width:-1.0, height:-1 }; // invalid;

            if (typeof(from) == "undefined")
                from = 0;

            if (typeof(to) == "undefined")
                to = series.size() - 1;

            if (to < from)
                return boundingRect;

            var i;
            for (i = from; i <= to; i++) {
                var rect = Static.mBoundingRectPoint(series.sample(i));
                //console.log(boundingRect.width())
                if (rect.width() >= 0.0 && rect.height() >= 0.0) {
                    boundingRect = rect;

                    i++;
                    break;
                }
            }
            //console.log(i)
            for (; i <= to; i++) {

                var rect = Static.mBoundingRectPoint(series.sample(i));
                if (rect.width() >= 0.0 && rect.height() >= 0.0) {
                    boundingRect.setRect(Math.min(boundingRect.left(), rect.left()),
                        Math.min(boundingRect.top(), rect.top()),
                        Math.max(boundingRect.right(), rect.right()) - Math.min(boundingRect.left(), rect.left()),
                        Math.max(boundingRect.bottom(), rect.bottom()) - Math.min(boundingRect.top(), rect.top()));
                }
            }
            //
            return boundingRect;
        }

        this.setRectOfInterest = function (rect) {}

        this.toString = function () {
            return '[SeriesData]';
        }
    }
}

/////////////////////////////////////////////////////////////////////////end

/////////////////ArraySeriesData - subclass of SeriesData//////////start
//ArraySeriesData.inheritsFrom(SeriesData);
//Define the PlotSeriesItem constructor
//function ArraySeriesData(samples) {
class ArraySeriesData extends SeriesData {
    constructor(samples) {
        // Call the parent constructor, making sure (using Function#call)
        // that "this" is set correctly during the call
        //SeriesData.call(this);
        super();
        var d_samples = [];
        if (typeof(samples) !== "undefined")
            d_samples = samples;

        this.setSamples = function (samples) {
            this.d_boundingRect = new Misc.Rect(); //{ left:0.0, top:0.0, right:-1.0, bottom:-1.0, width:-1.0, height:-1 };
            d_samples = samples;
        }

        this.samples = function () {

            return d_samples;
        }

        this.size = function () {
            return d_samples.length;
        }

        this.sample = function (i) {
            return d_samples[i];
        }

        this.toString = function () {
            return '[ArraySeriesData]';
        }
    }
}
/////////////////////////////////////////////////////end

/////////////////PointSeriesData - subclass of ArraySeriesData//////////start
//PointSeriesData.inheritsFrom(ArraySeriesData);
//Define the PointSeriesData constructor
//function PointSeriesData(samples) {
class PointSeriesData extends ArraySeriesData {
    constructor(samples) {
        // Call the parent constructor, making sure (using Function#call)
        // that "this" is set correctly during the call
        //ArraySeriesData.call(this, samples);
        super(samples);

        /*!
        \brief Calculate the bounding rectangle

        The bounding rectangle is calculated once by iterating over all
        points and is stored for all following requests.

        \return Bounding rectangle
         */
        this.boundingRect = function () {
            if (this.d_boundingRect.width() < 0.0)
                this.d_boundingRect = Static.mBoundingRect(this);

            return this.d_boundingRect;
        }

        this.toString = function () {
            return '[PointSeriesData]';
        }
    }
}
/////////////////////////////////////////////////////end

/////////////////Point3DSeriesData - subclass of ArraySeriesData//////////start
//Point3DSeriesData.inheritsFrom(ArraySeriesData);
//Define the Point3DSeriesData constructor
/*!
Constructor
\param samples Samples
 */
//function Point3DSeriesData(samples) {
class Point3DSeriesData extends ArraySeriesData {
    constructor(samples) {
        // Call the parent constructor, making sure (using Function#call)
        // that "this" is set correctly during the call
        //ArraySeriesData.call(this, samples);
        super(samples);

        /*!
        \brief Calculate the bounding rectangle

        The bounding rectangle is calculated once by iterating over all
        points and is stored for all following requests.

        \return Bounding rectangle
         */
        this.boundingRect = function () {
            if (this.d_boundingRect.width() < 0.0)
                this.d_boundingRect = Static.mBoundingRect(this);

            return this.d_boundingRect;
        }

        this.toString = function () {
            return '[Point3DSeriesData]';
        }
    }
}

/////////////////////////////////////////////////////end

/////////////////PlotSeriesItem - subclass of PlotItem//////////start
//PlotSeriesItem.inheritsFrom(PlotItem);
//Define the PlotSeriesItem constructor
//function PlotSeriesItem(tle) {
class PlotSeriesItem extends PlotItem {
    constructor(tle) {
        // Call the parent constructor, making sure (using Function#call)
        // that "this" is set correctly during the call
        //PlotItem.call(this, tle);
        super(tle);

        var d_series = null;
        var m_orientation = Static.Vertical;

        /*!
        Set the orientation of the item.

        The orientation() might be used in specific way by a plot item.
        F.e. a QwtPlotCurve uses it to identify how to display the curve
        int QwtPlotCurve::Curve.CurveStyle.Steps or QwtPlotCurve::Sticks style.

        \sa orientation()
         */
        this.setOrientation = function (orientation) {
            if (m_orientation != orientation) {
                m_orientation = orientation;

                //legendChanged();
                this.itemChanged();
            }
        }

        /*!
        \return Orientation of the plot item
        \sa setOrientation()
         */
        this.orientation = function () {
            return m_orientation;
        }

        /*!
        \brief Draw the complete series

        \param painter Painter
        \param xMap Maps x-values into pixel coordinates.
        \param yMap Maps y-values into pixel coordinates.
        \param canvasRect Contents rectangle of the canvas
         */
        this.draw = function (xMap, yMap) {
            //alert(45)
            this.drawSeries(xMap, yMap, 0, -1);
        }

        /* this.boundingRect = function () {
            return this.dataRect();
        } */

        this.updateScaleDiv = function (xScaleDiv, yScaleDiv) {
            //        var rect = {
            //            left:xScaleDiv.lowerBound(),
            //            top:yScaleDiv.lowerBound(),
            //            width:xScaleDiv.range(),
            //            height:yScaleDiv.range(),
            //            right:xScaleDiv.lowerBound()+xScaleDiv.range(),
            //            bottom:yScaleDiv.lowerBound()+yScaleDiv.range()
            //        };

            var rect = new Misc.Rect(new Misc.Point(xScaleDiv.lowerBound(), yScaleDiv.lowerBound()),
                    xScaleDiv.range(), yScaleDiv.range());

            this.setRectOfInterest(rect);
        }

        this.data = function () {
            return d_series;
        }

        this.sample = function (index) {
            return d_series ? d_series.sample(index) : null;
        }

        this.setData = function (series) {
            if (d_series != series) {
                d_series = series;
                //dataChanged();
            }
        }

        this.dataSize = function () {
            if (d_series == null)
                return 0;

            return d_series.size();
        }

        this.dataRect = function () {

            if (d_series == null)
                return new Misc.Rect(); //{left: 1.0, top:1.0, width:-2.0, height:-2.0 }; // invalid

            return d_series.boundingRect();
        }

        this.setRectOfInterest = function (rect) {
            if (d_series)
                d_series.setRectOfInterest(rect);
        }

        this.swapData = function (series) {
            var swappedSeries = d_series;
            d_series = series;

            return swappedSeries;
        }

        this.toString = function () {
            return '[PlotSeriesItem]';
        }
    }
	boundingRect() {
		return this.dataRect();
	}
}
/////////////////////////////////////////////////////end
