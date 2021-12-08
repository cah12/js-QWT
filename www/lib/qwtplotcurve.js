'use strict';

/////////////////Curve - subclass of PlotSeriesItem//////////start
//Curve.inheritsFrom( PlotSeriesItem );
//Define the PlotSeriesItem constructor
//function Curve(tle) {
class Curve extends PlotSeriesItem {
    constructor(tle) {
        super(tle);
        Static.LegendNoAttribute = 0x00;
        Static.LegendShowLine = 0x01;
        Static.LegendShowSymbol = 0x02;
        Static.LegendShowBrush = 0x04;
        // Call the parent constructor, making sure (using Function#call)
        // that "this" is set correctly during the call
        //PlotSeriesItem.call(this, tle);

        var m_style = Lines;
        var c_attributes = 0;
        var m_baseline = 0;
        var m_paintAttributes = FilterPoints;
        var m_legendAttributes = Static.LegendNoAttribute;
        var m_brush = new Misc.Brush(); //"NoBrush";
        var m_pen = new Misc.Pen; //mMakePen();

        var m_curveFitter = null;

        var m_symbol = null;

        this.rtti = Static.Rtti_PlotCurve;

        this.setItemInterest(ScaleInterest, true);

        function updateLegendIconSize(curve) {
            var sz = curve.getLegendIconSize();
            if (curve.symbol()) {
                sz = curve.symbol().boundingRect().size();
                //sz.width += 2; // margin
                //sz.height += 3; // margin
            }

            if (curve.symbol() && curve.testLegendAttribute(Static.LegendShowSymbol)) {

                if (curve.testLegendAttribute(Static.LegendShowLine)) {
                    // Avoid, that the line is completely covered by the symbol

                    var w = Math.ceil(1.5 * sz.width);

                    if (w % 2)
                        w++;

                    sz.width = Math.max(40, w);
                }
                curve.setLegendIconSize(sz);
            } else if (curve.testLegendAttribute(Static.LegendShowLine)) {
                sz.width = 40;
                curve.setLegendIconSize(sz);
            }

        }

        //! boundingRect().left()
        this.minXValue = function () {
            return this.boundingRect().left();
        }

        //! boundingRect().right()
        this.maxXValue = function () {
            return this.boundingRect().right();
        }

        //! boundingRect().top()
        this.minYValue = function () {
            return this.boundingRect().top();
        }

        //! boundingRect().bottom()
        this.maxYValue = function () {
            return this.boundingRect().bottom();
        }

        /*!
        Specify an attribute how to draw the legend icon

        \param attribute Attribute
        \param on On/Off
        /sa testLegendAttribute(). legendIcon()
         */
        this.setLegendAttribute = function (attribute, on) {
            if (on != this.testLegendAttribute(attribute)) {
                if (on)
                    m_legendAttributes |= attribute;
                else
                    m_legendAttributes &= ~attribute;

                updateLegendIconSize(this);
                //alert(this.legendIconSize())
                //legendChanged();

                if (this.plot())
                    this.plot().updateLegend(this)

            }
        }

        /*!
        \return True, when attribute is enabled
        \sa setLegendAttribute()
         */
        this.testLegendAttribute = function (attribute) {
            return (m_legendAttributes & attribute);
        }

        this.legendAttributes = function () {
            return m_legendAttributes;
        }

        /*!
        \brief Assign a symbol

        The curve will take the ownership of the symbol, hence the previously
        set symbol will be delete by setting a new one. If \p symbol is
        \c NULL no symbol will be drawn.

        \param symbol Symbol
        \sa symbol()
         */
        this.setSymbol = function (symbol) {

            if (symbol !== m_symbol) {
                m_symbol = symbol;

                updateLegendIconSize(this);

                this.legendChanged();
                this.itemChanged();
            }
        }

        /*!
        \return Current symbol or NULL, when no symbol has been assigned
        \sa setSymbol()
         */
        this.symbol = function () {
            return m_symbol;
        }

        this.setBrush = function (brush) {
            if (typeof(brush) == "string")
                brush = new Misc.Brush(brush)
                    //if(!m_brush.isEqual(brush)){
                    m_brush = brush;
            this.legendChanged();
            this.itemChanged();
            // }

        }

        this.brush = function () {
            return m_brush;
        }

        this.setPen = function (pen) {
            if (typeof(pen) !== "object")
                return
                //if(!m_pen.isEqual(pen)){
                m_pen = pen;
            this.legendChanged();
            this.itemChanged();
            //}
        }

        this.pen = function () {
            return m_pen;
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
        Initialize data with an array of points.

        \param samples Vector of points
        \note QVector is implicitly shared
        \note QPolygonF is derived from QVector<QPointF>
         */
        this.setSamples = function (samples) {
            this.setData(new PointSeriesData(samples));
        }

        /*!
        Specify an attribute for drawing the curve

        \param attribute Curve attribute
        \param on On/Off

        /sa testCurveAttribute(), setCurveFitter()
         */
        this.setCurveAttribute = function (attribute, on) {
            if (typeof(on) === "undefined")
                on = true;
            if ((c_attributes & attribute) == on)
                return;

            if (on)
                c_attributes |= attribute;
            else
                c_attributes &= ~attribute;

            this.itemChanged();
        }

        /*!
        \return true, if attribute is enabled
        \sa setCurveAttribute()
         */
        this.testCurveAttribute = function (attribute) {
            return c_attributes & attribute;
        }

        //! Initialize internal members
        this.init = function () {
            this.setItemAttribute(Legend, true);
            this.setItemAttribute(AutoScale, true);

            this.setData(new PointSeriesData());
            this.setCurveAttribute(Fitted, true);

            this.setZ(20.0);
        }

        /*!
        Set the curve's drawing style

        \param style Curve style
        \sa style()
         */
        this.setStyle = function (style) {
            if (style != m_style) {
                m_style = style;
                this.legendChanged();
                this.itemChanged();
            }

        }

        /*!
        \return Style of the curve
        \sa setStyle()
         */
        this.style = function () {
            return m_style;
        }

        /*!
        Draw an interval of the curve

        \param painter Painter
        \param xMap Maps x-values into pixel coordinates.
        \param yMap Maps y-values into pixel coordinates.
        \param canvasRect Contents rectangle of the canvas
        \param from Index of the first point to be painted
        \param to Index of the last point to be painted. If to < 0 the
        curve will be painted to its last point.

        \sa drawCurve(), drawSymbols(),
         */
        this.drawSeries = function (xMap, yMap, from, to) {

            var ctx = this.getContext();

            var painter = new PaintUtil.Painter(ctx);
            // painter.setPen(m_pen);
            // painter.setBrush(m_brush);
            var numSamples = this.dataSize();

            if (numSamples <= 0)
                return;

            //        if ( typeof(from) == "undefined" )
            //            from = 0;

            //        if ( typeof(to) == "undefined" )
            //            to = numSamples - 1;
            if (to < 0)
                to = numSamples - 1;

            //alert(from)

            if (Utility.mVerifyRange(numSamples, from, to) > 0) {
                painter.save();
                painter.setPen(m_pen);
                painter.setBrush(m_brush);
                //painter->setPen( d_data->pen );

                /*
                Qt 4.0.0 is slow when drawing lines, but it's even
                slower when the painter has a brush. So we don't
                set the brush before we really need it.
                 */

                this.drawCurve(painter, m_style, xMap, yMap, from, to);
                painter.restore();

                if (m_symbol && (m_symbol.style() !== NoSymbol)) {

                    painter.save();
                    painter.setPen(m_symbol.pen());
                    painter.setBrush(m_symbol.brush());
                    this.drawSymbols(ctx, m_symbol, xMap, yMap, from, to);
                    painter.restore();
                }
            }
            painter = null
        }

        /*!
        Draw symbols

        \param painter Painter
        \param symbol Curve symbol
        \param xMap x map
        \param yMap y map
        \param canvasRect Contents rectangle of the canvas
        \param from Index of the first point to be painted
        \param to Index of the last point to be painted

        \sa setSymbol(), drawSeries(), drawCurve()
         */
        this.drawSymbols = function (ctx, symbol, xMap, yMap, from, to) {
            var mapper = new PointMapper();
            //mapper.setFlag( QwtPointMapper::RoundPoints,  QwtPainter::roundingAlignment( painter ) );
            mapper.setFlag(WeedOutPoints, this.testPaintAttribute(FilterPoints));
            //mapper.setBoundingRect( canvasRect );

            var chunkSize = 500;

            //var ctx = this.getContext();
            for (var i = from; i <= to; i += chunkSize) {
                var n = Math.min(chunkSize, to - i + 1);

                var points = mapper.toPointsF(xMap, yMap, this.data(), i, i + n - 1);

                if (points.length > 0)
                    symbol.drawSymbols(ctx, points);
            }
        }

        /*!
        \brief Set the value of the baseline

        The baseline is needed for filling the curve with a brush or
        the Sticks drawing style.

        The interpretation of the baseline depends on the orientation().
        With Qt::Horizontal, the baseline is interpreted as a horizontal line
        at y = baseline(), with Qt::Vertical, it is interpreted as a vertical
        line at x = baseline().

        The default value is 0.0.

        \param value Value of the baseline
        \sa baseline(), setBrush(), setStyle(), QwtPlotAbstractSeriesItem::orientation()
         */
        this.setBaseline = function (value) {
            if (m_baseline != value) {
                m_baseline = value;
                this.itemChanged();
            }
        }

        /*!
        \return Value of the baseline
        \sa setBaseline()
         */
        this.baseline = function () {
            return m_baseline;
        }

        /*!
        \brief Draw the line part (without symbols) of a curve interval.
        \param painter Painter
        \param style curve style, see QwtPlotCurve::CurveStyle
        \param xMap x map
        \param yMap y map
        \param canvasRect Contents rectangle of the canvas
        \param from index of the first point to be painted
        \param to index of the last point to be painted
        \sa draw(), drawDots(), drawLines(), drawSteps(), drawSticks()
         */
        this.drawCurve = function (painter, style, xMap, yMap, from, to) {
            switch (style) {
            case Lines:
                if (this.testCurveAttribute(Fitted)) {

                    // we always need the complete
                    // curve for fitting
                    from = 0;
                    to = this.dataSize() - 1;
                }
                this.drawLines(painter, xMap, yMap, from, to);
                break;
            case Sticks:
                this.drawSticks(painter, xMap, yMap, from, to);
                break;
            case Steps:
                this.drawSteps(painter, xMap, yMap, from, to);
                break;
            case Dots:
                this.drawDots(painter, xMap, yMap, from, to);
                break;
            case NoCurve:
            default:
                break;
            }
        }

        /*!
        \brief Draw lines

        If the CurveAttribute Fitted is enabled a QwtCurveFitter tries
        to interpolate/smooth the curve, before it is painted.

        \param painter Painter
        \param xMap x map
        \param yMap y map
        \param canvasRect Contents rectangle of the canvas
        \param from index of the first point to be painted
        \param to index of the last point to be painted

        \sa setCurveAttribute(), setCurveFitter(), draw(),
        drawLines(), drawDots(), drawSteps(), drawSticks()
         */
        this.drawLines = function (painter, xMap, yMap, from, to) {
            if (from > to)
                return;

            //const bool doAlign = QwtPainter::roundingAlignment( painter );
            var doFit = (c_attributes & Fitted) && m_curveFitter;
            var doFill = m_brush.color !== Static.NoBrush ? true : false;
            //alert(doFill)

            //        QRectF clipRect;
            //        if ( d_data->paintAttributes & ClipPolygons )
            //        {
            //            qreal pw = qMax( qreal( 1.0 ), painter->pen().widthF());
            //            clipRect = canvasRect.adjusted(-pw, -pw, pw, pw);
            //        }

            var doIntegers = false;

            //        const bool noDuplicates = d_data->paintAttributes & FilterPoints;


            var mapper = new PointMapper;
            //mapper.setFlag( QwtPointMapper::RoundPoints, doAlign );
            //mapper.setFlag( QwtPointMapper::WeedOutPoints, noDuplicates );
            //mapper.setBoundingRect( canvasRect );


            //alert(443)
            var polyline = mapper.toPolygonF(xMap, yMap, this.data(), from, to);
            //alert(444)

            if (doFit) {
                //console.log(44)
                polyline = m_curveFitter.fitCurve(polyline);
            }

            //console.log(polyline)


            painter.drawPolyline(polyline);
            if (doFill) {
                this.fillCurve(painter, xMap, yMap, polyline);
            }

        }

        /*!
        Assign a curve fitter

        The curve fitter "smooths" the curve points, when the Fitted
        CurveAttribute is set. setCurveFitter(NULL) also disables curve fitting.

        The curve fitter operates on the translated points ( = widget coordinates)
        to be functional for logarithmic scales. Obviously this is less performant
        for fitting algorithms, that reduce the number of points.

        For situations, where curve fitting is used to improve the performance
        of painting huge series of points it might be better to execute the fitter
        on the curve points once and to cache the result in the QwtSeriesData object.

        \param curveFitter() Curve fitter
        \sa Fitted
         */
        this.setCurveFitter = function (curveFitter) {
            //m_curveFitter = 0;
            m_curveFitter = curveFitter;

            this.itemChanged();
        }

        /*!
        Get the curve fitter. If curve fitting is disabled NULL is returned.

        \return Curve fitter
        \sa setCurveFitter(), Fitted
         */
        this.curveFitter = function () {
            return m_curveFitter;
        }

        function qwtSqr(x) {
            return x * x;
        }

        ///////////////////////////////
        /*!
        Find the closest curve point for a specific position

        \param pos Position, where to look for the closest curve point
        \param dist If dist != NULL, closestPoint() returns the distance between
        the position and the closest curve point
        \return Index of the closest curve point, or -1 if none can be found
        ( f.e when the curve has no points )
        \note closestPoint() implements a dumb algorithm, that iterates
        over all points
         */
        this.closestPoint = function (/* const QPoint & */ pos, /* double * */ dist) {
            let numSamples = this.dataSize();

            if (this.plot() == null || numSamples <= 0)
                return -1;

            let series = this.data();

            let xMap = this.plot().canvasMap(this.xAxis());
            let yMap = this.plot().canvasMap(this.yAxis());

            let index = -1;
            let dmin = 1.0e10;

            for (var i = 0; i < numSamples; i++) {
                let sample = series.sample(i);

                let cx = xMap.transform(sample.x) - pos.x;
                let cy = yMap.transform(sample.y) - pos.y;

                /* let cx = sample.x  - pos.x;
                let cy = sample.y  - pos.y; */

                let f = qwtSqr(cx) + qwtSqr(cy);
                if (f < dmin) {
                    index = i;
                    dmin = f;
                }
            }
            if (dist)
                dist.distance = Math.sqrt(dmin);

            return index;
        }
        /////////////////////////////////


        /*!
        Fill the area between the curve and the baseline with
        the curve brush

        \param painter Painter
        \param xMap x map
        \param yMap y map
        \param canvasRect Contents rectangle of the canvas
        \param polygon Polygon - will be modified !

        \sa setBrush(), setBaseline(), setStyle()
         */
        this.fillCurve = function (painter, xMap, yMap, polygon) {
            if (m_brush.color == Static.NoBrush)
                return;

            //alert(polygon.length)
            this.closePolyline(xMap, yMap, polygon);
            if (polygon.length <= 2) // a line can't be filled
                return;

            //alert(polygon.length)

            //if ( d_data->paintAttributes & ClipPolygons )
            //polygon = QwtClipper::clipPolygonF( canvasRect, polygon, true );

            painter.setPen(new Misc.Pen(m_brush.color))
            painter.drawPolygon(polygon)

            //painter->restore();
        }

        /*!
        \brief Complete a polygon to be a closed polygon including the
        area between the original polygon and the baseline.

        \param painter Painter
        \param xMap X map
        \param yMap Y map
        \param polygon Polygon to be completed
         */
        this.closePolyline = function (xMap, yMap, polygon) {
            if (polygon.length < 2)
                return;

            //const bool doAlign = QwtPainter::roundingAlignment( painter );

            var baseline = m_baseline;

            if (this.orientation() == Vertical) {
                if (yMap.transformation())
                    baseline = yMap.transformation().bounded(baseline);

                var refY = yMap.transform(baseline);
                //if ( doAlign )
                //refY = qRound( refY );

                //polygon.push({x:polygon[polygon.length -1].x, y:refY} );
                //polygon.push( {x:polygon[0].x, y:refY} );
                polygon.push(new Misc.Point(polygon[polygon.length - 1].x, refY));
                polygon.push(new Misc.Point(polygon[0].x, refY));
            } else {
                if (xMap.transformation())
                    baseline = xMap.transformation().bounded(baseline);

                var refX = xMap.transform(baseline);
                //if ( doAlign )
                //refX = qRound( refX );

                //polygon.push( {x:refX, y:polygon[polygon.length -1].y} );
                //polygon.push( {x:refX, y:polygon[0].y} );
                polygon.push(new Misc.Point(refX, polygon[polygon.length - 1].y));
                polygon.push(new Misc.Point(refX, polygon[0].y));
            }
        }

        /*!
        Draw step function

        The direction of the steps depends on Inverted attribute.

        \param painter Painter
        \param xMap x map
        \param yMap y map
        \param canvasRect Contents rectangle of the canvas
        \param from index of the first point to be painted
        \param to index of the last point to be painted

        \sa CurveAttribute, setCurveAttribute(),
        draw(), drawCurve(), drawDots(), drawLines(), drawSticks()
         */
        this.drawSteps = function (painter, xMap, yMap, from, to) {

            //const bool doAlign = QwtPainter::roundingAlignment( painter );

            //QPolygonF polygon( 2 * ( to - from ) + 1 );
            //alert(from+", "+to)
            var points = [];
            var sz = 2 * (to - from) + 1;
            for (var i = 0; i < sz; ++i)
                //points.push({x:0,y:0})
                points.push(new Misc.Point())

                //alert(points.length)


                var inverted = this.orientation() == Vertical;
            if (c_attributes & Inverted)
                inverted = !inverted;

            var series = this.data();

            var i,
            ip;
            for (i = from, ip = 0; i <= to; i++, ip += 2) {
                var sample = series.sample(i);

                var xi = xMap.transform(sample.x);
                var yi = yMap.transform(sample.y);
                //            if ( doAlign )
                //            {
                //                xi = Math.round( xi );
                //                yi = Math.round( yi );
                //            }

                if (ip > 0) {
                    var p0 = points[ip - 2];
                    var p = points[ip - 1];

                    if (inverted) {
                        p.x = p0.x;
                        p.y = yi;
                    } else {
                        p.x = xi;
                        p.y = p0.y;
                    }
                }

                points[ip].x = xi;
                points[ip].y = yi;
            }
            //alert(points)
            //        if ( d_data->paintAttributes & ClipPolygons )
            //        {
            //            const QPolygonF clipped = QwtClipper::clipPolygonF(
            //                canvasRect, polygon, false );

            //            QwtPainter::drawPolyline( painter, clipped );
            //        }
            //        else
            //        {

            painter.drawPolyline(points);
            //}

            //        if ( d_data->brush.style() != Qt::NoBrush )
            //            fillCurve( painter, xMap, yMap, canvasRect, polygon );
        }

        /*!
        Draw sticks

        \param painter Painter
        \param xMap x map
        \param yMap y map
        \param canvasRect Contents rectangle of the canvas
        \param from index of the first point to be painted
        \param to index of the last point to be painted

        \sa draw(), drawCurve(), drawDots(), drawLines(), drawSteps()
         */
        this.drawSticks = function (painter, xMap, yMap, from, to) {
            //alert(45)
            //painter->save();
            //painter->setRenderHint( QPainter::Antialiasing, false );

            //const bool doAlign = QwtPainter::roundingAlignment( painter );
            //m_baseline = -100;

            var x0 = xMap.transform(m_baseline);
            var y0 = yMap.transform(m_baseline);
            //        if ( doAlign )
            //        {
            //            x0 = qRound( x0 );
            //            y0 = qRound( y0 );
            //        }

            var o = this.orientation();

            var series = this.data();

            //var penWidth = 1;
            //var penColor  = "#ff0000";
            //ctx.strokeStyle = penColor;///////////
            //ctx.beginPath();

            for (var i = from; i <= to; i++) {
                var sample = series.sample(i);
                var xi = xMap.transform(sample.x);
                var yi = yMap.transform(sample.y);
                //            if ( doAlign )
                //            {
                //                xi = qRound( xi );
                //                yi = qRound( yi );
                //            }

                if (o == Horizontal)
                    //ctx.moveTo(x0, yi);
                    painter.drawLine(x0, yi, xi, yi);
                else
                    //ctx.moveTo(xi, y0);
                    painter.drawLine(xi, y0, xi, yi);
                //ctx.lineTo(xi, yi);


            }

            //ctx.stroke();
            //ctx.closePath();


        }

        /*!
        Draw dots

        \param painter Painter
        \param xMap x map
        \param yMap y map
        \param canvasRect Contents rectangle of the canvas
        \param from index of the first point to be painted
        \param to index of the last point to be painted

        \sa draw(), drawCurve(), drawSticks(), drawLines(), drawSteps()
         */
        this.drawDots = function (painter, xMap, yMap, from, to) {
            //TODO
            /*var penWidth = 1;
            var penColor  = "#ff0000";
            //var ctx = this.getContext();
            ctx.fillStyle = penColor;///////////

             */

            //ctx.beginPath();

            //const QColor color = painter->pen().color();

            //if ( painter->pen().style() == Qt::NoPen || color.alpha() == 0 )
            //{
            //return;
            //}

            //const bool doFill = ( d_data->brush.style() != Qt::NoBrush )
            // && ( d_data->brush.color().alpha() > 0 );
            //const bool doAlign = QwtPainter::roundingAlignment( painter );

            var mapper = new PointMapper;
            //mapper.setBoundingRect( canvasRect );
            //mapper.setFlag( QwtPointMapper::RoundPoints, doAlign );

            if (m_paintAttributes & FilterPoints) {
                mapper.setFlag(WeedOutPoints, true);
            }

            /*if ( doFill ){
            mapper.setFlag( WeedOutPoints, false );

            var points = mapper.toPointsF( xMap, yMap, data(), from, to );

            this.drawPoints( painter, points );
            //fillCurve( painter, xMap, yMap, canvasRect, points );
            }*/

            /*else*/
            if (m_paintAttributes & MinimizeMemory) {
                var series = this.data();

                for (var i = from; i <= to; i++) {

                    var sample = series.sample(i);

                    var xi = xMap.transform(sample.x);
                    var yi = yMap.transform(sample.y);

                    /*if ( doAlign ){
                    xi = qRound( xi );
                    yi = qRound( yi );
                    }*/

                    //this.drawPoint(ctx, {x:xi, y:yi});
                    //this.drawPoint(ctx, new Point(xi, yi));
                    painter.drawPoint(new Misc.Point(xi, yi));

                }

                //ctx.closePath();
            } else {
                var points = mapper.toPointsF(xMap, yMap, this.data(), from, to);
                //alert(points)

                //this.drawPoints(ctx, points );
                painter.drawPoints(points);
            }
        }

        /*!
        \return Icon representing the curve on the legend

        \param index Index of the legend entry
        ( ignored as there is only one )
        \param size Icon size

        \sa QwtPlotItem::setLegendIconSize(), QwtPlotItem::legendData()
         */
        this.legendIcon = function (index, size) {
            //Q_UNUSED( index );

            //alert(size)

            if (size.width === 0 && size.height === 0)
                return null;

            var graphic = new GraphicUtil.Graphic(null, size.width, size.height);

            //graphic.setDefaultSize( size );
            //graphic.setRenderHint( QwtGraphic::RenderPensUnscaled, true );

            //QPainter painter( &graphic );
            //painter.setRenderHint( QPainter::Antialiasing,
            // testRenderHint( QwtPlotItem::RenderAntialiased ) );
            var painter = new PaintUtil.Painter(graphic);

            if (this.legendAttributes() == 0 || this.legendAttributes() & Static.LegendShowBrush) {
                var brush = this.brush();

                if (brush.color == Static.NoBrush && this.legendAttributes() == 0) {
                    if (this.style() != NoCurve) {
                        brush = new Misc.Brush(this.pen().color);

                    } else if (this.symbol() && (this.symbol().style() != NoSymbol)) {
                        brush = new Misc.Brush(this.symbol().pen().color);
                    }
                }
                if (brush.color != Static.NoBrush) {
                    var r = new Misc.Rect(0, 0, size.width, size.height);
                    painter.fillRect(r, brush);
                    //graphic.setParent($("#demo"))
                }
            }

            if (this.legendAttributes() & Static.LegendShowLine) {
                if (this.pen().color != Static.NoPen) {
                    var pn = this.pen();
                    //pn.setCapStyle( Qt::FlatCap );

                    painter.setPen(pn);

                    var y = 0.5 * size.height;
                    painter.drawLine(0.0, y, size.width, y);

                }

            }

            if (this.legendAttributes() & Static.LegendShowSymbol) {
                if (this.symbol()) {
                    var sh = size.height / 2 + 1;
                    if (this.symbol().style() == Ellipse)
                        sh -= 1;
                    //painter.pen().width = this.symbol().pen().width
                    //console.log(painter.pen().width)
                    painter.setPen(this.symbol().pen());
                    this.symbol().drawGraphicSymbol(painter, new Misc.Point(size.width / 2, sh), size);
                }
            }
            painter = null;
            return graphic;
        }
		

        this.removePoint = function (point, always) {
            if (always == undefined)
                always = false;
            //console.log("Remove: curve found")
            var samples = this.data().samples();
            if (samples.length == 1 && !always) {
                Static.alert("You cannot remove the only point in the curve. Remove the entire curve.")
                return;
            }
            var newSamples = [];
            //var x = point.x;
            //var y = point.y;
            for (var i = 0; i < samples.length; ++i) {
                //if (samples[i].x == x && samples[i].y == y)
                if (samples[i].isEqual(point))
                    continue;
                newSamples.push(samples[i])
            }
            if (newSamples.length === samples.length && !always) {
                Static.alert("The point selected for removal does not exist.")
                return;
            }
            this.setSamples(newSamples);
            //console.log(newSamples)
            //obj11.plot.replot();
            this.itemChanged();
            Static.trigger("pointRemoved", this);

        }

        this.toString = function () {
            return '[Curve]';
        }

        this.init();
    }
}
/////////////////////////////////////////////////////end
