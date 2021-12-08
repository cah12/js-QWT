'use strict';

/*!
  \brief QwtPlotPicker provides selections on a plot canvas

  QwtPlotPicker is a QwtPicker tailored for selections on
  a plot canvas. It is set to a x-Axis and y-Axis and
  translates all pixel coordinates into this coordinate system.
*/

/*!
  \brief Create a plot picker

  The picker is set to those x- and y-axis of the plot
  that are enabled. If both or no x-axis are enabled, the picker
  is set to QwtPlot::Axis.AxisId.xBottom. If both or no y-axis are
  enabled, it is set to QwtPlot::yLeft.

  \param canvas Plot canvas to observe, also the parent object

  \sa QwtPlot::autoReplot(), QwtPlot::replot(), scaleRect()
*/
//( int xAxis, int yAxis, QWidget *canvas )

/**
 * @classdesc PlotPicker provides selections on a plot canvas
 * 
 */
class PlotPicker extends Picker {
    constructor(xAxis, yAxis, rubberBand, trackerMode, /*QWidget **/canvas ) {
      var _constructor = 0
      
      if(typeof (xAxis) !== 'number'){ //constructor 1
          /*PlotPicker( QWidget *canvas );*/
          canvas = xAxis
          xAxis = -1
          yAxis = -1
          rubberBand = Picker.RubberBand.NoRubberBand
          trackerMode = Picker.DisplayMode.AlwaysOff
          _constructor = 1 //indicate the constructor to use
      }
      if(typeof (rubberBand) !== 'number'){ //constructor 2
          /*PlotPicker( int xAxis, int yAxis,/* QWidget */ /*canvas)*/
          canvas = rubberBand
          rubberBand = Picker.RubberBand.NoRubberBand
          trackerMode = Picker.DisplayMode.AlwaysOff
          _constructor = 2 //indicate the constructor to use
      }

      if(canvas instanceof Plot)
          canvas = canvas.getCentralWidget()

      super(rubberBand, trackerMode, canvas)
      this.d_xAxis = -1;
      this.d_yAxis = -1;
     
     if(_constructor == 1){     

        var plot = this.plot();
        var xAxis = Axis.AxisId.xBottom;
        if (plot && !plot.axisEnabled( Axis.AxisId.xBottom ) && plot.axisEnabled(Axis.AxisId.xTop ) )
        {
            xAxis = Axis.AxisId.xTop;
        }

        var yAxis = Axis.AxisId.yLeft;
        if (plot &&  !plot.axisEnabled( Axis.AxisId.yLeft ) && plot.axisEnabled( Axis.AxisId.yRight ) )
        {
            yAxis = Axis.AxisId.yRight;
        }

        this.setAxis( xAxis, yAxis );
      }
      else{    

          this.d_xAxis = xAxis;
          this.d_yAxis = yAxis;
      }

     this.setEnabled(true) 
     if(canvas) 
          canvas.setEnabled_1(true)     
  }//////////////////////////////////////////////////////////////////


   setAxis( xAxis, yAxis ){
      var plt = this.plot();
      if ( !plt )
          return;

      if ( xAxis != this.d_xAxis || yAxis != this.d_yAxis )
      {
          this.d_xAxis = xAxis;
          this.d_yAxis = yAxis;
      }
   }

    xAxis(){
        return this.d_xAxis;
    }
    yAxis(){
        return this.d_yAxis;
    }

    plot(){
      var w = this.parentWidget()
      if(!w)
        return null
      return w.plot;

    }
    
    /*const QWidget *canvas() const;*/
    canvas(){
        return this.parentWidget();
    }


    /**
     * @returns {Misc.Rect} Normalized bounding rectangle of the axes
     */
    scaleRect(){
        var rect = null;
        if ( this.plot() )
        {
            var xs = this.plot().axisScaleDiv( this.xAxis() );
            var ys = this.plot().axisScaleDiv( this.yAxis() );

            rect = new Misc.Rect( xs.lowerBound(), ys.lowerBound(),
                xs.range(), ys.range() );
            rect = rect.normalized();
        }

        return rect;
    }   

//Q_SIGNALS:

    /*!
      A signal emitted in case of QwtPickerMachine::PointSelection.
      \param pos Selected point
    */
    //void selected( const QPointF &pos );

    /*!
      A signal emitted in case of QwtPickerMachine::RectSelection.
      \param rect Selected rectangle
    */
    //void selected( const QRectF &rect );

    /*!
      A signal emitting the selected points,
      at the end of a selection.

      \param pa Selected points
    */
    //void selected( const QVector<QPointF> &pa );

    /*!
      A signal emitted when a point has been appended to the selection

      \param pos Position of the appended point.
      \sa append(). moved()
    */
    //void appended( const QPointF &pos );

    /*!
      A signal emitted whenever the last appended point of the
      selection has been moved.

      \param pos Position of the moved last point of the selection.
      \sa move(), appended()
    */
    //void moved( const QPointF &pos );

//protected:



    
    

    /*!
    Translate a point from pixel into plot coordinates
    \return Point in plot coordinates
    \sa transform()
*/
/*QPointF QwtPlotPicker::invTransform( const QPoint &pos ) const
{
    QwtScaleMap xMap = plot()->canvasMap( d_xAxis );
    QwtScaleMap yMap = plot()->canvasMap( d_yAxis );

    return QPointF(
        xMap.invTransform( pos.x() ),
        yMap.invTransform( pos.y() )
    );
}*/

