'use strict';
//////////////////////////PlotShapeItem////////////start
//PlotShapeItem.inheritsFrom(PlotItem);
//function PlotShapeItem() {
class PlotShapeItem extends PlotItem {
    constructor() {
        super("Shape")
        //PlotItem.call(this, "Shape");

        var m_renderTolerance = 0.0;
        //var m_boundingRect = PlotItem.prototype.boundingRect.call(this);
        var m_boundingRect = super.boundingRect();

        var m_pen = new Misc.Pen("black", 1, Static.NoPen);

        var m_brush = new Misc.Brush("darkGray");
        var m_shape = new Misc.MPath;

        this.setItemAttribute(AutoScale, true);
        this.setItemAttribute(Legend, false);

        this.setZ(8.0);

        this.rtti = Static.Rtti_PlotShape;

        this.getBoundingRect = function () {
            return m_boundingRect;
        }

        /*!
        \brief Set a path built from a rectangle

        \param rect Rectangle
        \sa setShape(), setPolygon(), shape()
         */
        this.setRect = function (rect) {
            var path = new Misc.MPath;
            path.addRect(rect);
            this.setShape(path);
        }

        /*!
        \brief Set a path built from a polygon

        \param polygon Polygon
        \sa setShape(), setRect(), shape()
         */
        this.setPolygon = function (polygon) {
            var shape = new Misc.MPath;
            shape.addPolygon(polygon);
            this.setShape(shape);
        }

        /*!
        \brief Set the shape to be displayed

        \param shape Shape
        \sa setShape(), shape()
         */
        this.setShape = function (shape) {
            //if ( shape != m_shape )
            {
                m_shape = shape;

                if (shape.isEmpty()) {
                    m_boundingRect = PlotItem.prototype.boundingRect.call(this);
                } else {

                    m_boundingRect = m_shape.boundingRect();

                }

                //itemChanged();
            }
        }

        this.setBrush = function (brush) {
            m_brush = brush;
            this.itemChanged();
        }

        this.brush = function () {
            return m_brush;
        }

        this.setPen = function (pen) {
            m_pen = pen;
            this.itemChanged();
        }

        this.pen = function () {
            return m_pen;
        }

        /*!
        Draw the shape item

        \param painter Painter
        \param xMap X-Scale Map
        \param yMap Y-Scale Map
        \param canvasRect Contents rect of the plot canvas
         */
        this.draw = function (xMap, yMap) {
            //start with a clean canvas
            this.clearCanvas();
            if (m_shape.isEmpty())
                return;

            if (m_pen.style == Static.NoPen && m_brush == Static.NoBrush) {
                return;
            }

            var canvasRect = this.getCanvasRect();
            //alert(canvasRect)
            var cRect = Static.mInvTransform(xMap, yMap, canvasRect);
            if (m_boundingRect.intersects(cRect)) {
                //alert(11)
                var ctx = this.getContext();
                var doAlign = false; //QwtPainter::roundingAlignment( painter );

                var path = Static.mTransformPath(xMap, yMap, m_shape, doAlign);

                /*if ( testPaintAttribute( QwtPlotShapeItem::ClipPolygons ) ){
                qreal pw = qMax( qreal( 1.0 ), painter->pen().widthF());
                QRectF clipRect = canvasRect.adjusted( -pw, -pw, pw, pw );

                QPainterPath clippedPath;
                clippedPath.setFillRule( path.fillRule() );

                const QList<QPolygonF> polygons = path.toSubpathPolygons();
                for ( int i = 0; i < polygons.size(); i++ ){
                const QPolygonF p = QwtClipper::clipPolygonF(
                clipRect, polygons[i], true );

                clippedPath.addPolygon( p );

                }

                path = clippedPath;
                }*/

                /*if ( d_data->renderTolerance > 0.0 )
            {
                QwtWeedingCurveFitter fitter( d_data->renderTolerance );

                QPainterPath fittedPath;
                fittedPath.setFillRule( path.fillRule() );

                const QList<QPolygonF> polygons = path.toSubpathPolygons();
                for ( int i = 0; i < polygons.size(); i++ )
                fittedPath.addPolygon( fitter.fitCurve( polygons[ i ] ) );

                path = fittedPath;
                }*/

                var painter = new PaintUtil.Painter(ctx);
                painter.setBrush(m_brush);
                painter.setPen(m_pen);
                painter.drawPath(path);
                painter = null;

            }
        }

        this.boundingRect = function () {
            return this.getBoundingRect();
        }
        this.toString = function () {
            return '[PlotShapeItem]';
        }
    }
}
/////////////////////////////////////////////////end
