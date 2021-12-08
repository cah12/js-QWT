/*!
\brief QwtPlotZoomer provides stacked zooming for a plot widget

QwtPlotZoomer selects rectangles from user inputs ( mouse or keyboard )
translates them into plot coordinates and adjusts the axes to them.
The selection is supported by a rubber band and optionally by displaying
the coordinates of the current mouse position.

Zooming can be repeated as often as possible, limited only by
maxStackDepth() or minZoomSize().  Each rectangle is pushed on a stack.

The default setting how to select rectangles is
a QwtPickerDragRectMachine with the following bindings:

- QwtEventPattern::MouseSelect1\n
The first point of the zoom rectangle is selected by a mouse press,
the second point from the position, where the mouse is released.

- QwtEventPattern::KeySelect1\n
The first key press selects the first, the second key press
selects the second point.

- QwtEventPattern::KeyAbort\n
Discard the selection in the state, where the first point
is selected.

To traverse the zoom stack the following bindings are used:

- QwtEventPattern::MouseSelect3, QwtEventPattern::KeyUndo\n
Zoom out one position on the zoom stack

- QwtEventPattern::MouseSelect6, QwtEventPattern::KeyRedo\n
Zoom in one position on the zoom stack

- QwtEventPattern::MouseSelect2, QwtEventPattern::KeyHome\n
Zoom to the zoom base

The setKeyPattern() and setMousePattern() functions can be used
to configure the zoomer actions. The following example
shows, how to configure the 'I' and 'O' keys for zooming in and out
one position on the zoom stack. The "Home" key is used to
"unzoom" the plot.

\code
zoomer = new QwtPlotZoomer( plot );
zoomer->setKeyPattern( QwtEventPattern::KeyRedo, Qt::Key_I, Qt::ShiftModifier );
zoomer->setKeyPattern( QwtEventPattern::KeyUndo, Qt::Key_O, Qt::ShiftModifier );
zoomer->setKeyPattern( QwtEventPattern::KeyHome, Qt::Key_Home );
\endcode

QwtPlotZoomer is tailored for plots with one x and y axis, but it is
allowed to attach a second QwtPlotZoomer ( without rubber band and tracker )
for the other axes.

\note The realtime example includes an derived zoomer class that adds
scrollbars to the plot canvas.

\sa QwtPlotPanner, QwtPlotMagnifier
 */

class PrivateData_2 {
	constructor() {
		this.zoomRectIndex;
		/*QStack<QRectF>*/
		this.zoomStack = [];

		this.maxStackDepth;
	}
};

