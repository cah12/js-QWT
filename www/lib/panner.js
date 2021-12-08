'use strict';
/**
 * 
 */
class Panner extends HObject{
//function Panner(plot ){
    constructor(plot){
        super()
  //HObject.call(this)
  var self = this;
  var m_plot = null;
  var m_mouseButton = Static.LeftButton
  var buttonModifiers = Static.NoModifier;

  var abortKey = Static.Key_Escape;
  var abortKeyModifiers = Static.NoModifier;

  
  var initialPosX = 0;
  var initialPosY = 0;
  var posX = 0;
  var posY = 0;

  var m_enabled = false;

  var m_canvas = null;
  
  var m_mouseDown = false;
  
  var m_cursor = "";
  var m_restoreCursor = "";
  var m_hasCursor = false;
  var m_orientations = Static.Vertical | Static.Horizontal;
  
    var deltaX = 0;
    var deltaY = 0;
    
    if(typeof(plot)!=="undefined"){
        plot.panner = this
        m_plot = plot;
        //this.setElement(m_plot.getLayout().getCentralDiv());
    }
    
    this.plot = function(){
        return m_plot;
    }

    /*!
   Change the mouse button and modifiers used for panning
   The defaults are Qt::LeftButton and Qt::NoModifier
*/
this.setMouseButton = function( btn, modifiers = Static.NoModifier)
{
    m_mouseButton = btn;
    buttonModifiers = modifiers;    
}

//! Get mouse button and modifiers used for panning
this.getMouseButton = function(  ) {
    return {button: m_mouseButton, modifiers: buttonModifiers}
}

this.setOrientation = function( orientation){

    m_orientations = orientation
}
     

    
    function movePlotItems(){        
        var itemStore = self.plot().plotItemStore();
        for(var i=0; i<itemStore.length; ++i){
            var c = itemStore[i].getCanvas();
            c.css("left", deltaX);
            c.css("top", deltaY);            
        }
    }
//alert(487)
    this.rescaleAndRedraw = function(_deltaX, _deltaY){
        var itemStore = self.plot().plotItemStore();
        for(var i=0; i<itemStore.length; ++i){
            var c = itemStore[i].getCanvas();
            c.css("left", 0);
            c.css("top", 0);
        }
        var doReplot = false;
        var autoReplot = m_plot.autoReplot();
        m_plot.setAutoReplot( false );
        var rescaled = false
        for ( var axis = 0; axis < Axis.AxisId.axisCnt; axis++ )
        {

//          if (!m_plot.axisEnabled(axis) )
//              continue;

            var map = self.plot().canvasMap( axis );
            var p1 = map.transform( self.plot().axisScaleDiv( axis ).lowerBound() );
            var p2 = map.transform( self.plot().axisScaleDiv( axis ).upperBound() );


            var d1, d2;

            if ( axis == Axis.AxisId.xBottom || axis == Axis.AxisId.xTop )
            {
                d1 = map.invTransform( p1 - _deltaX );
                d2 = map.invTransform( p2 - _deltaX );

            }
            else
            {
                d1 = map.invTransform( p1 - _deltaY );
                d2 = map.invTransform( p2 - _deltaY );
            }
            this.setAxisScale( axis, d1, d2 );
            //rescaled = true
            doReplot = true;

        }
        // if(rescaled)
        
        m_plot.setAutoReplot( autoReplot );
        if(doReplot)
            m_plot.replot();

        //Static.trigger("panned");

    }
    
    
    

    this.showCursor = function( on )
    {
        
        if ( on == m_hasCursor )
            return;
    
        if ( this.plot() == null || m_cursor == "" )
            return;
    
        m_hasCursor = on;
        
    
        if ( on )
        {
            if ( this.plot().isCursorSet() )
            {
                m_restoreCursor = this.plot().cursor();
            }
            this.plot().setCursor( m_cursor );
            
        }
        else
        {
            if ( m_restoreCursor!=="" )
            {
                this.plot().setCursor( m_restoreCursor );
                m_restoreCursor = "";
            }
            else
                this.plot().unsetCursor();
        }
    }
    this.setCursor = function( cursor )
    {
        m_cursor = cursor;
    }
    /*!
       \return Cursor that is active while panning
       \sa setCursor()
    */
    this.cursor = function()
    {
        if ( m_cursor!="" )
            return m_cursor;
    
        if ( this.plot()!=null )
            return  this.plot().cursor();
    
        return "";
    }

    //this.setMouseButton(LeftButton)
    //this.setMouseTracking(false);
    if(this.plot())
        this.setEnabled_1( true );
    //console.log(this.hasMouseTracking())

    //var w = plot.getCentralWidget()
    //w.installEventFilter( this );

    /*!
        \brief En/disable the panner

        When enabled is true an event filter is installed for
        the observed widget, otherwise the event filter is removed.

        \param enabled true or false
        \sa isEnabled(), eventFilter()
         */
        this.setEnabled = function (enabled) {
            if (m_enabled != enabled) {
                m_enabled = enabled;

                /*QWidget*/
                var w = plot.getCentralWidget();
                if (w) {
                    if (enabled){
                        //w.setEnabled_1(true)
                        w.installEventFilter(this);
                    }
                    else
                        w.removeEventFilter(this);
                }

                //this.updateDisplay();
            }
        }

	this.isEnabled = function (enabled) {
            return m_enabled;
        }


    this.widgetMousePressEvent = function(  event ){
		var isMobile = Static.isMobile();
        
            if ( !isMobile){
				if( event.button != m_mouseButton || Utility.modifiers(event) !== buttonModifiers)
					return true;
			} 
                

                if (isMobile){
                    initialPosX = event.originalEvent.touches[0].clientX;
                    initialPosY = event.originalEvent.touches[0].clientY;
                    m_mouseDown = true; 
                }else{        
                    initialPosX = event.clientX;
                    initialPosY = event.clientY;
                    m_mouseDown = true; 
                }

                    this.showCursor(true)
                    //return true
               return true;       
    }

    this.widgetMouseUpEvent = function(  event ){
        if(!m_mouseDown) return
                   m_mouseDown = false;
                   self.showCursor(false)
                        if(deltaX !=0 || deltaY !=0){
                            self.rescaleAndRedraw(deltaX, deltaY)
                            deltaX = 0;
                            deltaY = 0;
                        }
                    
                   // return true
                
    }

    this.widgetMouseMoveEvent = function(  event ){
        if(m_mouseDown){
                    if ( !Static.isMobile()){
                        //this.showCursor(true)
                        deltaX = event.clientX-initialPosX;
                        deltaY = event.clientY-initialPosY;

                    }else{
                        var touchobj = event.originalEvent.changedTouches[0] // reference first touch point for this event
                        deltaX = parseInt(touchobj.clientX)-initialPosX;
                        deltaY = parseInt(touchobj.clientY)-initialPosY;
                    }
                    if(m_orientations == Static.Vertical)
                        deltaX = 0
                    if(m_orientations == Static.Horizontal)
                        deltaY = 0
                    movePlotItems(/*deltaX, deltaY*/);
                }
               // return true;
    }
    Static.trigger('pannerAdded', this)
    this.setEnabled(true)
}

setAxisScale( axis, d1, d2 ){
	this.plot().setAxisScale( axis, d1, d2 );
}

    eventFilter(watched, event) {
        if(!this.isEnabled()) return
        //console.log(watched.hasMouseTracking())
        //console.log(event.type)
        var mt = false;
        switch(event.type) {
          case 'mousedown':
		  case 'touchstart':
          {
            //mt = watched.hasMouseTracking()
            //if(!mt)
                //watched.setMouseTracking(true)
            this.widgetMousePressEvent(event)
        }
            break;
          case 'mousemove':
		  case 'touchmove':
            this.widgetMouseMoveEvent(event)
            break;
          case 'mouseleave':
            this.widgetMouseUpEvent(event)
            break;
            case 'mouseup':
			case 'touchend':
                {
                    this.widgetMouseUpEvent(event)
                    //if(!mt)
                        ;//watched.setMouseTracking(false)
                }
            break;
            default:
                    // code block
        }
    }
    

}
Panner.prototype.toString = function () {
    return '[Panner]';
}

////////////////////////////////////////////end
