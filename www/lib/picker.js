'use strict';

class PickerRubberband extends WidgetOverlay {
	constructor(/*QwtPicker*/ picker, /*QWidget*/ parent) {
		super(parent)

		this.setZ(30); //ensure the rubberband is drawn above everything

		var d_picker = picker;

		this.drawOverlay = function (painter) {
			//d_picker.rubberBandOverlay().clearCanvas()
			//painter.save()
			painter.setPen(d_picker.rubberBandPen());
			painter.setBrush(Static.NoBrush)
			d_picker.drawRubberBand(painter);
			//painter.restore()
		}

	}
};

class PickerTracker extends WidgetOverlay {
	constructor(/*QwtPicker*/ picker, /*QWidget*/ parent) {
		super(parent);
		this.setZ(30); //ensure the tracker is drawn above everything

		var d_picker = picker;

		this.drawOverlay = function (painter) {
			d_picker.trackerOverlay().clearCanvas()
			painter.save()
			painter.setPen(d_picker.trackerPen());
			d_picker.drawTracker(painter);
			painter.restore()
		}
	}
};

class PickerPrivateData {
	constructor() {
		this.enabled = false;

		this.stateMachine = null;

		this.resizeMode //= QwtPicker::Stretch;

		this.rubberBand = Picker.RubberBand.NoRubberBand;
		this.rubberBandPen = new Misc.Pen('red', 1, 'solid');

		this.trackerMode = Picker.DisplayMode.AlwaysOff;
		this.trackerPen = new Misc.Pen('red');
		this.trackerFont;

		this.pickedPoints = [];
		this.isActive = false;
		/*QPoint*/
		this.trackerPosition = new Misc.Point();

		this.mouseTracking = false; // used to save previous value

		/*QPointer< QwtPickerRubberband >*/
		this.rubberBandOverlay = null;
		/*QPointer< QwtPickerTracker>*/
		this.trackerOverlay = null;
	}
};

/**
 * Creates an picker that is enabled, but without a state machine.
rubber band and tracker are disabled.
 */

/*!
Constructor

Creates an picker that is enabled, but without a state machine.
rubber band and tracker are disabled.

\param parent Parent widget, that will be observed
 */

/*!
Constructor

\param rubberBand Rubber band style
\param trackerMode Tracker mode
\param parent Parent widget, that will be observed
 */
//Picker.inheritsFrom(HObject);

/*
Try to simulate multiple inheritance.
 */

/**
 * 
 */