class PlotZoomer extends PlotPicker {
	constructor(xAxis, yAxis, /*QWidget **/ canvas, doReplot = true) {
		if (typeof(xAxis) !== 'number') { //first argument is a widget
			canvas = xAxis
				super(canvas)
		} else {
			super(xAxis, yAxis, canvas)
		}
		
		

		/*if ( canvas )
		this.init( doReplot );*/

		var self = this;

		/*PrivateData*/
		var d_data;

		this.getZoomerData = function () {
			return d_data
		}

		//! Init the zoomer, used by the constructors
		this.init = function (doReplot) {
			d_data = new PrivateData_2();

			d_data.maxStackDepth = -1;

			this.setTrackerMode(Static.ActiveOnly);
			//this.setTrackerMode( Static.AlwaysOn );
			this.setRubberBand(Static.RectRubberBand);
			this.setStateMachine(new PickerDragRectMachine());

			this.plot().zoomer = this;

			Static.trigger('zoomerAdded', this)

			if (doReplot && this.plot()){				
				this.plot().replot();
			}

			this.setZoomBase(this.scaleRect());
		}

		/*!
		Reinitialized the zoom stack with scaleRect() as base.

		\param doReplot Call QwtPlot::replot() for the attached plot before initializing
		the zoomer with its scales. This might be necessary,
		when the plot is in a state with pending scale changes.

		\sa zoomBase(), scaleRect() QwtPlot::autoReplot(), QwtPlot::replot().
		 */
		this.setZoomBase = function (doReplot = true) { //or  /*setZoomBase( const QRectF & );*/
			if (typeof(doReplot) == 'object') {
				var base = doReplot
					var plt = this.plot();
				if (!plt)
					return;

				/*const QRectF*/
				var sRect = this.scaleRect();
				/*const QRectF*/
				var bRect = base | sRect;
				var bRect = null
					if (!base)
						bRect = sRect 
          else
						bRect = base

				//d_data.zoomStack.clear();
				d_data.zoomStack = [];
				d_data.zoomStack.push(bRect);
				d_data.zoomRectIndex = 0;

				if (!base.isEqual(sRect)) {
					d_data.zoomStack.push(sRect);
					d_data.zoomRectIndex++;
				}

				this.rescale();

			} else {

				var plt = this.plot();
				if (plt == null)
					return;

				if (doReplot)
					plt.replot();

				//d_data.zoomStack.clear();
				d_data.zoomStack = []
				d_data.zoomStack.push(this.scaleRect());
				d_data.zoomRectIndex = 0;

				this.rescale();
			}
		}

		/*!
		\return Initial rectangle of the zoomer
		\sa setZoomBase(), zoomRect()
		 */
		/*QRectF */
		this.zoomBase = function () {
			return d_data.zoomStack[0];
		}

		/*!
		\return Rectangle at the current position on the zoom stack.
		\sa zoomRectIndex(), scaleRect().
		 */
		/*QRectF*/
		this.zoomRect = function () {
			return d_data.zoomStack[d_data.zoomRectIndex];
		}

		/*!
		\brief Limit the number of recursive zoom operations to depth.

		A value of -1 set the depth to unlimited, 0 disables zooming.
		If the current zoom rectangle is below depth, the plot is unzoomed.

		\param depth Maximum for the stack depth
		\sa maxStackDepth()
		\note depth doesn't include the zoom base, so zoomStack().count() might be
		maxStackDepth() + 1.
		 */
		this.setMaxStackDepth = function (depth) {
			d_data.maxStackDepth = depth;

			if (depth >= 0) {
				// unzoom if the current depth is below d_data2->maxStackDepth

				/*const int*/
				var zoomOut =
					(d_data.zoomStack.length) - 1 - depth; // -1 for the zoom base

				if (zoomOut > 0) {
					this.zoom(-zoomOut);
					for (var i = (d_data.zoomStack.length) - 1;
						i > (d_data.zoomRectIndex); i--) {
						d_data.zoomStack.pop(); // remove trailing rects
					}
				}
			}
		}

		/*!
		\return Maximal depth of the zoom stack.
		\sa setMaxStackDepth()
		 */
		this.maxStackDepth = function () {
			return d_data.maxStackDepth;
		}

		/*!
		\return The zoom stack. zoomStack()[0] is the zoom base,
		zoomStack()[1] the first zoomed rectangle.

		\sa setZoomStack(), zoomRectIndex()

		/*QStack<QRectF>*/
		this.zoomStack = function () {
			return d_data.zoomStack;
		}

		/*!
		\brief Assign a zoom stack

		In combination with other types of navigation it might be useful to
		modify to manipulate the complete zoom stack.

		\param zoomStack New zoom stack
		\param zoomRectIndex Index of the current position of zoom stack.
		In case of -1 the current position is at the top
		of the stack.

		\note The zoomed signal might be emitted.
		\sa zoomStack(), zoomRectIndex()
		 */
		this.setZoomStack = function (/*QStack<QRectF>*/ zoomStack, zoomRectIndex = -1) {
			if (this.zoomStack.length == 0)
				return;

			if (d_data.maxStackDepth >= 0 &&
				(this.zoomStack.length) > d_data.maxStackDepth) {
				return;
			}

			if (zoomRectIndex < 0 || zoomRectIndex > (this.zoomStack.length))
				zoomRectIndex = zoomStack.length - 1;

			var doRescale = this.zoomStack[zoomRectIndex] != this.zoomRect();

			d_data.zoomStack = zoomStack;
			d_data.zoomRectIndex = zoomRectIndex;

			if (doRescale) {
				this.rescale();
				//Q_EMIT zoomed( zoomRect() );
				Static.trigger('zoomed', this.zoomRect())
			}

		}

		/*!
		\return Index of current position of zoom stack.
		 */
		this.zoomRectIndex = function () {
			return d_data.zoomRectIndex;
		}

		//public Q_SLOTS:

		/*!
		Move the current zoom rectangle.

		\param dx X offset
		\param dy Y offset

		\note The changed rectangle is limited by the zoom base
		 */
		this.moveBy = function (dx, dy) {
			/*const QRectF*/
			var rect = d_data.zoomStack[d_data.zoomRectIndex];
			moveTo(new Misc.Point(rect.left() + dx, rect.top() + dy));
		}

		/*!
		Move the the current zoom rectangle.

		\param pos New position

		\sa QRectF::moveTo()
		\note The changed rectangle is limited by the zoom base
		 */
		this.moveTo = function (/*const QPointF*/ pos) {
			var x = pos.x;
			var y = pos.y;

			if (x < this.zoomBase().left())
				x = this.zoomBase().left();
			if (x > this.zoomBase().right() - this.zoomRect().width())
				x = this.zoomBase().right() - this.zoomRect().width();

			if (y < this.zoomBase().top())
				y = this.zoomBase().top();
			if (y > this.zoomBase().bottom() - this.zoomRect().height())
				y = this.zoomBase().bottom() - this.zoomRect().height();

			if (x != this.zoomRect().left() || y != this.zoomRect().top()) {
				d_data.zoomStack[d_data.zoomRectIndex].moveTo(x, y);
				this.rescale();
			}
		}

		/*!
		\brief Zoom in

		Clears all rectangles above the current position of the
		zoom stack and pushes the normalized rectangle on it.

		\note If the maximal stack depth is reached, zoom is ignored.
		\note The zoomed signal is emitted.
		 */
		this.zoom = function (/*QRectF*/ rect) { //or /*virtual void zoom( int up );*/
			if (typeof(rect) == 'number') {
				var offset = rect;
				if (offset == 0)
					d_data.zoomRectIndex = 0;
				else {
					var newIndex = d_data.zoomRectIndex + offset;
					newIndex = Math.max(0, newIndex);
					newIndex = Math.min((d_data.zoomStack.length) - 1, newIndex);

					d_data.zoomRectIndex = newIndex;
				}

				this.rescale();

				//Q_EMIT zoomed( zoomRect() );
				Static.trigger('zoomed', this.zoomRect())
			} else {

				if (d_data.maxStackDepth >= 0 &&
					(d_data.zoomRectIndex) >= d_data.maxStackDepth) {
					return;
				}

				/*const QRectF*/
				//console.log(rect.right())
				var zoomRect = rect.normalized();
				//console.log(rect.right())
				if (!zoomRect.isEqual(d_data.zoomStack[d_data.zoomRectIndex])) {
					for (var i = (d_data.zoomStack.length) - 1;
						i > d_data.zoomRectIndex; i--) {
						d_data.zoomStack.pop();
					}

					d_data.zoomStack.push(zoomRect);
					d_data.zoomRectIndex++;

					this.rescale();

					//Q_EMIT zoomed( zoomRect );
					Static.trigger('zoomed', zoomRect)
				}
			}
		}

		//Q_SIGNALS:
		/*!
		A signal emitting the zoomRect(), when the plot has been
		zoomed in or out.

		\param rect Current zoom rectangle.
		 */

		//void zoomed( const QRectF &rect );

		//protected:

		/*!
		Adjust the observed plot to zoomRect()

		\note Initiates QwtPlot::replot()
		 */
		this.rescale = function () {
			var plt = this.plot();
			if (!plt)
				return;

			var rect = d_data.zoomStack[d_data.zoomRectIndex];
			/*if ( rect !== this.scaleRect() )*/
			if (!rect.isEqual(this.scaleRect())) {
				var doReplot = plt.autoReplot();
				plt.setAutoReplot(false);

				var x1 = rect.left();
				var x2 = rect.right();
				if (!plt.axisScaleDiv(this.xAxis()).isIncreasing()) {
					//qSwap( x1, x2 );
					var temp = x1
						x1 = x2
						x2 = x1
				}

				plt.setAxisScale(this.xAxis(), x1, x2);

				var y1 = rect.top();
				var y2 = rect.bottom();
				if (!plt.axisScaleDiv(this.yAxis()).isIncreasing()) {
					//qSwap( y1, y2 );
					var temp = y1
						y1 = y2
						y2 = y1
				}

				plt.setAxisScale(this.yAxis(), y1, y2);

				plt.setAutoReplot(doReplot);

				plt.replot();
			}

		}

		/*!
		\brief Limit zooming by a minimum rectangle

		\return zoomBase().width() / 10e4, zoomBase().height() / 10e4
		 */
		/*QSizeF*/
		this.minZoomSize = function () {
			return new Misc.Size(d_data.zoomStack[0].width() / 10e4,
				d_data.zoomStack[0].height() / 10e4);
		}

		/*!
		\brief Check and correct a selected rectangle

		Reject rectangles with a height or width < 2, otherwise
		expand the selected rectangle to a minimum size of 11x11
		and accept it.

		\return true If the rectangle is accepted, or has been changed
		to an accepted one.
		 */
		this.accept = function (/*QPolygon*/ pa) {
			if (pa.length < 2)
				return false;

			var rect = new Misc.Rect(pa[0], pa[pa.length - 1]);
			rect = rect.normalized();

			var minSize = 2;
			if (rect.width() < minSize && rect.height() < minSize)
				return false;

			var minZoomSize = 11;

			/*const QPoint*/
			var center = rect.center();
			rect.setSize(rect.size().expandedTo(new Misc.Size(minZoomSize, minZoomSize)));
			rect.moveCenter(center);

			pa.resize(2);
			pa[0] = rect.topLeft();
			pa[1] = rect.bottomRight();

			return true;
		}

		if (canvas)
			this.init(doReplot);
    

	}

