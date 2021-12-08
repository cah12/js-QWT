'use strict';
/* -*- mode: C++ ; c-file-style: "stroustrup" -*- *****************************
 * Qwt Widget Library
 * Copyright (C) 1997   Josef Wilgen
 * Copyright (C) 2002   Uwe Rathmann
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the Qwt License, Version 1.0
 *****************************************************************************/

/*class QwtPlotSpectroCurve::PrivateData
{
public:
PrivateData():
colorRange( 0.0, 1000.0 ),
penWidth(0.0),
paintAttributes( QwtPlotSpectroCurve::ClipPoints )
{
colorMap = new QwtLinearColorMap();
}

~PrivateData()
{
delete colorMap;
}

QwtColorMap *colorMap;
QwtInterval colorRange;
QVector<QRgb> colorTable;
double penWidth;
QwtPlotSpectroCurve::PaintAttributes paintAttributes;
};
 */
/*!
Constructor
\param title Title of the curve
 */

/////////////////Curve - subclass of PlotSeriesItem//////////start
//SpectroCurve.inheritsFrom( PlotSeriesItem );
//Define the PlotSeriesItem constructor
/*!
Constructor
\param tle Title of the curve
 */
//function SpectroCurve(tle) {

/**
 * 
 */
class SpectroCurve extends PlotSeriesItem {
    constructor(tle) {
        // Call the parent constructor, making sure (using Function#call)
        // that "this" is set correctly during the call
        //PlotSeriesItem.call(this, tle);
        super(tle);
        const Enum = Enumerator.getDefaultEnumNampespace();

        this.rtti = PlotItem.RttiValues.Rtti_PlotSpectroCurve;
        //var m_colorMap = new LinearColorMap();
        //var m_colorMap = new LinearColorMap(RGB);
        var m_colorMap = new LinearColorMap(ColorMap.Format.Indexed);
        var m_colorRange = new Interval(0.0, 1000.0)
            var m_penWidth = 0.0
            var m_colorTable = []

            //! Initialize internal members
            this.init = function () {
            this.setItemAttribute(PlotItem.ItemAttribute.Legend, true);
            this.setItemAttribute(PlotItem.ItemAttribute.AutoScale, true);

            this.setData(new Point3DSeriesData());

        }

        /*!
        Specify an attribute how to draw the curve

        \param attribute Paint attribute
        \param on On/Off
        \sa testPaintAttribute()
         */
        this.setPaintAttribute = function (attribute, on) {
            if (on)
                m_paintAttributes |= attribute;
            else
                m_paintAttributes &= ~attribute;
        }

        /*!
        \return True, when attribute is enabled
        \sa setPaintAttribute()
         */
        this.testPaintAttribute = function (attribute) {
            return (m_paintAttributes & attribute);
        }

        /*!
        Initialize data with an array of samples.
        \param samples Vector of points
         */
        this.setSamples = function (samples) {
            this.setData(new Point3DSeriesData(samples));
        }

        /*!
        Change the color map
        Often it is useful to display the mapping between intensities and
        colors as an additional plot axis, showing a color bar.
        \param colorMap Color Map

        \sa colorMap(), setColorRange(), QwtColorMap::color(),
        QwtScaleWidget::setColorBarEnabled(), QwtScaleWidget::setColorMap()
         */
        this.setColorMap = function (colorMap) {
            if (colorMap != m_colorMap) {
                m_colorMap = colorMap;
            }

            //legendChanged();
            itemChanged();
        }

        /*!
        \return Color Map used for mapping the intensity values to colors
        \sa setColorMap(), setColorRange(), QwtColorMap::color()
         */
        this.colorMap = function () {
            return m_colorMap;
        }

        /*!
        Set the value interval, that corresponds to the color map

        \param interval interval.minValue() corresponds to 0.0,
        interval.maxValue() to 1.0 on the color map.

        \sa colorRange(), setColorMap(), QwtColorMap::color()
         */
        this.setColorRange = function (interval) {
            if (interval != m_colorRange) {
                m_colorRange = interval;

                //legendChanged();
                this.itemChanged();
            }
        }

        /*!
        \return Value interval, that corresponds to the color map
        \sa setColorRange(), setColorMap(), QwtColorMap::color()
         */
        this.colorRange = function () {
            return m_colorRange;
        }

        /*!
        Assign a pen width

        \param penWidth New pen width
        \sa penWidth()
         */
        this.setPenWidth = function (penWidth) {
            if (penWidth < 0.0)
                penWidth = 0.0;

            if (m_penWidth != penWidth) {
                m_penWidth = penWidth;

                //legendChanged();
                this.itemChanged();
            }
        }

        /*!
        \return Pen width used to draw a dot
        \sa setPenWidth()
         */
        this.penWidth = function () {
            return m_penWidth;
        }
		
		this.setColorInterval = function(color1, color2){ 
			m_colorMap.setColorInterval(color1, color2);
			this.itemChanged();
		}

		this.color1 = function () {
           return m_colorMap.color1();
        }

        this.color2 = function () {
            return m_colorMap.color2();
        }

        /*!
        Draw a subset of the points

        \param painter Painter
        \param xMap Maps x-values into pixel coordinates.
        \param yMap Maps y-values into pixel coordinates.
        \param canvasRect Contents rectangle of the canvas
        \param from Index of the first sample to be painted
        \param to Index of the last sample to be painted. If to < 0 the
        series will be painted to its last sample.

        \sa drawDots()
         */
        //this.drawSeries = function(painter, xMap, yMap, canvasRect, from, to ) {
        this.drawSeries = function (xMap, yMap, from, to) {

            var ctx = this.getContext();

            var painter = new PaintUtil.Painter(ctx);

            //if ( !painter || this.dataSize() <= 0 )
            if (this.dataSize() <= 0)
                return;

            if (to < 0)
                to = this.dataSize() - 1;

            if (from < 0)
                from = 0;

            if (from > to)
                return;

            this.drawDots(painter, xMap, yMap, /*canvasRect,*/ from, to);
            painter = null
        }

        /*!
        Draw a subset of the points

        \param painter Painter
        \param xMap Maps x-values into pixel coordinates.
        \param yMap Maps y-values into pixel coordinates.
        \param canvasRect Contents rectangle of the canvas
        \param from Index of the first sample to be painted
        \param to Index of the last sample to be painted. If to < 0 the
        series will be painted to its last sample.

        \sa drawSeries()
         */
        this.drawDots = function (painter, xMap, yMap, /*canvasRect,*/ from, to) {
            if (!m_colorRange.isValid())
                return;

            //const bool doAlign = QwtPainter::roundingAlignment( painter );

            var format = m_colorMap.format();
            if (format == ColorMap.Format.Indexed)
                m_colorTable = m_colorMap.colorTable(m_colorRange);

            var series = this.data();

            for (var i = from; i <= to; i++) {
                var sample = series.sample(i);

                var xi = xMap.transform(sample.x);
                var yi = yMap.transform(sample.y);
                /*if ( doAlign ){
                xi = Math.round( xi );
                yi = Math.round( yi );
                }*/

                /*if ( d_data->paintAttributes & QwtPlotSpectroCurve::ClipPoints )
            {
                if ( !canvasRect.contains( xi, yi ) )
                continue;
                }*/

                if (format == ColorMap.Format.RGB) {
                    var rgb = m_colorMap.rgb(m_colorRange, sample.z);
                    //console.log(RGB2HTML(rgb))
                    //painter.setPen( QPen( QColor::fromRgba( rgb ), d_data->penWidth ));
                    painter.setPen(new Misc.Pen(Utility.RGB2HTML(rgb), m_penWidth))
                    painter.setBrush(new Misc.Brush(Utility.RGB2HTML(rgb)));
                    //RGB2HTML(0,0,255)
                    //
                } else {
                    var index = parseInt(m_colorMap.colorIndex(m_colorRange, sample.z));
                    var color = m_colorTable[index];
                    //console.log(RGB2HTML(color))
                    //painter.setPen( QPen( QColor::fromRgba( d_data->colorTable[index] ), d_data->penWidth ) );
                    //painter.setPen( new Misc.Pen(RGB2HTML(color), m_penWidth))
                    painter.setPen(new Misc.Pen(Utility.RGB2HTML(color), m_penWidth))
                    painter.setBrush(new Misc.Brush(Utility.RGB2HTML(color)));
                }

                painter.drawPoint(new Misc.Point(xi, yi));
            }

            m_colorTable = []; //clear m_colorTable
        }

        this.init();
    }
}

/*!
Assign a series of samples

setSamples() is just a wrapper for setData() without any additional
value - beside that it is easier to find for the developer.

\param data Data
\warning The item takes ownership of the data object, deleting
it when its not used anymore.
 */
/*void QwtPlotSpectroCurve::setSamples(
QwtSeriesData<QwtPoint3D> *data )
{
setData( data );
} */