class Picker extends EventPattern {
	constructor(rubberBand, trackerMode, /*QWidget*/ parent) {
		super(parent)
		const self = this;

		let clickEvent = "click";
		let mousedownEvent = "mousedown";
		let mouseupEvent = "mouseup";
		let mousemoveEvent = "mousemove";
		if (Static.isMobile()) {
			clickEvent = "tap";
			mousedownEvent = "touchstart";
			mouseupEvent = "touchend";
			mousemoveEvent = "touchmove";
		}

		var d_data;
		var m_pickedPoints = [];

		var m_parent = null

		if (parent !== undefined && parent.toString() == '[Widget]') {
			m_parent = parent
		}

		//! Initialize the picker - used by the constructors
		this.init = function (parent, rubberBand, trackerMode) {
			d_data = new PickerPrivateData();

			d_data.rubberBand = rubberBand;

			if (parent) {
				//if ( parent->focusPolicy() == Qt::NoFocus )
				//parent->setFocusPolicy( Qt::WheelFocus );

				//d_data->openGL = parent->inherits( "QGLWidget" );
				d_data.trackerFont = new Misc.Font(12);;
				//d_data->mouseTracking = parent->hasMouseTracking();

				this.setEnabled_1(true);
			}

			this.setTrackerMode(trackerMode);
			Picker.pickers.push(this)
		}

		this.getPickerData = function () {
			return d_data
		}

		/*!
		Set a state machine and delete the previous one

		\param stateMachine State machine
		\sa stateMachine()
		 */
		this.setStateMachine = function (/*QwtPickerMachine*/ stateMachine) {
			if (d_data.stateMachine != stateMachine) {
				this.reset();

				//delete d_data->stateMachine;
				d_data.stateMachine = stateMachine;

				if (d_data.stateMachine)
					d_data.stateMachine.reset();
			}
		}

		/*!
		\return Assigned state machine
		\sa setStateMachine()
		 */
		this.stateMachine = function () {
			return d_data.stateMachine;
		}

		//! Return the parent widget, where the selection happens
		this.parentWidget = function () {
			//QObject *obj = parent();
			//if ( obj && obj->isWidgetType() )
			//return static_cast<QWidget *>( obj );

			//return null;
			return m_parent
		}

		/*!
		Set the rubber band style

		\param rubberBand Rubber band style
		The default value is NoRubberBand.

		\sa rubberBand(), RubberBand, setRubberBandPen()
		 */
		this.setRubberBand = function (rubberBand) {
			d_data.rubberBand = rubberBand;
		}

		/*!
		\return Rubber band style
		\sa setRubberBand(), RubberBand, rubberBandPen()
		 */
		this.rubberBand = function () {
			return d_data.rubberBand;
		}

		/*!
		\brief Set the display mode of the tracker.

		A tracker displays information about current position of
		the cursor as a string. The display mode controls
		if the tracker has to be displayed whenever the observed
		widget has focus and cursor (AlwaysOn), never (AlwaysOff), or
		only when the selection is active (ActiveOnly).

		\param mode Tracker display mode

		\warning In case of AlwaysOn, mouseTracking will be enabled
		for the observed widget.
		\sa trackerMode(), DisplayMode
		 */

		this.setTrackerMode = function (/*DisplayMode*/ mode) {
			if (d_data.trackerMode != mode) {
				d_data.trackerMode = mode;
				//this.setMouseTracking(d_data.trackerMode == Picker.DisplayMode.AlwaysOn);
			}
		}

		/*!
		\return Tracker display mode
		\sa setTrackerMode(), DisplayMode
		 */
		this.trackerMode = function () {
			return d_data.trackerMode;
		}


		/*!
		\brief Set the resize mode.

		The resize mode controls what to do with the selected points of an active
		selection when the observed widget is resized.

		Stretch means the points are scaled according to the new
		size, KeepSize means the points remain unchanged.

		The default mode is Stretch.

		\param mode Resize mode
		\sa resizeMode(), ResizeMode
		 */
		/*void QwtPicker::setResizeMode( ResizeMode mode )
	{
		d_data->resizeMode = mode;
		}*/

		/*!
		\return Resize mode
		\sa setResizeMode(), ResizeMode
		 */

		/* QwtPicker::ResizeMode QwtPicker::resizeMode() const
	{
		return d_data->resizeMode;
		}*/

		/*!
		\brief En/disable the picker

		When enabled is true an event filter is installed for
		the observed widget, otherwise the event filter is removed.

		\param enabled true or false
		\sa isEnabled(), eventFilter()
		 */
		this.setEnabled = function (enabled) {
			if (d_data.enabled != enabled) {

				d_data.enabled = enabled;

				/*QWidget*/
				var w = self.parentWidget();
				if (w) {
					if (enabled)
						w.installEventFilter(this);
					else
						w.removeEventFilter(this);
				}

				self.updateDisplay();
			}
		}

		/*!
		\return true when enabled, false otherwise
		\sa setEnabled(), eventFilter()
		 */

		this.isEnabled = function () {
			return d_data.enabled;
		}

		/*!
		Set the font for the tracker

		\param font Tracker font
		\sa trackerFont(), setTrackerMode(), setTrackerPen()
		 */
		this.setTrackerFont = function (font) {
			if (font != d_data.trackerFont) {
				d_data.trackerFont = font;
				this.updateDisplay();
			}
		}

		/*!
		\return Tracker font
		\sa setTrackerFont(), trackerMode(), trackerPen()
		 */

		this.trackerFont = function () {
			return d_data.trackerFont;
		}

		/*!
		Set the pen for the tracker

		\param pen Tracker pen
		\sa trackerPen(), setTrackerMode(), setTrackerFont()
		 */
		this.setTrackerPen = function (pen) {
			if (pen != d_data.trackerPen) {
				d_data.trackerPen = pen;
				this.updateDisplay();
			}
		}

		/*!
		\return Tracker pen
		\sa setTrackerPen(), trackerMode(), trackerFont()
		 */
		this.trackerPen = function () {
			return d_data.trackerPen;
		}

		/*!
		Set the pen for the rubberband

		\param pen Rubber band pen
		\sa rubberBandPen(), setRubberBand()
		 */
		this.setRubberBandPen = function (pen) {
			if (pen != d_data.rubberBandPen) {
				d_data.rubberBandPen = pen;
				this.updateDisplay();
			}
		}

		/*!
		\return Rubber band pen
		\sa setRubberBandPen(), rubberBand()
		 */
		this.rubberBandPen = function () {
			return d_data.rubberBandPen;
		}

		/*!
		Draw a rubber band, depending on rubberBand()

		\param painter Painter, initialized with a clip region

		\sa rubberBand(), RubberBand
		 */

		this.drawRubberBand = function (painter) {
			if (!this.isActive() || this.rubberBand() == Picker.RubberBand.NoRubberBand ||
				this.rubberBandPen().style == Static.NoPen) {
				return;
			}

			/*const QPolygon*/
			var pa = this.adjustedPoints(d_data.pickedPoints);

			var selectionType = PickerMachine.SelectionType.NoSelection;

			if (d_data.stateMachine)
				selectionType = d_data.stateMachine.selectionType();

			switch (selectionType) {
				case PickerMachine.SelectionType.NoSelection:
				case PickerMachine.SelectionType.PointSelection: {
					if (pa.length < 1)
						return;

					/*const QPoint*/
					var pos = pa[0];

					///*const QRect*/ var pRect = this.pickArea().boundingRect().toRect();
					/*const QRect*/
					var pRect = this.pickArea();
					switch (this.rubberBand()) {
						case Picker.RubberBand.VLineRubberBand: {
							painter.drawLine(pos.x, pRect.top(), pos.x, pRect.bottom());
							break;
						}
						case Picker.RubberBand.HLineRubberBand: {
							painter.drawLine(pRect.left(), pos.y, pRect.right(), pos.y);
							break;
						}
						case Picker.RubberBand.CrossRubberBand: {
							painter.drawLine(pos.x, pRect.top(), pos.x, pRect.bottom());
							painter.drawLine(pRect.left(), pos.y, pRect.right(), pos.y);
							break;
						}
						default:
							break;
					}
					break;
				}
				case PickerMachine.SelectionType.RectSelection: {
					if (pa.length < 2)
						return;

					///*const QRect*/ var rect = ( pa[0], pa[pa.length-1] ).normalized();
					/*const QRect*/
					var rect = new Misc.Rect(pa[0], pa[pa.length - 1]);
					rect = rect.normalized()
					switch (this.rubberBand()) {
						case Picker.RubberBand.EllipseRubberBand: {
							painter.drawEllipse(rect);
							break;
						}
						case Picker.RubberBand.RectRubberBand: {
							painter.drawRect(rect);
							break;
						}
						default:
							break;
					}
					break;
				}
				case PickerMachine.SelectionType.PolygonSelection: {
					if (pa.length < 2)
						return;
					if (this.rubberBand() == Picker.RubberBand.PolygonRubberBand) {
						painter.drawPolyline(pa);
						//console.log(pa)
					}
					break;
				}
				default:
					break;
			}
		}

		/*!
		Draw the tracker

		\param painter Painter
		\sa trackerRect(), trackerText()
		 */
		this.drawTracker = function (painter) {
			var textRect = this.trackerRect(this.trackerFont());
			if (textRect !== null) {
				//this.clearTrackerCanvas();
				var label = this.trackerText(d_data.trackerPosition);
				if (label !== "") {
					//var trackerPainter = new PaintUtil.Painter(trackerCtx);
					//painter.save();
					//trackerPainter.setFont(m_trackerFont);
					//console.log(textRect.left())
					painter.setFont(d_data.trackerFont);
					painter.drawText(label, textRect.left(), textRect.bottom());
					//trackerPainter.save();
				}
				//painter.drawText(label, d_data.trackerPosition.x, d_data.trackerPosition.y, Static.AlignLeft)
			}
		}

		/*!
		\brief Map the pickedPoints() into a selection()

		adjustedPoints() maps the points, that have been collected on
		the parentWidget() into a selection(). The default implementation
		simply returns the points unmodified.

		The reason, why a selection() differs from the picked points
		depends on the application requirements. F.e. :

		- A rectangular selection might need to have a specific aspect ratio only.\n
		- A selection could accept non intersecting polygons only.\n
		- ...\n

		The example below is for a rectangular selection, where the first
		point is the center of the selected rectangle.
		\par Example
		\verbatim QPolygon MyPicker::adjustedPoints(const QPolygon &points) const{
		QPolygon adjusted;
		if ( points.size() == 2 ){
		const int width = qAbs(points[1].x() - points[0].x());
		const int height = qAbs(points[1].y() - points[0].y());

		QRect rect(0, 0, 2 * width, 2 * height);
		rect.moveCenter(points[0]);

		adjusted += rect.topLeft();
		adjusted += rect.bottomRight();
		}
		return adjusted;
		}\endverbatim\n

		\param points Selected points
		\return Selected points unmodified
		 */
		this.adjustedPoints = function (points) {
			return points;
		}

		/*!
		\return Selected points
		\sa pickedPoints(), adjustedPoints()
		 */
		this.selection = function () {
			return this.adjustedPoints(d_data.pickedPoints);
		}

		//! \return Current position of the tracker
		this.trackerPosition = function () {
			return d_data.trackerPosition;
		}

		/*!
		Calculate the bounding rectangle for the tracker text
		from the current position of the tracker

		\param font Font of the tracker text
		\return Bounding rectangle of the tracker text

		\sa trackerPosition()
		 */
		this.trackerRect = function (font) {
			if (this.trackerMode() === Picker.DisplayMode.AlwaysOff) {
				return null;
			}

			if (this.trackerPosition().x < 0 || this.trackerPosition().y < 0)
				return null;

			var text = this.trackerText(this.trackerPosition());

			if (text == "")
				return null;

			var textSize = font.textSize(text);
			//console.log(textSize)

			//var textRect = {left:0, top:0, width:textSize.width, height:textSize.height, right:textSize.width, bottom:textSize.height };
			var textRect = new Misc.Rect(new Misc.Point(), textSize.width, textSize.height);
			var pos = this.trackerPosition();

			var alignment = 0;

			//if (/*isActive() &&*/ this.trackerPosition().length > 1 && this.rubberBand() != Picker.RubberBand.NoRubberBand) {
			if (/*isActive() &&*/ m_pickedPoints.length.length > 1 && this.rubberBand() != Picker.RubberBand.NoRubberBand) {
				var last = m_pickedPoints[0];

				alignment |= (pos.x >= last.x) ? Static.AlignRight : Static.AlignLeft;
				alignment |= (pos.y > last.y) ? Static.AlignBottom : Static.AlignTop;
			} else
				alignment = Static.AlignTop | Static.AlignRight;

			var margin = 5;

			var x = pos.x;
			if (alignment & Static.AlignLeft)
				x -= textRect.width() + margin;
			else if (alignment & Static.AlignRight)
				x += margin;

			var y = pos.y;
			if (alignment & Static.AlignBottom)
				y += margin;
			else if (alignment & Static.AlignTop)
				y -= textRect.height() + margin;

			textRect.moveTopLeft(new Misc.Point(x, y));

			//var pickRect = new Misc.Rect(new Misc.Point(), m_trackerCnvs[0].width, m_trackerCnvs[0].height);

			var pickRect = new Misc.Rect(new Misc.Point(), this.trackerOverlay().width(), this.trackerOverlay().height());
			var right = Math.min(textRect.right(), pickRect.right() - margin);
			var bottom = Math.min(textRect.bottom(), pickRect.bottom() - margin);
			textRect.moveBottomRight(new Misc.Point(right, bottom));

			var left = Math.max(textRect.left(), pickRect.left() + margin);
			var top = Math.max(textRect.top(), pickRect.top() + margin);
			textRect.moveTopLeft(new Misc.Point(left, top));

			/*console.log('w: ' +textRect.width())
			console.log('h: ' +textRect.height())
			console.log('l: ' +textRect.left())
			console.log('t: ' +textRect.top())*/

			return textRect;
		}

		/*!
		\brief Event filter

		When isEnabled() is true all events of the observed widget are filtered.
		Mouse and keyboard events are translated into widgetMouse- and widgetKey-
		and widgetWheel-events. Paint and Resize events are handled to keep
		rubber band and tracker up to date.

		\param object Object to be filtered
		\param event Event

		\return Always false.

		\sa widgetEnterEvent(), widgetLeaveEvent(),
		widgetMousePressEvent(), widgetMouseReleaseEvent(),
		widgetMouseDoubleClickEvent(), widgetMouseMoveEvent(),
		widgetWheelEvent(), widgetKeyPressEvent(), widgetKeyReleaseEvent(),
		QObject::installEventFilter(), QObject::event()
		 */
		this.eventFilter = function (/*QObject*/ object, event) {
			//console.log('eventFilter() called in qwtpicker')
			if (!this.isEnabled()) return false;
			if (object && object == this.parentWidget()) {
				switch (event.type) {
					/*case QEvent::Resize:{
					const QResizeEvent *re = static_cast<QResizeEvent *>( event );


					// Adding/deleting additional event filters inside of an event filter
					//is not safe dues to the implementation in Qt ( changing alist while iterating ).
					//So we create the overlays in a way, that they don't install en event filter
					//( parent set to NULL ) and do the resizing here.

					if ( d_data->trackerOverlay )
					d_data->trackerOverlay->resize( re->size() );

					if ( d_data->rubberBandOverlay )
					d_data->rubberBandOverlay->resize( re->size() );

					if ( d_data->resizeMode == Stretch )
					stretchSelection( re->oldSize(), re->size() );

					updateDisplay();
					break;
					}*/
					//case QEvent::Enter:
					case 'mouseenter':
						{
							this.widgetEnterEvent(event);
							break;
						}
					//case QEvent::Leave:
					case 'mouseleave':
						{
							this.widgetLeaveEvent(event);
							break;
						}
					//case QEvent::MouseButtonPress:
					case mousedownEvent: {
						this.widgetMousePressEvent(event);
						break;
					}
					//case QEvent::MouseButtonRelease:
					case mouseupEvent: {
						this.widgetMouseReleaseEvent(event);
						break;
					}
					//QEvent::MouseButtonDblClick:
					case 'dblclick': {
						this.widgetMouseDoubleClickEvent(event);
						break;
					}
					//case QEvent::MouseMove:
					case mousemoveEvent: {
						//console.log(event.clientX)
						this.widgetMouseMoveEvent(event);
						break;
					}
					//case QEvent::KeyPress:
					case 'keydown': {
						this.widgetKeyPressEvent(event);
						break;
					}
					//case QEvent::KeyRelease:
					case 'keyup': {
						this.widgetKeyReleaseEvent(event);
						break;
					}
					//case QEvent::Wheel:
					case 'mousewheel': {
						this.widgetWheelEvent(event);
						break;
					}
					default:
						break;
				}
			}
			return false;
		}

		/*!
		Passes an event to the state machine and executes the resulting
		commands. Append and Move commands use the current position
		of the cursor ( QCursor::pos() ).

		\param event Event
		 */
		this.transition = function (event) {
			if (!d_data.stateMachine)
				return;

			/*const QList<QwtPickerMachine::Command>*/
			var commandList =
				d_data.stateMachine.transition(this, event);

			var pos;
			switch (event.type) {
				//case QEvent::MouseButtonDblClick:
				case mousedownEvent:
				//case QEvent::MouseButtonRelease:
				case mouseupEvent:
				//case QEvent::MouseMove:
				case mousemoveEvent: {
					var me = event;

					var pos = new Misc.Point(me.clientX, me.clientY);
					//var pos = new Misc.Point(mouseEvent.clientX, mouseEvent.clientY)

					if (Static.isMobile()) {
						pos = new Misc.Point(event.originalEvent.changedTouches[0].clientX, event.originalEvent.changedTouches[0].clientY)
						//pos = new Misc.Point(event.originalEvent.touches[0].clientX, event.originalEvent.touches[0].clientY)
					}


					//pos = this.parentWidget().mapToElement( new Misc.Point(me.clientX, me.clietY) );
					//console.log(me.clientY)
					pos = this.parentWidget().mapToElement(pos);
					break;
				}
				default:
					//pos = this.parentWidget()->mapFromGlobal( QCursor::pos() );
					pos = this.parentWidget().mapToElement(new Misc.Point(0, 0));
			}

			for (var i = 0; i < commandList.length; i++) {
				switch (commandList[i]) {
					case Static.Begin: {
						this.begin();
						break;
					}
					case Static.Append: {
						this.append(pos);
						break;
					}
					case Static.Move: {
						this.move(pos);
						break;
					}
					case Static.Remove: {
						this.remove();
						break;
					}
					case Static.End: {
						this.end();
						break;
					}
				}
			}
		}

		/*!
		Reset the state machine and terminate ( end(false) ) the selection
		 */
		this.reset = function () {
			if (d_data.stateMachine)
				d_data.stateMachine.reset();

			if (this.isActive())
				this.end(false);
		}

		/*!
		Append a point to the selection and update rubber band and tracker.
		The appended() signal is emitted.

		\param pos Additional point

		\sa isActive(), begin(), end(), move(), appended()
		 */
		this.append = function (/*const QPoint*/ pos) {
			if (d_data.isActive) {
				/*var idx = d_data.pickedPoints.length;
				d_data.pickedPoints.resize( idx + 1 );
				d_data.pickedPoints[idx] = pos;*/

				//d_data.pickedPoints.resize( 0 )
				d_data.pickedPoints.push(pos);

				this.updateDisplay();
				//Q_EMIT appended( pos );
				Static.trigger('appended', pos)
			}
		}

		/*!
		Move the last point of the selection
		The moved() signal is emitted.

		\param pos New position
		\sa isActive(), begin(), end(), append()
		 */
		this.move = function (/*const QPoint*/ pos) {
			if (d_data.isActive) {
				var idx = d_data.pickedPoints.length - 1;
				if (idx >= 0) {
					if (d_data.pickedPoints[idx] != pos) {
						d_data.pickedPoints[idx] = pos;

						this.updateDisplay();

						//Q_EMIT moved( pos );
						Static.trigger('moved', pos)
					}
				}
			}
		}

		/*!
		Remove the last point of the selection
		The removed() signal is emitted.

		\sa isActive(), begin(), end(), append(), move()
		 */
		this.remove = function () {
			if (d_data.isActive) {
				var idx = d_data.pickedPoints.length - 1;
				if (idx > 0) {
					//var idx = d_data.pickedPoints.length;

					//var pos = d_data.pickedPoints[idx - 1];
					var pos = d_data.pickedPoints.pop()
					//d_data.pickedPoints.resize( idx - 1 );

					this.updateDisplay();
					Static.trigger('removed', pos);
				}
			}
		}

		/*!
		\brief Validate and fix up the selection

		Accepts all selections unmodified

		\param selection Selection to validate and fix up
		\return true, when accepted, false otherwise
		 */
		this.accept = function (/*QPolygon &*/ selection) {
			//Q_UNUSED( selection );
			return true;
		}

		/*!
		A picker is active between begin() and end().
		\return true if the selection is active.
		 */
		this.isActive = function () {
			return d_data.isActive;
		}

		/*!
		Return the points, that have been collected so far. The selection()
		is calculated from the pickedPoints() in adjustedPoints().
		\return Picked points
		 */
		this.pickedPoints = function () {
			return d_data.pickedPoints;
		}

		/*!
		Scale the selection by the ratios of oldSize and newSize
		The changed() signal is emitted.

		\param oldSize Previous size
		\param newSize Current size

		\sa ResizeMode, setResizeMode(), resizeMode()
		 */
		/*this.stretchSelection = function( const QSize &oldSize, const QSize &newSize )
	{
		if ( oldSize.isEmpty() )
	{
		// avoid division by zero. But scaling for small sizes also
		// doesn't make much sense, because of rounding losses. TODO ...
		return;
		}

		const double xRatio =
		double( newSize.width() ) / double( oldSize.width() );
		const double yRatio =
		double( newSize.height() ) / double( oldSize.height() );

		for ( int i = 0; i < int( d_data->pickedPoints.count() ); i++ )
	{
		QPoint &p = d_data->pickedPoints[i];
		p.setX( qRound( p.x() * xRatio ) );
		p.setY( qRound( p.y() * yRatio ) );

		Q_EMIT changed( d_data->pickedPoints );
		}
		}*/

		/*!
		Set mouse tracking for the observed widget.

		In case of enable is true, the previous value
		is saved, that is restored when enable is false.

		\warning Even when enable is false, mouse tracking might be restored
		to true. When mouseTracking for the observed widget
		has been changed directly by QWidget::setMouseTracking
		while mouse tracking has been set to true, this value can't
		be restored.
		 */

		this.setMouseTracking = function (enable) {
			var widget = this.parentWidget();
			if (!widget)
				return;

			if (enable) {
				d_data.mouseTracking = widget.hasMouseTracking();
				widget.setMouseTracking(true);
			} else {
				widget.setMouseTracking(d_data.mouseTracking);
			}
		}

		/*!
		Find the area of the observed widget, where selection might happen.

		\return parentWidget()->contentsRect()
		 */
		this.pickArea = function () {
			//QPainterPath path;

			var widget = this.parentWidget();
			if (widget)
				return (widget.contentsRect());
			return null

			//return path;
		}

		//! Update the state of rubber band and tracker label
		this.updateDisplay = function () {
			/*QWidget*/
			var w = this.parentWidget();

			var showRubberband = false;
			var showTracker = false;

			if (w && w.isVisible() && d_data.enabled) {
				//console.log("this.isActive(): "+this.isActive())
				if (this.rubberBand() !== Picker.RubberBand.NoRubberBand && this.isActive() &&
					this.rubberBandPen().style !== Static.NoPen) {
					showRubberband = true;
				}

				if (this.trackerMode() == Picker.DisplayMode.AlwaysOn ||
					(this.trackerMode() == Picker.DisplayMode.ActiveOnly && this.isActive())) {
					if (this.trackerPen() != Static.NoPen)
					//&& !this.trackerRect( QFont() ).isEmpty() )
					{
						showTracker = true;
					}
				}
			}

			/*QPointer< QwtPickerRubberband >*/
			var rw = d_data.rubberBandOverlay;
			if (showRubberband) {
				//if ( rw.isNull() )
				if (rw == null) {
					//rw = new PickerRubberband( this, null ); // NULL -> no extra event filter
					rw = new PickerRubberband(this, w);
					//console.log("rubberBandOverlay created")
					rw.setObjectName("PickerRubberBand");
					d_data.rubberBandOverlay = rw
					//rw.setParent( w );
					//rw->resize( w->size() );
				}

				//if ( d_data.rubberBand <= Picker.RubberBand.RectRubberBand )
				//rw->setMaskMode( QwtWidgetOverlay::MaskHint );
				//else
				//rw->setMaskMode( QwtWidgetOverlay::AlphaMask );

				rw.updateOverlay();
			} else {
				/*if ( d_data->openGL ){
				// Qt 4.8 crashes for a delete
				if ( !rw.isNull() ){
				rw->hide();
				rw->deleteLater();
				rw = NULL;
				}
				}
				else{
				delete rw;
				}*/
				if (rw) {
					d_data.rubberBandOverlay.getCanvas().hide()
					delete d_data.rubberBandOverlay.getCanvas()
					d_data.rubberBandOverlay = null
				}
			}

			/*QPointer< QwtPickerTracker >*/
			var tw = d_data.trackerOverlay;
			if (showTracker) {
				//if ( tw.isNull() )
				if (tw == null) {

					//tw = new PickerTracker( this, null ); // NULL -> no extra event filter
					tw = new PickerTracker(this, w);
					//console.log("trackerOverlay created")
					tw.setObjectName("PickerTracker");
					d_data.trackerOverlay = tw
					//tw.setParent( w );
					// tw->resize( w->size() );
				}
				tw.setFont(d_data.trackerFont);
				tw.updateOverlay();
			} else {
				/*if ( d_data->openGL ){
				// Qt 4.8 crashes for a delete
				if ( !tw.isNull() ){
				tw->hide();
				tw->deleteLater();
				tw = NULL;
				}
				}*/
				/* else
			{
				delete tw;
				}*/

				if (tw) {
					//d_data.trackerOverlay.clearCanvas()
					//d_data.trackerOverlay = null
					d_data.trackerOverlay.getCanvas().hide()
					delete d_data.trackerOverlay.getCanvas()
					d_data.trackerOverlay = null
				}
			}
		}

		//! \return Overlay displaying the rubber band
		this.rubberBandOverlay = function () {
			return d_data.rubberBandOverlay;
		}

		//! \return Overlay displaying the tracker text
		this.trackerOverlay = function () {
			return d_data.trackerOverlay;
		}

		/*this.widgetMouseReleaseEvent = function( mouseEvent ) {
		this.transition( mouseEvent );
		}*/

		if (rubberBand == undefined && trackerMode == undefined)
			this.init(parent, Picker.RubberBand.NoRubberBand, Picker.DisplayMode.AlwaysOff);
		else
			this.init(parent, rubberBand, trackerMode);

	}