	/*!
	Qt::Key_Plus zooms in, Qt::Key_Minus zooms out one position on the
	zoom stack, Qt::Key_Escape zooms out to the zoom base.

	Changes the current position on the stack, but doesn't pop
	any rectangle.

	\note The keys codes can be changed, using
	QwtEventPattern::setKeyPattern: 3, 4, 5
	 */
	widgetKeyPressEvent(ke) {
		if (!this.isActive()) {
			if (this.keyMatch(KeyUndo, ke))
				this.zoom(-1);
			else if (this.keyMatch(KeyRedo, ke))
				this.zoom(+1);
			else if (this.keyMatch(KeyHome, ke))
				this.zoom(0);
		}

		super.widgetKeyPressEvent(ke);

	}

	/*!
	Qt::MidButton zooms out one position on the zoom stack,
	Qt::RightButton to the zoom base.

	Changes the current position on the stack, but doesn't pop
	any rectangle.

	\note The mouse events can be changed, using
	QwtEventPattern::setMousePattern: 2, 1
	 */
	widgetMouseReleaseEvent(me) {
		if (this.mouseMatch(MouseSelect2, me))
			;//this.zoom(0);
		else if (this.mouseMatch(MouseSelect3, me))
			this.zoom(-1);
		else if (this.mouseMatch(MouseSelect6, me))
			this.zoom(+1);
		else
			super.widgetMouseReleaseEvent(me)

	}

