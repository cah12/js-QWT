'use strict';

////////////////////Symbol////////////////////start
/*!
  Default Constructor
  \param style Symbol Style

  The symbol is constructed with gray interior,
  black outline with zero width, no size and style 'NoSymbol'.
*/
//const Symbol = function( style, brush, pen, size ){
class Symbol {
    constructor(style, brush, pen, size) {
        //<<<<<<<<<<<<< Helpers >>>>>>>>>>>>>>>>>>//
        function mDrawXCrossSymbols(ctx, points, symbol) {
            var size = symbol.size();
            var pen = symbol.pen();
            var brush = symbol.brush();
            var sw = size.width;
            var sh = size.height;
            ctx.beginPath();
            ctx.strokeStyle = pen.color;
            ctx.lineWidth = pen.width;

            for (var i = 0; i < points.length; i++) {
                var x = points[i].x - 0.5 * sw - 1//pen.width*0.5;
                var y = points[i].y - 0.5 * sh - 1//pen.width*0.5;

                ctx.moveTo(x, y);
                ctx.lineTo(x + sw, y + sh);
                ctx.moveTo(x + sw, y);
                ctx.lineTo(x, y + sh);

            }
            ctx.stroke();
        }

        function mDrawLineSymbols(ctx, orientations, points, symbol) {
            var size = symbol.size();
            var pen = symbol.pen();
            var brush = symbol.brush();
            var sw = size.width;
            var sh = size.height;
            var painter = new PaintUtil.Painter(ctx);
            painter.setPen(pen);

            painter.save();

            for (var i = 0; i < points.length; i++) {
                if (orientations & Static.Horizontal) {

                    var x = points[i].x - 0.5 * sw - 1//- pen.width*0.5;
                    var y = points[i].y - 1//- pen.width*0.5;
                    painter.drawLine(x, y, x + sw, y);

                }
                if (orientations & Static.Vertical) {
                    var x = points[i].x - 1//- pen.width*0.5;
                    var y = points[i].y - 0.5 * sh - 1//- pen.width*0.5;

                    painter.drawLine(x, y, x, y + sh);
                }
            }
            painter.restore();
            painter = null

        }


        function mDrawPathSymbols(ctx, points, symbol) {
            var numPoints = points.length;
            var size = symbol.size();
            var pen = symbol.pen();
            var brush = symbol.brush();
            var sw = size.width;
            var sh = size.height;
            var painter = new PaintUtil.Painter(ctx);
            painter.setPen(pen);
            painter.setBrush(brush)

            for (var i = 0; i < numPoints; i++) {
                var x = points[i].x
                var y = points[i].y
                var bRc = symbol.m_path.boundingRect()
                painter.save()
                painter.translate(x, y)
                //painter.scale(sw/bRc.width(), sh/bRc.height());  
                symbol.m_path.data.scale = Math.min(size.width / bRc.width(),
                    size.height / bRc.height())

                if (symbol.m_path.data.rotation) {
                    painter.rotate(symbol.m_path.data.rotation)
                }
                var pinpoint = symbol.pinPoint()
                //console.log(sw/bRc.width())
                painter.translate(-1 * pinpoint.x, -1 * pinpoint.y)
                //painter.scale(sw/bRc.width(), sh/bRc.height())
                painter.drawPath(symbol.m_path)
                painter.restore()

            }
            painter = null
        }


        function mDrawDiamondSymbols(ctx, points, symbol) {
            var painter = new PaintUtil.Painter(ctx);
            painter.save()
            painter.setBrush(symbol.brush());
            painter.setPen(symbol.pen());
            var sz = symbol.size()
            var rc = new Misc.Rect(new Misc.Point, symbol.size())
            var numPoints = points.length;

            for (var i = 0; i < numPoints; i++) {
                painter.save()
                painter.translate(points[i].x - 1, points[i].y - 1)
                painter.rotate(45)
                painter.drawRect(-0.5 * sz.width, -0.5 * sz.height, sz.width, sz.height);
                painter.restore()
            }
            painter.restore()
            painter = null

        }



        function mDrawRectSymbols(ctx, points, symbol) {
            var painter = new PaintUtil.Painter(ctx);
            painter.save()
            painter.setBrush(symbol.brush());
            painter.setPen(symbol.pen());
            var rc = new Misc.Rect(new Misc.Point, symbol.size())
            var numPoints = points.length;

            for (var i = 0; i < numPoints; i++) {
                rc.moveCenter(points[i]);
                //painter.drawRect(rc.left()-0.5*symbol.pen().width, rc.top()-0.5*symbol.pen().width, rc.width(), rc.height());
                painter.drawRect(rc.left(), rc.top(), rc.width(), rc.height());
            }
            painter.restore()
            painter = null

        }

        function mDrawEllipseSymbols(ctx, points, symbol) {
            var painter = new PaintUtil.Painter(ctx);
            painter.save()
            painter.setBrush(symbol.brush());
            painter.setPen(symbol.pen());
            var radius = Math.min(symbol.size().width, symbol.size().height) / 2
            var numPoints = points.length;

            for (var i = 0; i < numPoints; i++) {
                //painter.drawCircle(points[i].x-0.5*symbol.pen().width, points[i].y-0.5*symbol.pen().width, radius);
                painter.drawCircle(points[i].x - 1, points[i].y - 1, radius);

            }
            painter.restore()
            painter = null

        }

        function mDrawCrossGraphicSymbol(painter, point, size, symbol) {
            painter.setBrush(symbol.brush());
            painter.setPen(symbol.pen());
            var rc = new Misc.Rect(new Misc.Point, symbol.size())
            rc.moveCenter(point);
            painter.drawLine(rc.left() + 0.5 * rc.width(), rc.top(), rc.left() + 0.5 * rc.width(), rc.bottom());
            painter.drawLine(rc.left(), rc.top() + 0.5 * rc.height(), rc.right(), rc.top() + 0.5 * rc.height());

        }

        function mDrawXCrossGraphicSymbol(painter, point, size, symbol) {
            painter.setBrush(symbol.brush());
            painter.setPen(symbol.pen());
            var rc = new Misc.Rect(new Misc.Point, symbol.size())
            rc.moveCenter(point);
            painter.drawLine(rc.left(), rc.top(), rc.right(), rc.bottom());
            painter.drawLine(rc.right(), rc.top(), rc.left(), rc.bottom());

        }


        function mDrawRectGraphicSymbol(painter, point, size, symbol) {
            //console.log(symbol.brush().color)   
            painter.setBrush(symbol.brush());
            //var p = new Misc.Pen(symbol.pen())
            //if(symbol.brush1()) //allow the brush to go to the center line of the pen. This is consistent with symbol on curve.
            //p.width /= 2;
            //painter.setPen( p)//symbol.pen() );
            var rc = new Misc.Rect(new Misc.Point, symbol.size())
            rc.moveCenter(point);
            painter.drawRect(rc.left(), rc.top(), rc.width(), rc.height());

        }

        function mDrawDiamondGraphicSymbol(painter, point, size, symbol) {
            painter.setBrush(symbol.brush());
            //painter.setPen( symbol.pen() );
            var rc = new Misc.Rect(new Misc.Point,
                symbol.size().width * 0.707, symbol.size().height * 0.707)
            rc.moveCenter(point);
            painter.drawRect(rc.left(), rc.top(), rc.width(), rc.height());
            painter.transform({ rotation: 45, rotationX: point.x, rotationY: point.y })
        }

        function mDrawEllipseGraphicSymbol(painter, point, size, symbol) {
            painter.setBrush(symbol.brush());
            //painter.setPen( symbol.pen() );
            var radius = Math.min(symbol.size().width - symbol.pen().width, symbol.size().height - symbol.pen().width) / 2 //- symbol.pen().width
            painter.drawCircle(point.x, point.y, radius)

        }


        function mDrawPathGraphicSymbol(painter, point, iconSize, symbol) {
            var pen = symbol.pen()
            var pw = 0.0;
            if (pen.style !== Static.NoPen)
                pw = Math.max(pen.width, 1.0);
            var rc = symbol.path().boundingRect();
            rc = rc.adjusted(-pw, -pw, pw, pw)
            var data = symbol.path().data
            data.xOffset = -1 * rc.left()
            data.yOffset = -1 * rc.top()
            data.xCenter = (rc.right() - rc.left()) / 2
            data.yCenter = (rc.bottom() - rc.top()) / 2
            painter.setBrush(symbol.brush());
            painter.setPen(symbol.pen());

            //painter.scale(iconSize.width/rc.width(), iconSize.height/rc.height()) 
            data.scale = Math.min(iconSize.width / rc.width(),
                iconSize.height / rc.height())

            //symbol.path().data = data
            painter.drawPath(symbol.path());

        }




        //super()
        var m_style = Symbol.Style.NoSymbol;
        var m_size = new Misc.Size(-1, -1);//{width:-1, height: -1};//invalid size
        //var m_size = new Misc.Size(10, 10);//default size
        var m_brush = new Misc.Brush("gray");
        var m_pen = new Misc.Pen;//{color:"black", width:1, style:"solid"};
        var m_isPinPointEnabled = false;
        this.m_path = 0

        var m_pinpoint = new Misc.Point(0, 0)

        if (typeof (size) !== "undefined") {
            m_style = style;
            m_brush = brush;
            m_pen = pen;
            m_size = size;
        }
        else if (typeof (pen) !== "undefined") {
            m_style = style;
            m_brush = brush;
            m_pen = pen;
        }
        else if (typeof (brush) !== "undefined") {
            m_style = style;
            m_brush = brush;
        }
        else if (typeof (style) !== "undefined") {
            m_style = style;
        }

        this.setPinPoint = function (pt) {
            m_pinpoint = pt;
        }

        this.pinPoint = function (pt) {
            return m_pinpoint;
        }

        /*!
           Set the symbol's size
           \param size Size
    
           \sa size()
        */
        this.setSize = function (size) {
            if (size.isValid() && !size.isEqual(m_size)) {
                m_size = size;
                //invalidateCache();
            }
        }

        /*!
           \return Size
           \sa setSize()
        */
        this.size = function () {
            return m_size;
        }

        /*!
          Specify the symbol style
    
          \param style Style
          \sa style()
        */
        this.setStyle = function (style) {
            if (m_style != style) {
                m_style = style;
                //invalidateCache();
            }
        }

        /*!
          \return Current symbol style
          \sa setStyle()
        */
        this.style = function () {
            return m_style;
        }

        /*!
          \brief Set a painter path as symbol
    
          The symbol is represented by a painter path, where the 
          origin ( 0, 0 ) of the path coordinate system is mapped to
          the position of the symbol.
    
          When the symbol has valid size the painter path gets scaled
          to fit into the size. Otherwise the symbol size depends on
          the bounding rectangle of the path.
    
          \note The style is implicitely set to QwtSymbol::Path.
          \sa path(), setSize()
         */
        this.setPath = function (path) {
            m_style = Symbol.Style.Path;
            // d_data->path.path = path;
            // d_data->path.graphic.reset();
            this.m_path = path;
        }

        /*!
           \return Painter path for displaying the symbol
           \sa setPath()
        */
        this.path = function () {
            return this.m_path;
        }


        this.setPen = function (pen) {
            //if ( brush != m_brush )
            {
                m_pen = pen;

            }
        }
        this.pen = function () {
            return m_pen;
        }

        /*!
          \brief Assign a brush
    
          The brush is used to draw the interior of the symbol.
          \param brush Brush
    
          \sa brush()
        */
        this.setBrush = function (brush) {
            // if ( brush != m_brush )
            {
                m_brush = brush;
                //invalidateCache();

                if (m_style == Symbol.Style.Path)
                    ;//d_data->path.graphic.reset();
            }
        }

        /*!
          \return Brush
          \sa setBrush()
        */
        this.brush = function () {
            return m_brush;
        }

        this.brush1 = function () {
            return (m_brush.color !== "noBrush");
        }

        /*!
          Render an array of symbols
    
          Painting several symbols is more effective than drawing symbols
          one by one, as a couple of layout calculations and setting of pen/brush
          can be done once for the complete array.
    
          \param painter Painter
          \param points Array of points
          \param numPoints Number of points
        */
        this.drawSymbols = function (ctx, points) {
            if (points.length <= 0)
                return;

            var useCache = false;

            //alert("drawSymbols: here")

            // Don't use the pixmap, when the paint device
            // could generate scalable vectors

            //        if ( QwtPainter::roundingAlignment( painter ) &&  !painter->transform().isScaling() )
            //        {
            //            if ( d_data->cache.policy == QwtSymbol::Cache )
            //            {
            //                useCache = true;
            //            }
            //            else if ( d_data->cache.policy == QwtSymbol::AutoCache )
            //            {
            //                if ( painter->paintEngine()->type() == QPaintEngine::Raster )
            //                {
            //                    useCache = true;
            //                }
            //                else
            //                {
            //                    switch( d_data->style )
            //                    {
            //                        case QwtSymbol::XCross:
            //                        case QwtSymbol::HLine:
            //                        case QwtSymbol::VLine:
            //                        case QwtSymbol::Cross:
            //                            break;

            //                        case QwtSymbol::Pixmap:
            //                        {
            //                            if ( !d_data->size.isEmpty() &&
            //                                d_data->size != d_data->pixmap.pixmap.size() )
            //                            {
            //                                useCache = true;
            //                            }
            //                            break;
            //                        }
            //                        default:
            //                            useCache = true;
            //                    }
            //                }
            //            }
            //        }

            if (useCache) {
                //var br = this.boundingRect();/////////////////////

                //var rect = {left:0, top:0, width:br.width(), height:br.height() };

                //            if ( d_data->cache.pixmap.isNull() )
                //            {
                //                d_data->cache.pixmap = QwtPainter::backingStore( NULL, br.size() );
                //                d_data->cache.pixmap.fill( Qt::transparent );

                //                QPainter p( &d_data->cache.pixmap );
                //                p.setRenderHints( painter->renderHints() );
                //                p.translate( -br.top()Left() );

                //                const QPointF pos;
                //                renderSymbols( &p, &pos, 1 );
                //            }

                var dx = br.left();
                var dy = br.top();

                for (var i = 0; i < numPoints; i++) {
                    var left = Math.round(points[i].x) + dx;
                    var top = Math.round(points[i].y) + dy;

                    //painter->drawPixmap( left, top, d_data->cache.pixmap );
                }
            }
            else {
                //painter->save();

                this.renderSymbols(ctx, points);
                //painter->restore();
            }
        }

        this.drawGraphicSymbol = function (painter, pos, size) {

            this.renderGraphicSymbol(painter, pos, size)
        }

        this.drawSymbol = function (ctx, pos) {
            this.drawSymbols(ctx, [pos]);
        }

        /*!
          Render the symbol to series of points
    
          \param painter Qt painter
          \param points Positions of the symbols
          \param numPoints Number of points
         */
        this.renderSymbols = function (ctx, points) {
            var numPoints = points.length;

            switch (m_style) {
                case Symbol.Style.Ellipse:
                    {

                        mDrawEllipseSymbols(ctx, points, this);
                        break;
                    }
                case Symbol.Style.MRect:
                    {
                        mDrawRectSymbols(ctx, points, this);
                        break;
                    }
                case Symbol.Style.Diamond:
                    {
                        mDrawDiamondSymbols(ctx, points, this);
                        break;
                    }
                case Symbol.Style.Cross:
                    {
                        mDrawLineSymbols(ctx, Static.Horizontal | Static.Vertical, points, this);
                        break;
                    }
                case Symbol.Style.XCross:
                    {
                        mDrawXCrossSymbols(ctx, points, this);
                        break;
                    }
                //            case QwtSymbol::Triangle:
                //            case QwtSymbol::UTriangle:
                //            {
                //                qwtDrawTriangleSymbols( painter, QwtTriangle::Up,
                //                    points, numPoints, *this );
                //                break;
                //            }
                //            case QwtSymbol::DTriangle:
                //            {
                //                qwtDrawTriangleSymbols( painter, QwtTriangle::Down,
                //                    points, numPoints, *this );
                //                break;
                //            }
                //            case QwtSymbol::RTriangle:
                //            {
                //                qwtDrawTriangleSymbols( painter, QwtTriangle::Right,
                //                    points, numPoints, *this );
                //                break;
                //            }
                //            case QwtSymbol::LTriangle:
                //            {
                //                qwtDrawTriangleSymbols( painter, QwtTriangle::Left,
                //                    points, numPoints, *this );
                //                break;
                //            }
                case Symbol.Style.HLine:
                    {
                        mDrawLineSymbols(ctx, Static.Horizontal, points, this);
                        break;
                    }
                case Symbol.Style.VLine:
                    {
                        mDrawLineSymbols(ctx, Static.Vertical, points, this);
                        break;
                    }
                //            case QwtSymbol::Star1:
                //            {
                //                qwtDrawStar1Symbols( painter, points, numPoints, *this );
                //                break;
                //            }
                //            case QwtSymbol::Star2:
                //            {
                //                qwtDrawStar2Symbols( painter, points, numPoints, *this );
                //                break;
                //            }
                //            case QwtSymbol::Hexagon:
                //            {
                //                qwtDrawHexagonSymbols( painter, points, numPoints, *this );
                //                break;
                //            }
                case Symbol.Style.Path:
                    {
                        // if ( d_data->path.graphic.isNull() )
                        // {
                        //     d_data->path.graphic = qwtPathGraphic( d_data->path.path,
                        //         d_data->pen, d_data->brush );
                        // }

                        // qwtDrawGraphicSymbols( painter, points, numPoints,
                        //     d_data->path.graphic, *this );
                        mDrawPathSymbols(ctx, points, this);
                        break;
                    }
                //            case QwtSymbol::Pixmap:
                //            {
                //                qwtDrawPixmapSymbols( painter, points, numPoints, *this );
                //                break;
                //            }
                //            case QwtSymbol::Graphic:
                //            {
                //                qwtDrawGraphicSymbols( painter, points, numPoints,
                //                    d_data->graphic.graphic, *this );
                //                break;
                //            }
                //            case QwtSymbol::SvgDocument:
                //            {
                //    #ifndef QWT_NO_SVG
                //                qwtDrawSvgSymbols( painter, points, numPoints,
                //                    d_data->svg.renderer, *this );
                //    #endif
                //                break;
                //            }
                default: ;
            }
        }


        this.renderGraphicSymbol = function (painter, point, size) {
            if (m_style !== Symbol.Style.Cross || m_style !== Symbol.Style.XCross) {
                var p = new Misc.Pen(this.pen())
                if (this.brush1()) //allow the brush to go to the center line of the pen. This is consistent with symbol on curve.
                    p.width /= 2;
                painter.setPen(p)//symbol.pen() );
            }


            switch (m_style) {
                case Symbol.Style.Ellipse:
                    {

                        // mDrawEllipseSymbols(ctx, points, this );
                        mDrawEllipseGraphicSymbol(painter, point, 0, this);
                        break;
                    }
                case Symbol.Style.MRect:
                    {
                        mDrawRectGraphicSymbol(painter, point, 0, this);
                        break;
                    }
                case Symbol.Style.Diamond:
                    {
                        //mDrawDiamondSymbols(ctx, points, this );
                        mDrawDiamondGraphicSymbol(painter, point, 0, this);
                        break;
                    }
                case Symbol.Style.Cross:
                    {
                        mDrawCrossGraphicSymbol(painter, point, 0, this);
                        break;
                    }
                case Symbol.Style.XCross:
                    {
                        //mDrawXCrossSymbols(ctx, points, this );
                        mDrawXCrossGraphicSymbol(painter, point, 0, this);
                        break;
                    }
                //            case QwtSymbol::Triangle:
                //            case QwtSymbol::UTriangle:
                //            {
                //                qwtDrawTriangleSymbols( painter, QwtTriangle::Up,
                //                    points, numPoints, *this );
                //                break;
                //            }
                //            case QwtSymbol::DTriangle:
                //            {
                //                qwtDrawTriangleSymbols( painter, QwtTriangle::Down,
                //                    points, numPoints, *this );
                //                break;
                //            }
                //            case QwtSymbol::RTriangle:
                //            {
                //                qwtDrawTriangleSymbols( painter, QwtTriangle::Right,
                //                    points, numPoints, *this );
                //                break;
                //            }
                //            case QwtSymbol::LTriangle:
                //            {
                //                qwtDrawTriangleSymbols( painter, QwtTriangle::Left,
                //                    points, numPoints, *this );
                //                break;
                //            }
                case Symbol.Style.HLine:
                    {
                        //mDrawLineSymbols( ctx, Horizontal, points, this );
                        break;
                    }
                case Symbol.Style.VLine:
                    {
                        //mDrawLineSymbols( ctx, Vertical, points, this );
                        break;
                    }
                //            case QwtSymbol::Star1:
                //            {
                //                qwtDrawStar1Symbols( painter, points, numPoints, *this );
                //                break;
                //            }
                //            case QwtSymbol::Star2:
                //            {
                //                qwtDrawStar2Symbols( painter, points, numPoints, *this );
                //                break;
                //            }
                //            case QwtSymbol::Hexagon:
                //            {
                //                qwtDrawHexagonSymbols( painter, points, numPoints, *this );
                //                break;
                //            }
                case Symbol.Style.Path:
                    {
                        //console.log(44)
                        /*if ( d_data->path.graphic.isNull() )
                        {
                            d_data->path.graphic = qwtPathGraphic( d_data->path.path,
                                d_data->pen, d_data->brush );
                        }
         
                        qwtDrawGraphicSymbols( painter, points, numPoints,
                            d_data->path.graphic, *this );*/
                        //mDrawRectGraphicSymbol(painter, point, size, this );
                        mDrawPathGraphicSymbol(painter, point, size, this);
                        break;
                    }
                //            case QwtSymbol::Pixmap:
                //            {
                //                qwtDrawPixmapSymbols( painter, points, numPoints, *this );
                //                break;
                //            }
                //            case QwtSymbol::Graphic:
                //            {
                //                qwtDrawGraphicSymbols( painter, points, numPoints,
                //                    d_data->graphic.graphic, *this );
                //                break;
                //            }
                //            case QwtSymbol::SvgDocument:
                //            {
                //    #ifndef QWT_NO_SVG
                //                qwtDrawSvgSymbols( painter, points, numPoints,
                //                    d_data->svg.renderer, *this );
                //    #endif
                //                break;
                //            }
                default: ;
            }
        }

        /*!
          Calculate the bounding rectangle for a symbol
          at position (0,0).
    
          \return Bounding rectangle
         */
        this.boundingRect = function () {
            var rect = new Misc.Rect();

            switch (m_style) {
                case Symbol.Style.Ellipse:
                case Symbol.Style.MRect:
                case Symbol.Style.Hexagon:
                    {
                        var pw = 0.0;
                        if (m_pen.style != Static.NoPen)
                            pw = Math.max(m_pen.width, 1.0);

                        rect = new Misc.Rect(new Misc.Point(), m_size.width + pw, m_size.height + pw);
                        rect.moveCenter(new Misc.Point());

                        break;
                    }
                case Symbol.Style.XCross:
                case Symbol.Style.Diamond:
                case Symbol.Style.Triangle:
                case Symbol.Style.UTriangle:
                case Symbol.Style.DTriangle:
                case Symbol.Style.RTriangle:
                case Symbol.Style.LTriangle:
                case Symbol.Style.Star1:
                case Symbol.Style.Star2:
                    {

                        var pw = 0.0;
                        if (m_pen.style !== Static.NoPen)
                            pw = Math.max(m_pen.width, 1.0);



                        rect = new Misc.Rect(new Misc.Point(), m_size.width + pw, m_size.height + pw);
                        rect.moveCenter(new Misc.Point());
                        break;
                    }
                case Symbol.Style.Path:
                    {


                        rect = m_path.boundingRect()
                        console.log(rect.width())
                        rect.moveCenter(new Misc.Point());

                        break;
                    }
                //            case QwtSymbol::Pixmap:
                //            {
                //                if ( d_data->size.isEmpty() )
                //                    rect.setSize( d_data->pixmap.pixmap.size() );
                //                else
                //                    rect.setSize( d_data->size );

                //                rect.moveCenter( QPointF( 0.0, 0.0 ) );

                //                // pinpoint ???
                //                break;
                //            }
                //            case QwtSymbol::Graphic:
                //            {
                //                rect = qwtScaledBoundingRect(
                //                    d_data->graphic.graphic, d_data->size );

                //                break;
                //            }
                //    #ifndef QWT_NO_SVG
                //            case QwtSymbol::SvgDocument:
                //            {
                //                if ( d_data->svg.renderer )
                //                    rect = d_data->svg.renderer->viewBoxF();

                //                if ( d_data->size.isValid() && !rect.isEmpty() )
                //                {
                //                    QSizeF sz = rect.size();

                //                    const double sx = d_data->size.width() / sz.width();
                //                    const double sy = d_data->size.height() / sz.height();

                //                    QTransform transform;
                //                    transform.scale( sx, sy );

                //                    rect = transform.mapRect( rect );
                //                }
                //                break;
                //            }
                //    #endif
                default:
                    {
                        rect = new Misc.Rect(new Misc.Point(), m_size.width, m_size.height);
                        rect.moveCenter(new Misc.Point());
                    }
            }

            //        if ( d_data->style == QwtSymbol::Graphic ||
            //            d_data->style == QwtSymbol::SvgDocument || d_data->style == QwtSymbol::Path )
            //        {
            //            QPointF pinPoint( 0.0, 0.0 );
            //            if ( d_data->isPinPointEnabled )
            //                pinPoint = rect.center() - d_data->pinPoint;

            //            rect.moveCenter( pinPoint );
            //        }

            var r = new Misc.Rect();
            r.setLeft(Math.floor(rect.left()));
            r.setTop(Math.floor(rect.top()));
            r.setRight(Math.ceil(rect.right()));
            r.setBottom(Math.ceil(rect.bottom()));

            //if ( m_style != Pixmap )
            //r.adjust( -1, -1, 1, 1 ); // for antialiasing

            return r;
        }

    }

