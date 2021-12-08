'use strict';
//define(function(){
////////////////////Magnifier///////////////////////start
class Magnifier extends HObject {
	constructor(plot) {
		super(plot)
		//var self = this;
		var m_plot = null;
		var m_isEnabled = true;
		var m_wheelFactor = 1.9;
		var m_wheelModifiers = Static.NoModifier;
		var m_mouseFactor = 0.95;
		var m_mouseButton = Static.RightButton;
		var m_mouseButtonModifiers = Static.NoModifier;
		var m_keyFactor = 0.9;
		var m_zoomInKey = 107; //Key_Plus;
		var m_zoomInKeyModifiers = Static.Key_Shift //Static.NoModifier;
			var m_zoomOutKey = 109; //Key_Minus;
		var m_zoomOutKeyModifiers = Static.Key_Shift //Static.NoModifier;
			var m_mousePressed = false;
		var m_zoomInKeyModifiersEnabled = false;
		var m_zoomOutKeyModifiersEnabled = false;

		var initialPosX = 0;
		var initialPosY = 0;

		var m_isAxisEnabled = [];

		for (var axis = 0; axis < axisCnt; axis++)
			m_isAxisEnabled[axis] = true;

		m_isAxisEnabled[1] = false;
		m_isAxisEnabled[3] = false;

		/*!
		\brief En/Disable an axis

		Only Axes that are enabled will be zoomed.
		All other axes will remain unchanged.

		\param axis Axis, see QwtPlot::Axis
		\param on On/Off

		\sa isAxisEnabled()
		 */
		this.setAxisEnabled = function (axis, on) {
			if (axis >= 0 && axis < axisCnt)
				m_isAxisEnabled[axis] = on;
		}

		/*!
		Test if an axis is enabled

		\param axis Axis, see QwtPlot::Axis
		\return True, if the axis is enabled

		\sa setAxisEnabled()
		 */
		this.isAxisEnabled = function (axis) {
			if (axis >= 0 && axis < axisCnt)
				return m_isAxisEnabled[axis];

			return true;
		}

		
		if (typeof(plot) !== "undefined") {
			plot.magnifier = this
				m_plot = plot;
			this.setElement(m_plot.getLayout().getCentralDiv());
		}

		this.plot = function () {
			return m_plot;
		}

		/*!
		\brief Change the wheel factor

		The wheel factor defines the ratio between the current range
		on the parent widget and the zoomed range for each step of the wheel.

		Use values > 1 for magnification (i.e. 2.0) and values < 1 for
		scaling down (i.e. 1/2.0 = 0.5). You can use this feature for
		inverting the direction of the wheel.

		The default value is 0.9.

		\param factor Wheel factor
		\sa wheelFactor(), setWheelButtonState(),
		setMouseFactor(), setKeyFactor()
		 */
		this.setWheelFactor = function (factor) {
			m_wheelFactor = factor;
		}

		/*!
		\return Wheel factor
		\sa setWheelFactor()
		 */
		this.wheelFactor = function () {
			return m_wheelFactor;
		}

		/*!
		Assign keyboard modifiers for zooming in/out using the wheel.
		The default modifiers are Qt::NoModifiers.

		\param modifiers Keyboard modifiers
		\sa wheelModifiers()
		 */
		this.setWheelModifiers = function (modifiers) {
			m_wheelModifiers = modifiers;
		}

		/*!
		\return Wheel modifiers
		\sa setWheelModifiers()
		 */
		this.wheelModifiers = function () {
			return m_wheelModifiers;
		}

		/*!
		\brief Change the mouse factor

		The mouse factor defines the ratio between the current range
		on the parent widget and the zoomed range for each vertical mouse movement.
		The default value is 0.95.

		\param factor Wheel factor
		\sa mouseFactor(), setMouseButton(), setWheelFactor(), setKeyFactor()
		 */
		this.setMouseFactor = function (factor) {
			m_mouseFactor = factor;
		}

		/*!
		\return Mouse factor
		\sa setMouseFactor()
		 */
		this.mouseFactor = function () {
			return m_mouseFactor;
		}

		/*!
		Assign the mouse button, that is used for zooming in/out.
		The default value is Qt::RightButton.

		\param button Button
		\param modifiers Keyboard modifiers

		\sa getMouseButton()
		 */
		this.setMouseButton = function (button, modifiers) {
			m_mouseButton = button;
			m_mouseButtonModifiers = modifiers;
		}

		//! \sa setMouseButton()
		this.getMouseButton = function () {
			return {
				button: m_mouseButton,
				modifiers: m_mouseButtonModifiers
			};
		}

		/*!
		\brief Change the key factor

		The key factor defines the ratio between the current range
		on the parent widget and the zoomed range for each key press of
		the zoom in/out keys. The default value is 0.9.

		\param factor Key factor
		\sa keyFactor(), setZoomInKey(), setZoomOutKey(),
		setWheelFactor, setMouseFactor()
		 */
		this.setKeyFactor = function (factor) {
			m_keyFactor = factor;
		}

		/*!
		\return Key factor
		\sa setKeyFactor()
		 */
		this.keyFactor = function () {
			return m_keyFactor;
		}

		/*!
		Assign the key, that is used for zooming in.
		The default combination is Qt::Key_Plus + Qt::NoModifier.

		\param key
		\param modifiers
		\sa getZoomInKey(), setZoomOutKey()
		 */
		this.setZoomInKey = function (key, modifiers) {
			m_zoomInKey = key;
			m_zoomInKeyModifiers = modifiers;
		}

		/*!
		\brief Retrieve the settings of the zoom in key

		\param key Key code, see Qt::Key
		\param modifiers Keyboard modifiers

		\sa setZoomInKey()
		 */
		this.getZoomInKey = function () {
			return {
				key: m_zoomInKey,
				modifiers: m_zoomInKeyModifiers
			};
		}

		/*!
		Assign the key, that is used for zooming out.
		The default combination is Qt::Key_Minus + Qt::NoModifier.

		\param key
		\param modifiers
		\sa getZoomOutKey(), setZoomOutKey()
		 */
		this.setZoomOutKey = function (key, modifiers) {
			m_zoomOutKey = key;
			m_zoomOutKeyModifiers = modifiers;
		}

		/*!
		\brief Retrieve the settings of the zoom out key

		\param key Key code, see Qt::Key
		\param modifiers Keyboard modifiers

		\sa setZoomOutKey()
		 */
		this.getZoomOutKey = function () {
			return {
				key: m_zoomOutKey,
				modifiers: m_zoomOutKeyModifiers
			};
		}

		this.setEnabled = function (on) {
			m_isEnabled = on;
		}

		this.isEnabled = function (on) {
			return m_isEnabled;
		}

		this.event = function (event) {
			if (!m_isEnabled)
				return;
			//console.log('event() called in Magnifier')
			switch (event.type) {
			case 'mousedown': {
					if (this.plot() == null) {
						//Magnifier.prototype.mousePressEvent.call(this, mouseEvent)
						return true;
					}

					//alert(mouseEvent.key)

					if ((event.button !== m_mouseButton) /*|| ( mouseEvent.modifiers != m_mouseButtonModifiers )*/) {
						return true;
					}
					initialPosX = event.clientX;
					initialPosY = event.clientY;
					m_mousePressed = true;

					return true
				}
				break;
			case 'mouseup': {

					if (event.button === m_mouseButton && m_mousePressed && this.plot()) {
						m_mousePressed = false;
						//parentWidget()->setMouseTracking( d_data->hasMouseTracking );
					}
					//HObject.prototype.mouseReleaseEvent.call(this, mouseEvent)
					//return false
				}
				break;
			case 'mousemove': {

					if (!m_mousePressed) //  || mouseEvent.button !== m_mouseButton)
						return;
					//alert("here")
					var dy = event.clientY - initialPosY;
					if (dy != 0) {
						var f = m_mouseFactor;
						if (dy < 0)
							f = 1 / f;

						this.rescale(f);
					}

					initialPosX = event.clientX;
					initialPosY = event.clientY;
				}
				break;
			case 'keydown': {
					//console.log(keyEvent.keyCode)
					if (event.keyCode == m_zoomInKeyModifiers) {
						m_zoomInKeyModifiersEnabled = true;
					}
					if (event.keyCode == m_zoomOutKeyModifiers) {
						m_zoomOutKeyModifiersEnabled = true;
					}

					if (event.keyCode == m_zoomInKey && m_zoomInKeyModifiersEnabled) {
						this.rescale(m_keyFactor);
					} else if (event.keyCode == m_zoomOutKey && m_zoomOutKeyModifiersEnabled) {
						this.rescale(1.0 / m_keyFactor);
					}
				}
				break;
			case 'keyup': {

					if (event.keyCode == m_zoomInKeyModifiers) {
						m_zoomInKeyModifiersEnabled = false;
					}
					if (event.keyCode == m_zoomOutKeyModifiers) {
						m_zoomOutKeyModifiersEnabled = false;
					}
				}
				break;
			case 'mousewheel': {
					//console.log(keyEvent)
					if (m_wheelFactor != 0.0) {
						var f = Math.pow(m_wheelFactor, Math.abs(event.deltaY / 15));
						if (event.deltaY > 0)
							f = 1 / f;
						this.rescale(f);
					}
				}
				break;
			default:
				// code block
			}
		}

		/*!
		Zoom in/out the axes scales
		\param factor A value < 1.0 zooms in, a value > 1.0 zooms out.
		 */
		this.rescale = function (factor) {
			var plt = this.plot();
			if (plt == null)
				return;
			//alert("here")
			factor = Math.abs(factor);
			if (factor == 1.0 || factor == 0.0)
				return;

			var doReplot = false;

			var autoReplot = plt.autoReplot();
			plt.setAutoReplot(false);

			for (var axisId = 0; axisId < axisCnt; axisId++) {
				var scaleDiv = this.plot().axisScaleDiv(axisId);
				if (this.isAxisEnabled(axisId)) {
					var scaleEngine = this.plot().axisScaleEngine(axisId);
					var center,
					width_2,
					lower,
					upper;
					//Static.mLog = function(base, value)
					if (scaleEngine instanceof LogScaleEngine) {
						center = (Static.mLog(scaleEngine.base(), scaleDiv.lowerBound()) + Static.mLog(scaleEngine.base(), scaleDiv.upperBound())) / 2;
						width_2 = (Static.mLog(scaleEngine.base(), scaleDiv.upperBound()) - Static.mLog(scaleEngine.base(), scaleDiv.lowerBound())) / 2 * factor;
						lower = Math.pow(scaleEngine.base(), center - width_2);
						upper = Math.pow(scaleEngine.base(), center + width_2);
					} else {
						center = scaleDiv.lowerBound() + scaleDiv.range() / 2;
						width_2 = scaleDiv.range() / 2 * factor;
						lower = center - width_2;
						upper = center + width_2;
					}
					plt.setAxisScale(axisId, lower, upper);
					doReplot = true;
				}
			}

			plt.setAutoReplot(autoReplot);

			if (doReplot)
				plt.replot();

			return false;
		}

		this.setEnabled_1(true);

		this.toString = function () {
			return '[Magnifier]';
		}

	}

}