	/*!
	Handle a enter event for the observed widget.

	\param event Qt event

	\sa eventFilter(), widgetMousePressEvent(), widgetMouseReleaseEvent(),
	widgetMouseDoubleClickEvent(),
	widgetWheelEvent(), widgetKeyPressEvent(), widgetKeyReleaseEvent()
	 */
	widgetEnterEvent(event) {
		this.transition(event);
	}

	/*!
	Handle a leave event for the observed widget.

	\param event Qt event

	\sa eventFilter(), widgetMousePressEvent(), widgetMouseReleaseEvent(),
	widgetMouseDoubleClickEvent(),
	widgetWheelEvent(), widgetKeyPressEvent(), widgetKeyReleaseEvent()
	 */
	widgetLeaveEvent(event) {
		this.transition(event);

		this.getPickerData().trackerPosition = new Misc.Point(-1, -1);
		if (!this.isActive())
			this.updateDisplay();
	}

	/*!
	Handle a key release event for the observed widget.

	Passes the event to the state machine.

	\param keyEvent Key event

	\sa eventFilter(), widgetMousePressEvent(), widgetMouseReleaseEvent(),
	widgetMouseDoubleClickEvent(), widgetMouseMoveEvent(),
	widgetWheelEvent(), widgetKeyPressEvent(), stateMachine()
	 */
	widgetKeyReleaseEvent(keyEvent) {
		this.transition(keyEvent);
	}