    /*!
    Translate a rectangle from pixel into plot coordinates
    \return Rectangle in plot coordinates
    \sa transform()
*/
    /*QRectF */invTransform( /*const QRect &*/ rect){
      var xMap = this.plot().canvasMap( this.d_xAxis );
      var yMap = this.plot().canvasMap( this.d_yAxis );
      if(_.has(rect, "x")&&_.has(rect, "y")){ //argument is a point
          var pos = rect
          return new Misc.Point(xMap.invTransform( pos.x ), yMap.invTransform( pos.y ));
      }else{//argument is a rect
        /*var xMap = this.plot().canvasMap( this.d_xAxis );
        var yMap = this.plot().canvasMap( this.d_yAxis );*/
        //return QwtScaleMap::invTransform( xMap, yMap, rect );
        return ScaleMap.invTransform_Rect( xMap, yMap, rect)
    }
  }

  /*
  QPoint QwtPlotPicker::transform( const QPointF &pos ) const
{
    QwtScaleMap xMap = plot()->canvasMap( d_xAxis );
    QwtScaleMap yMap = plot()->canvasMap( d_yAxis );

    const QPointF p( xMap.transform( pos.x() ),
        yMap.transform( pos.y() ) );

    return p.toPoint();
}

  */


    /*!
    Translate a rectangle from plot into pixel coordinates
    \return Rectangle in pixel coordinates
    \sa invTransform()
*/
    /*QRect */transform(/* const QRectF &*/ rect){
      var xMap = this.plot().canvasMap( this.d_xAxis );
      var yMap = this.plot().canvasMap( this.d_yAxis );
      if(rect.x !== undefined){ //argument is a point
          var pos = rect
          var p = new Misc.Point( xMap.transform( pos.x ),
          yMap.transform( pos.y) );

          return p//.toPoint();
      } else{

      //return QwtScaleMap::transform( xMap, yMap, rect ).toRect();
      return Static.mTransform( xMap, yMap, rect );
    }
  }

    /*QwtText QwtPlotPicker::trackerText( const QPoint &pos ) const
{
    return trackerTextF( invTransform( pos ) );
}*/

    //QPointF invTransform( const QPoint & ) const;
    //QPoint transform( const QPointF & ) const;

    /*virtual QwtText */trackerText(/* const QPointF &*/ pos){
      pos =  this.invTransform( pos )
      var label //= "";

        switch (this.rubberBand()) {
        case Picker.RubberBand.HLineRubberBand:
            label = pos.y.toString();
            break;
        case Picker.RubberBand.VLineRubberBand:
            label = pos.x.toString();
            break;
        default:
            label = pos.x.toString() + ", " + pos.y.toString();
        }
        return label;

    }

    /*!
  Move the last point of the selection

  \param pos New position
  \sa isActive, begin(), end(), append()

  \note The moved(const QPoint &), moved(const QDoublePoint &)
        signals are emitted.
*/
    move( /*const QPoint &*/ pos){
      super.method(move( pos ));
    //Q_EMIT moved( invTransform( pos )
      Static.trigger('moved', invTransform( pos ))

     }


    /*!
  Append a point to the selection and update rubber band and tracker.

  \param pos Additional point
  \sa isActive, begin(), end(), move(), appended()

  \note The appended(const QPoint &), appended(const QDoublePoint &)
        signals are emitted.
*/
    append( /*const QPoint & */pos) {
         super.method(append( pos ));
        //Q_EMIT appended( invTransform( pos ) );
        Static.trigger('appended', invTransform( pos ))
    }


    /*!
  Close a selection setting the state to inactive.

  \param ok If true, complete the selection and emit selected signals
            otherwise discard the selection.
  \return True if the selection has been accepted, false otherwise
*/
    /*virtual bool*/ end( ok = true ){
        ok = super.end( ok );
        //console.log(ok)
        if ( !ok )
            return false;

        var plot = this.plot();
        if ( !plot )
            return false;

        /*const QPolygon*/ var points = this.selection();
        if ( points.length == 0 )
            return false;

        var selectionType = PickerMachine.SelectionType.NoSelection;

        if ( this.stateMachine() )
            selectionType = this.stateMachine().selectionType();

        switch ( selectionType )
        {
            case PickerMachine.SelectionType.PointSelection:
            {
                /*onst QPointF*/ var pos = this.invTransform( points[0] );
                //Q_EMIT selected( pos );
                 Static.trigger('selected',  pos )
                break;
            }
            case PickerMachine.SelectionType.RectSelection:
            {
                if ( points.length >= 2 )
                {
                    /*const QPoint*/var p1 = points[0];
                    /*const QPoint*/var p2 = points[points.length - 1];

                    /*const QRect*/var rect = new Misc.Rect( p1, p2 ).normalized();
                    //Q_EMIT selected( invTransform( rect ) );
                    Static.trigger('selected', this.invTransform( rect ) )
                }
                break;
            }
            case PickerMachine.SelectionType.PolygonSelection:
            {
                /*QVector<QPointF>*/var dpa = [];//( points.count() );
                for ( var i = 0; i < points.length; i++ )
                    dpa.push( this.invTransform( points[i] ));

                //Q_EMIT selected( dpa );
                Static.trigger('selected', dpa )
            }
            default:
                break;
        }

        return true;

    }

/*private:
    int d_xAxis;
    int d_yAxis;*/
};


