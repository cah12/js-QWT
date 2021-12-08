'use strict';
//////////////////////////PlotMarker////////////start
PlotZoneItem.inheritsFrom( PlotItem );
function PlotZoneItem( ){
    PlotItem.call(this, "Zone");

    var m_orientation = Static.Vertical;
    var m_pen = new Misc.Pen("red", 8, NoPen);
    var m_brush = new Misc.Brush("darkGray");
    var m_interval = new Interval();

    this.setItemAttribute( PlotItem.ItemAttribute.AutoScale, false );
    //setItemAttribute( QwtPlotItem::Legend, false );


    this.setZ( 5 );

    this.rtti = Rtti_PlotZone;

    /*!
      \brief Assign a pen

      The pen is used to draw the border lines of the zone

      \param pen Pen
      \sa pen(), setBrush()
    */
    this.setPen = function( pen )
    {
        //if ( d_data->pen != pen )
        {
            m_pen = pen;
            //itemChanged();
        }
    }

    /*!
      \return Pen used to draw the border lines
      \sa setPen(), brush()
    */
    this.pen = function()
    {
        return m_pen;
    }

    /*!
      \brief Assign a brush

      The brush is used to fill the zone

      \param brush Brush
      \sa pen(), setBrush()
    */
    this.setBrush = function( brush )
    {
        //if ( m_brush != brush )
        {
            m_brush = brush;
            //itemChanged();
        }
    }

    /*!
      \return Brush used to fill the zone
      \sa setPen(), brush()
    */
    this.brush = function()
    {
        return m_brush;
    }

    /*!
      \brief Set the orientation of the zone

      A horizontal zone highlights an interval of the y axis,
      a vertical zone of the x axis. It is unbounded in the
      opposite direction.

      \sa orientation(), QwtPlotItem::setAxes()
    */
    this.setOrientation = function(orientation )
    {
        if ( m_orientation != orientation )
        {
            m_orientation = orientation;
            //itemChanged();
        }
    }

    /*!
      \return Orientation of the zone
      \sa setOrientation()
     */
    this.orientation = function()
    {
        return m_orientation;
    }

    /*!
      Set the interval of the zone

      For a horizontal zone the interval is related to the y axis,
      for a vertical zone it is related to the x axis.

      \param min Minimum of the interval
      \param max Maximum of the interval

      \sa interval(), setOrientation()
     */
    this.setInterval = function( param1, param2 )
    {
        if(typeof(param2)=="undefined")
            m_interval =  param1;
        else
            m_interval = new Interval( param1, param2 );
    }



    /*!
      \return Zone interval
      \sa setInterval(), orientation()
     */
    this.interval = function()
    {
        return m_interval;
    }

    /*!
      Draw the zone

      \param painter Painter
      \param xMap x Scale Map
      \param yMap y Scale Map
      \param canvasRect Contents rectangle of the canvas in painter coordinates
    */

    this.draw = function( xMap, yMap)
    {
        if ( !m_interval.isValid() )
            return;

        var pen = m_pen;
        //pen.setCapStyle( Qt::FlatCap );

        //const bool doAlign = QwtPainter::roundingAlignment( painter );
        var canvasRect = this.getCanvasRect();
        var ctx = this.getContext();
        
        var painter = new PaintUtil.Painter(ctx);
        painter.setBrush(m_brush);
        painter.setPen(m_pen);

        if ( m_orientation == Static.Horizontal )
        {
            var y1 = yMap.transform( m_interval.minValue() );
            var y2 = yMap.transform( m_interval.maxValue() );

//            if ( doAlign )
//            {
//                y1 = qRound( y1 );
//                y2 = qRound( y2 );
//            }



            var r = new Misc.Rect( new Misc.Point(canvasRect.left(), y1), canvasRect.width(), y2 - y1 );
            r = r.normalized();

            if ( ( m_brush.style != NoBrush ) && ( y1 != y2 ) )
            {
                painter.fillRect(r, m_brush);
            }

            if ( m_pen.style != NoPen )
            {                
                painter.drawLine(r.left(), r.top(), r.right(), r.top() );
                painter.drawLine(r.left(), r.bottom(), r.right(), r.bottom() );
            }
        }
        else
        {
            var x1 = xMap.transform( m_interval.minValue() );
            var x2 = xMap.transform( m_interval.maxValue() );

//            if ( doAlign )
//            {
//                x1 = qRound( x1 );
//                x2 = qRound( x2 );
//            }

            var r = new Misc.Rect( new Misc.Point(x1, canvasRect.top()), x2 - x1, canvasRect.height());
            r = r.normalized();

            if ( ( m_brush != NoBrush ) && ( x1 != x2 ) )
            {
                painter.fillRect(r, m_brush);
            }

            if ( m_pen.style != NoPen )
            {                
                painter.drawLine(r.left(), r.top(), r.left(), r.bottom() );
                painter.drawLine(r.right(), r.top(), r.right(), r.bottom() );
            }
        }
        painter = null
    }

    /*!
      The bounding rectangle is build from the interval in one direction
      and something invalid for the opposite direction.

      \return An invalid rectangle with valid boundaries in one direction
    */
    this.boundingRect = function()
    {
        var br = this.boundingRect();

        var intv = m_interval;

        if ( intv.isValid() )
        {
            if ( m_orientation == Static.Horizontal )
            {
                br.setTop(intv.minValue());
                br.setBottom(intv.maxValue());
            }
            else
            {
                br.setLeft(intv.minValue());
                br.setRight(intv.maxValue());
            }
        }

        return br;
    }

}
PlotZoneItem.prototype.toString = function () {
    return '[PlotZoneItem]';
}
/////////////////////////////////////////////////end