	/*!
	Handle a wheel event for the observed widget.

	Move the last point of the selection in case of isActive() == true

	\param wheelEvent Wheel event

	\sa eventFilter(), widgetMousePressEvent(), widgetMouseReleaseEvent(),
	widgetMouseDoubleClickEvent(), widgetMouseMoveEvent(),
	widgetKeyPressEvent(), widgetKeyReleaseEvent()
	 */
	widgetWheelEvent(wheelEvent) {
		var pos = new Misc.Point(wheelEvent.clientX, wheelEvent.clientY)
		if (this.pickArea().contains(pos))
			this.getPickerData().trackerPosition = pos;
		else
			this.getPickerData().trackerPosition = new Misc.Point(-1, -1);

		this.updateDisplay();

		this.transition(wheelEvent);
	}

	/*!
	Handle mouse double click event for the observed widget.

	\param mouseEvent Mouse event

	\sa eventFilter(), widgetMousePressEvent(), widgetMouseReleaseEvent(),
	widgetMouseMoveEvent(),
	widgetWheelEvent(), widgetKeyPressEvent(), widgetKeyReleaseEvent()
	 */
	widgetMouseDoubleClickEvent(mouseEvent) {
		this.transition(mouseEvent);
	}

	/*!
	Handle a mouse move event for the observed widget.

	\param mouseEvent Mouse event

	\sa eventFilter(), widgetMousePressEvent(), widgetMouseReleaseEvent(),
	widgetMouseDoubleClickEvent(),
	widgetWheelEvent(), widgetKeyPressEvent(), widgetKeyReleaseEvent()
	 */

