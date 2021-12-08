'use strict';
//////////////////////////PlotMarker////////////start
//PlotMarker.inheritsFrom( PlotItem );
//function PlotMarker(tle){
class PlotMarker extends PlotItem{
	constructor(tle){
    //PlotItem.call(this, tle);
	super(tle);
    var m_label = "";
    var m_labelFont = new Misc.Font();
    var m_labelAlignment = Static.AlignCenter;
    var m_labelOrientation = Horizontal;
    var m_spacing = 2;
    var m_pen = new Misc.Pen;//mMakePen();
    var m_symbol = null;
    var m_style = NoLine;
    var m_xValue = 0.0;
    var m_yValue = 0.0;

    this.rtti = Static.Rtti_PlotMarker;


    //! Return Value
    this.value = function()
    {
        return new Misc.Point( m_xValue, m_yValue );
    }

    //! Return x Value
    this.xValue = function()
    {
        return m_xValue;
    }

    //! Return y Value
    this.yValue = function()
    {
        return m_yValue;
    }

    //! Set Value
//    this.setValue = function( pos )
//    {
//        this.setValue( pos.x, pos.y );
//    }

    //! Set Value
    this.setValue = function( x, y ) {
        //console.log(x)
        if(typeof(x)=="object"){
            var temp = x
            x=temp.x
            y=temp.y
        }
        if ( x != m_xValue || y != m_yValue )
        {
            m_xValue = x;
            m_yValue = y;
            //itemChanged();
            if(this.plot())
                this.plot().autoRefresh()
        }
    }

    //! Set X Value
    this.setXValue = function(  x )
    {
        this.setValue( x, m_yValue );
    }

    //! Set Y Value
    this.setYValue = function(  y )
    {
        this.setValue( m_xValue, y );
    }

    /*!
      \brief Set the label
      \param label Label text
      \sa label()
    */
    this.setLabel = function( label )
    {
        if ( label != m_label )
        {
            m_label = label;
            //itemChanged();
        }
    }

    /*!
      \return the label
      \sa setLabel()
    */
    this.label = function()
    {
        return m_label;
    }

    /*!
      \brief Set the alignment of the label

      In case of QwtPlotMarker::HLine the alignment is relative to the
      y position of the marker, but the horizontal flags correspond to the
      canvas rectangle. In case of QwtPlotMarker::VLine the alignment is
      relative to the x position of the marker, but the vertical flags
      correspond to the canvas rectangle.

      In all other styles the alignment is relative to the marker's position.

      \param align Alignment.
      \sa labelAlignment(), labelOrientation()
    */
    this.setLabelAlignment = function(align )
    {
        if ( align !== m_labelAlignment )
        {
            m_labelAlignment = align;
            //itemChanged();
        }
    }

    /*!
      \return the label alignment
      \sa setLabelAlignment(), setLabelOrientation()
    */
    this.labelAlignment = function()
    {
        return m_labelAlignment;
    }

    /*!
      \brief Set the orientation of the label

      When orientation is Qt::Vertical the label is rotated by 90.0 degrees
      ( from bottom to top ).

      \param orientation Orientation of the label

      \sa labelOrientation(), setLabelAlignment()
    */
    this.setLabelOrientation = function( orientation )
    {
        if ( orientation != m_labelOrientation )
        {
            m_labelOrientation = orientation;
            //itemChanged();
        }
    }

    /*!
      \return the label orientation
      \sa setLabelOrientation(), labelAlignment()
    */
    this.labelOrientation = function()
    {
        return m_labelOrientation;
    }

    /*!
      \brief Set the spacing

      When the label is not centered on the marker position, the spacing
      is the distance between the position and the label.

      \param spacing Spacing
      \sa spacing(), setLabelAlignment()
    */
    this.setSpacing = function( spacing )
    {
        if ( spacing < 0 )
            spacing = 0;

        if ( spacing == m_spacing )
            return;

        m_spacing = spacing;
        //itemChanged();
    }

    /*!
      \return the spacing
      \sa setSpacing()
    */
    this.spacing = function()
    {
        return m_spacing;
    }


    /*!
      \brief Assign a symbol
      \param symbol New symbol
      \sa symbol()
    */
    this.setSymbol = function( symbol )
    {
        //if ( symbol != m_symbol )
        {
            m_symbol = symbol;

            //if ( symbol )
                //setLegendIconSize( symbol->boundingRect().size() );

            //legendChanged();
            //itemChanged();
        }
    }

    /*!
      \return the symbol
      \sa setSymbol(), QwtSymbol
    */
    this.symbol = function()
    {
        return m_symbol;
    }

    /*!
      Draw the marker

      \param painter Painter
      \param xMap x Scale Map
      \param yMap y Scale Map
      \param canvasRect Contents rectangle of the canvas in painter coordinates
    */
    this.draw = function(xMap, yMap)
    {

        var canvasRect = this.getCanvasRect();
        //$("#demo").text(mRectToString(canvasRect))
        var pos = new Misc.Point( xMap.transform( m_xValue ), yMap.transform( m_yValue ) );

        var ctx = this.getContext();

        // draw lines
        this.drawLines(ctx, canvasRect, pos );

        // draw symbol
        //console.log(m_symbol.style())
        if ( m_symbol && ( m_symbol.style() !== NoSymbol ) )
        {
            var sz = m_symbol.size();
            var clipRect = canvasRect.adjusted( -sz.width, -sz.height, sz.width, sz.height );
            if ( clipRect.contains(pos ) ){
                m_symbol.drawSymbol( ctx, pos );
            }

        }

        this.drawLabel(ctx, canvasRect, pos );
    }

    /*!
      Align and draw the text label of the marker

      \param painter Painter
      \param canvasRect Contents rectangle of the canvas in painter coordinates
      \param pos Position of the marker, translated into widget coordinates

      \sa drawLabel(), QwtSymbol::drawSymbol()
    */
    this.drawLabel = function(ctx, canvasRect, pos )
    {

        if ( m_label === "" )
            return;

        var align = m_labelAlignment;
        var alignPos = pos;

        var symbolOff = new Misc.Size( 0, 0 );
        //var canvasRect = this.getCanvasRect();

        //var ctx = this.getContext();

        switch ( m_style )
        {

            case VLine:
            {
                // In VLine-style the y-position is pointless and
                // the alignment flags are relative to the canvas

                if ( m_labelAlignment & Static.AlignTop )
                {
                    alignPos.y = canvasRect.top();
                    align &= ~Static.AlignTop;
                    align |= Static.AlignBottom;
                }
                else if ( m_labelAlignment & Static.AlignBottom )
                {
                    // In HLine-style the x-position is pointless and
                    // the alignment flags are relative to the canvas

                    alignPos.y = canvasRect.bottom() - 1;
                    align &= ~Static.AlignBottom;
                    align |= Static.AlignTop;
                }
                else
                {

                    alignPos.y = canvasRect.center().y;

                }
                break;
            }
            case HLine:
            {
                if ( m_labelAlignment & Static.AlignLeft )
                {
                    alignPos.x = canvasRect.left();
                    align &= ~Static.AlignLeft;
                    align |= Static.AlignRight;
                }
                else if ( m_labelAlignment & Static.AlignRight )
                {
                    alignPos.x = canvasRect.right() - 1;
                    align &= ~Static.AlignRight;
                    align |= Static.AlignLeft;
                }
                else
                {
                    alignPos.x = canvasRect.center().x;
                }
                break;
            }
            default:
            {
                if ( m_symbol && ( m_symbol.style() !== NoSymbol ) )
                {
                    var sz = m_symbol.size();
                    symbolOff = new Misc.Size((sz.width+1)/2, (sz.height+1)/2 );
                    //symbolOff /= 2;
                }
            }
        }

        var pw2 = m_pen.width / 2.0;
        if ( pw2 == 0.0 )
            pw2 = 0.5;


        var spacing = m_spacing;

        var xOff = Math.max( pw2, symbolOff.width );
        var yOff = Math.max( pw2, symbolOff.height );

        var textSize = m_labelFont.textSize(m_label)

        if ( align & Static.AlignLeft )
        {
            alignPos.x -= xOff + spacing;
            if ( m_labelOrientation == Vertical )
                alignPos.x -= textSize.height;
            else
                alignPos.x -= textSize.width;
        }
        else if ( align & Static.AlignRight )
        {
            alignPos.x += xOff + spacing;
        }
        else
        {
            if ( m_labelOrientation == Vertical )
                alignPos.x -= textSize.height / 2;
            else
                alignPos.x -= textSize.width / 2;
        }

        if ( align & Static.AlignTop )
        {
            alignPos.y -= yOff + spacing;
            if ( m_labelOrientation != Vertical )
                alignPos.y -= textSize.height;
        }
        else if ( align & Static.AlignBottom )
        {
            alignPos.y += yOff + spacing;
            if ( m_labelOrientation == Vertical )
                alignPos.y += textSize.width;
        }
        else
        {
            if ( m_labelOrientation == Vertical )
                alignPos.y += textSize.width / 2;
            else
                alignPos.y -= textSize.height / 2;
        }

        var painter = new PaintUtil.Painter(ctx);
        painter.save();
        //painter.setBrush(new Misc.Brush("black"))
        painter.translate( alignPos.x, alignPos.y );
        if ( m_labelOrientation == Vertical )
            painter.rotate( -90*Math.PI/180 );
        painter.setFont(m_labelFont)
        var textRect = new Misc.Rect( 0, 0, textSize.width, textSize.height );
        painter.drawText(m_label, textRect.left(), textRect.bottom());
        painter.restore();

        painter = null

    }


    /*!
      Draw the lines marker

      \param painter Painter
      \param canvasRect Contents rectangle of the canvas in painter coordinates
      \param pos Position of the marker, translated into widget coordinates

      \sa drawLabel(), QwtSymbol::drawSymbol()
    */
    this.drawLines = function(ctx, canvasRect, pos )
    {

        if ( m_style == NoLine )
            return;

        //var doAlign = QwtPainter::roundingAlignment( painter );

        var painter = new PaintUtil.Painter(ctx);
        painter.setPen(m_pen);

        if ( m_style == HLine || m_style == Cross )
        {
            var y = pos.y;
            //if ( doAlign )
                //y = qRound( y );

            painter.drawLine(canvasRect.left(), y, canvasRect.right() - 1.0, y );
        }
        if ( m_style == VLine || m_style == Cross )
        {
            var x = pos.x;
            //if ( doAlign )
                //x = qRound( x );

            painter.drawLine(x, canvasRect.top(), x, canvasRect.bottom() - 1.0 );
        }
        painter = null
    }


    /*!
      \brief Set the line style
      \param style Line style.
      \sa lineStyle()
    */
    this.setLineStyle = function( style )
    {

        if ( style != m_style )
        {
            m_style = style;


           // legendChanged();
           // itemChanged();
        }
    }

    /*!
      \return the line style
      \sa setLineStyle()
    */
    this.lineStyle = function()
    {
        return m_style;
    }

    /*!
      Specify a pen for the line.

      \param pen New pen
      \sa linePen()
    */
    this.setLinePen = function( pen )
    {
       // if ( pen != m_pen )
        //{
            m_pen = pen;
            if(this.plot())
                this.plot().autoRefresh()


           // legendChanged();
            //itemChanged();
        //}
    }

    /*!
      \return the line pen
      \sa setLinePen()
    */
    this.linePen = function()
    {
        return m_pen;
    }

    this.setZ( 30.0 );

this.toString = function () {
    return '[PlotMarker]';
}

/*!
   \return Icon representing the marker on the legend

   \param index Index of the legend entry 
                ( usually there is only one )
   \param size Icon size

   \sa setLegendIconSize(), legendData()
*/
this.legendIcon = function( index, size ){
   
    /*if ( size.isEmpty() )
        return QwtGraphic();*/
    if ( size.width === 0 && size.height === 0 )
        return null;

    var graphic = new GraphicUtil.Graphic(null, size.width, size.height);
     
    //graphic.setDefaultSize( size );
    //graphic.setRenderHint( QwtGraphic::RenderPensUnscaled, true );

    //QPainter painter( &graphic );
    //painter.setRenderHint( QPainter::Antialiasing,
       // testRenderHint( QwtPlotItem::RenderAntialiased ) );
    var painter = new PaintUtil.Painter(graphic);

    // QwtGraphic icon;
    // icon.setDefaultSize( size );
    // icon.setRenderHint( QwtGraphic::RenderPensUnscaled, true );

    // QPainter painter( &icon );
    // painter.setRenderHint( QPainter::Antialiasing,
    //     testRenderHint( QwtPlotItem::RenderAntialiased ) );

     if ( this.lineStyle() != NoLine ){
    //     painter.setPen( d_data->pen );

    //     if ( d_data->style == QwtPlotMarker::HLine ||
    //         d_data->style == QwtPlotMarker::Cross )
    //     {
    //         const double y = 0.5 * size.height();

    //         QwtPainter::drawLine( &painter, 
    //             0.0, y, size.width(), y );
    //     }

    //     if ( d_data->style == QwtPlotMarker::VLine ||
    //         d_data->style == QwtPlotMarker::Cross )
    //     {
    //         const double x = 0.5 * size.width();

    //         QwtPainter::drawLine( &painter, 
    //             x, 0.0, x, size.height() );
    //     }
     }

     if ( this.symbol() )
     {
    //     const QRect r( 0.0, 0.0, size.width(), size.height() );
    //     d_data->symbol->drawSymbol( &painter, r );
        this.symbol().drawGraphicSymbol( painter, new Misc.Point(size.width, size.height), size );
     }
     painter = null

    return graphic;
}
	}
}


/////////////////////////////////////////////////end