    toString() {
        return '[Symbol]';
    }

}

Enumerator.enum("Style {NoSymbol = -1, Ellipse, MRect, Diamond, Triangle, DTriangle, UTriangle, LTriangle, \
    RTriangle, Cross, XCross, HLine, \
    VLine, Star1, Star2, Hexagon, Path, Pixmap, MGraphic, SvgDocument, UserStyle = 1000;}", Symbol);


/* Symbol.prototype.toString = function () {
    return '[Symbol]';
} */
/////////////////////////////////////////////////end

class ArrowSymbol extends Symbol {
    constructor(angle = 0) {
        super();
        var self = this;
        self.type = "arrow";
        self.setPen(new Misc.Pen("black"));
        self.setBrush(new Misc.Brush("red"));
        var path = new Misc.MPath();
        path.moveTo(13, 30);
        path.lineTo(13, 15);
        path.lineTo(10, 15);
        path.lineTo(13, 10);
        path.lineTo(16, 15);
        path.lineTo(13, 15);
        path.data.rotation = angle;
        self.setPath(path);
        self.setPinPoint(new Misc.Point(13, 10));
        //self.setSize(new Misc.Size(10, 20 ));

        this.rotation = function () {
            return path.data.rotation;
        }

        this.setRotation = function (val) {
            path.data.rotation = val;
        }

    }
}

class DotOnLineSymbol extends Symbol {
    constructor(angle = 0) {
        super();
        var self = this;
        self.type = "dotOnLine";
        self.setPen(new Misc.Pen("black"));
        self.setBrush(new Misc.Brush("red"));
        var path = new Misc.MPath();
        path.moveTo(13, 30);
        path.lineTo(13, 15);
        path.addRect(new Misc.Rect(10, 9, 6, 6));
        path.data.rotation = angle;
        self.setPath(path);
        self.setPinPoint(new Misc.Point(14, 13));
        self.setSize(new Misc.Size(6, 23));

        this.rotation = function () {
            return path.data.rotation;
        }

        this.setRotation = function (val) {
            path.data.rotation = val;
        }
    }
}