	/*if ( !Static.isMobile()){
					   //this.showCursor(true)
					   deltaX = event.clientX-initialPosX;
					   deltaY = event.clientY-initialPosY;

				   }else{
					   var touchobj = event.originalEvent.changedTouches[0] // reference first touch point for this event
					   deltaX = parseInt(touchobj.clientX)-initialPosX;
					   deltaY = parseInt(touchobj.clientY)-initialPosY;
				   }*/
	widgetMouseMoveEvent(mouseEvent) {

		/////////////////////
		var pos = new Misc.Point(mouseEvent.clientX, mouseEvent.clientY);
		//var pos = new Misc.Point(mouseEvent.clientX, mouseEvent.clientY)

		if (Static.isMobile()) {
			pos = new Misc.Point(mouseEvent.originalEvent.changedTouches[0].clientX, mouseEvent.originalEvent.changedTouches[0].clientY)
			//pos = new Misc.Point(mouseEvent.originalEvent.touches[0].clientX, mouseEvent.originalEvent.touches[0].clientY)
		}
		pos = this.mapToElement(pos);

		if (this.pickArea().contains(pos))
			this.getPickerData().trackerPosition = pos;
		else
			this.getPickerData().trackerPosition = new Misc.Point(-1, -1);

		if (!this.isActive())
			this.updateDisplay();

		this.transition(mouseEvent);
	}