	/*!
	Expand the selected rectangle to minZoomSize() and zoom in
	if accepted.

	\param ok If true, complete the selection and emit selected signals
	otherwise discard the selection.

	\sa accept(), minZoomSize()
	\return True if the selection has been accepted, false otherwise
	 */
	end(ok = true) {
		ok = super.end(ok);
		if (!ok)
			return false;

		var plot = this.plot();
		if (!plot)
			return false;

		/*const QPolygon*/
		var pa = this.selection();
		if (pa.length < 2)
			return false;

		var rect = new Misc.Rect(pa[0], pa[(pa.length - 1)]);
		rect = rect.normalized();

		var zoomRect = this.invTransform(rect).normalized();
		//console.log(zoomRect.right())

		/*const QSizeF*/
		var minSize = this.minZoomSize();
		if (minSize.isValid()) {
			/*const QPointF*/
			var center = zoomRect.center();
			zoomRect.setSize(zoomRect.size().expandedTo(this.minZoomSize()));
			//console.log(zoomRect.right())
			zoomRect.moveCenter(center);
		}
		//console.log(zoomRect.right())
		this.zoom(zoomRect);

		return true;
	}

	/*!
	Rejects selections, when the stack depth is too deep, or
	the zoomed rectangle is minZoomSize().

	\sa minZoomSize(), maxStackDepth()
	 */
	begin() {
		var d = this.getZoomerData()
			if (d.maxStackDepth >= 0) {
				if (d.zoomRectIndex >= (d.maxStackDepth))
					return;
			}

			/*const QSizeF*/
			var minSize = this.minZoomSize();
		if (minSize.isValid()) {
			/*const QSizeF*/
			var sz =
				//d.zoomStack[d.zoomRectIndex].size() * 0.9999;
				new Misc.Size(d.zoomStack[d.zoomRectIndex].width() * 0.9999,
					d.zoomStack[d.zoomRectIndex].height() * 0.9999)

				if (minSize.width >= sz.width && minSize.height >= sz.height) {
					return;
				}
		}
		//ParentClass.prototype.myMethod.call(this)
		super.begin();
	}

	/*!
	Reinitialize the axes, and set the zoom base to their scales.

	\param xAxis X axis
	\param yAxis Y axis
	 */
	setAxis(xAxis, yAxis) {
		if (xAxis != super.xAxis() || yAxis != super.yAxis()) {
			super.setAxis(xAxis, yAxis);
			if(this.setZoomBase !== undefined)
				this.setZoomBase(this.scaleRect());
		}
	}

};