	/*!
	Handle a mouse press event for the observed widget.

	\param mouseEvent Mouse event

	\sa eventFilter(), widgetMouseReleaseEvent(),
	widgetMouseDoubleClickEvent(), widgetMouseMoveEvent(),
	widgetWheelEvent(), widgetKeyPressEvent(), widgetKeyReleaseEvent()
	 */
	widgetMousePressEvent(mouseEvent) {
		this.transition(mouseEvent);
	}

	/*!
	Handle a key press event for the observed widget.

	Selections can be completely done by the keyboard. The arrow keys
	move the cursor, the abort key aborts a selection. All other keys
	are handled by the current state machine.

	\param keyEvent Key event

	\sa eventFilter(), widgetMousePressEvent(), widgetMouseReleaseEvent(),
	widgetMouseDoubleClickEvent(), widgetMouseMoveEvent(),
	widgetWheelEvent(), widgetKeyReleaseEvent(), stateMachine(),
	QwtEventPattern::KeyPatternCode
	 */
	widgetKeyPressEvent(keyEvent) {
		var dx = 0;
		var dy = 0;

		var offset = 1;
		// if ( keyEvent->isAutoRepeat() )
		//offset = 5;
		const Enum = Enumerator.getDefaultEnumNampespace();
		if (this.keyMatch(Enum.KeyPatternCode.KeyLeft, keyEvent))
			dx = -offset;
		else if (this.keyMatch(Enum.KeyPatternCode.KeyRight, keyEvent))
			dx = offset;
		else if (this.keyMatch(Enum.KeyPatternCode.KeyUp, keyEvent))
			dy = -offset;
		else if (this.keyMatch(Enum.KeyPatternCode.KeyDown, keyEvent))
			dy = offset;
		else if (this.keyMatch(Enum.KeyPatternCode.KeyAbort, keyEvent)) {
			this.reset();
		} else
			this.transition(keyEvent);

		if (dx !== 0 || dy !== 0) {
			///*const QRect* rect = pickArea().boundingRect().toRect();
			/*const QRect*/
			var rect = pickArea() //.boundingRect().toRect();
			/*const QPoint*/
			var pos = this.parentWidget().mapToElement(new Misc.Point(clientX, clientY));

			var x = pos.x + dx;
			x = Math.max(rect.left(), x);
			x = Math.min(rect.right(), x);

			var y = pos.y + dy;
			y = Math.max(rect.top(), y);
			y = Math.min(rect.bottom(), y);

			//QCursor::setPos( parentWidget()->mapToGlobal( QPoint( x, y ) ) );
		}
	}

	/*!
	Handle a mouse release event for the observed widget.

	\param mouseEvent Mouse event

	\sa eventFilter(), widgetMousePressEvent(),
	widgetMouseDoubleClickEvent(), widgetMouseMoveEvent(),
	widgetWheelEvent(), widgetKeyPressEvent(), widgetKeyReleaseEvent()
	 */
	widgetMouseReleaseEvent(mouseEvent) {
		this.transition(mouseEvent);
	}

	/*!
	\brief Close a selection setting the state to inactive.

	The selection is validated and maybe fixed by accept().

	\param ok If true, complete the selection and emit a selected signal
	otherwise discard the selection.
	\return true if the selection is accepted, false otherwise
	\sa isActive(), begin(), append(), move(), selected(), accept()
	 */
	end(ok) {
		var d = this.getPickerData();
		if (d.isActive) {
			this.setMouseTracking(false);

			d.isActive = false;
			//Q_EMIT activated( false );
			Static.trigger('activated', false);

			if (this.trackerMode() == Picker.DisplayMode.ActiveOnly)
				d.trackerPosition = new Misc.Point(-1, -1);

			if (ok)
				ok = this.accept(d.pickedPoints);

			if (ok)
				//Q_EMIT selected( d_data->pickedPoints );
				Static.trigger('selected', d.pickedPoints);
			else
				d.pickedPoints = [];//.resize(0);

			this.updateDisplay();
		} else
			ok = false;

		return ok;
	}

	/*!
	Open a selection setting the state to active

	\sa isActive(), end(), append(), move()
	 */
	begin() {
		var d = this.getPickerData();
		if (!d)
			return;
		if (d.isActive)
			return;

		d.pickedPoints = []//.resize( 0 );
		d.isActive = true;
		//Q_EMIT activated( true );
		Static.trigger('activated', true);

		if (this.trackerMode() !== Picker.DisplayMode.AlwaysOff) {
			if (d.trackerPosition.x < 0 || d.trackerPosition.y < 0) {
				var w = this.parentWidget();
				if (w)
					//d_data.trackerPosition = w->mapFromGlobal( QCursor::pos() );
					d.trackerPosition = w.mapToElement(new Misc.Point(0, 0));
			}
		}

		this.updateDisplay();
		this.setMouseTracking(true);
	}

	/*!
	\brief Return the label for a position

	In case of HLineRubberBand the label is the value of the
	y position, in case of VLineRubberBand the value of the x position.
	Otherwise the label contains x and y position separated by a ',' .

	The format for the string conversion is "%d".

	\param pos Position
	\return Converted position as string
	 */
	trackerText(pos) {
		//pos =  this.invTransform( pos )
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

} //////////////////


Picker.pickers = [];
Enumerator.enum("RubberBand {\
	NoRubberBand = 0 , HLineRubberBand , VLineRubberBand , CrossRubberBand ,\
	RectRubberBand , EllipseRubberBand , PolygonRubberBand , UserRubberBand = 100\
  }", Picker);

Enumerator.enum("DisplayMode { AlwaysOff , AlwaysOn , ActiveOnly }", Picker);