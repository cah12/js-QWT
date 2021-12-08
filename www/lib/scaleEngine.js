'use strict';
Static.mLog = function (base, value) {
	return Math.log(value) / Math.log(base);
}

Static.mLogInterval = function (base, interval) {
	return new Interval(Static.mLog(base, interval.minValue()),
		Static.mLog(base, interval.maxValue()));
}

Static.mPowInterval = function (base, interval) {
	return new Interval(Math.pow(base, interval.minValue()),
		Math.pow(base, interval.maxValue()));
}

Static.mStepSize = function (intervalSize, maxSteps, base) {
	//return 41.666666;
	if (maxSteps <= 0)
		return 0.0;

	if (maxSteps > 2) {
		for (var numSteps = maxSteps; numSteps > 1; numSteps--) {
			var stepSize = intervalSize / numSteps;

			var p = Math.floor(Math.log(stepSize) / Math.log(base));
			var fraction = Math.pow(base, p);

			for (var n = base; n > 1; n /= 2) {
				if (Utility.mFuzzyCompare(stepSize, n * fraction))
					return stepSize;

				if (n === 3 && (base % 2) === 0) {
					if (Utility.mFuzzyCompare(stepSize, 2 * fraction))
						return stepSize;
				}
			}
			//return stepSize; //added without proof
		}

	}
	return intervalSize * 0.5;
}


class ScaleArithmetic {
	/*
	Calculate a step size for a given interval

	param intervalSize Interval size
	param numSteps Number of steps
	param base Base for the division ( usually 10 )

	return Calculated step size
	*/
	static divideInterval(intervalSize, numSteps, base) {
		if (numSteps <= 0)
			return 0.0;

		var v = divideEps(intervalSize, numSteps);
		//    alert(v)
		if (v === 0.0)
			return 0.0;

		var lx = Static.mLog(base, Math.abs(v));
		var p = Math.floor(lx);

		var fraction = Math.pow(base, lx - p);

		var n = base;
		while ((n > 1) && (fraction <= n / 2))
			n /= 2;

		var stepSize = n * Math.pow(base, p);
		if (v < 0)
			stepSize = -stepSize;

		return stepSize;
	}

	/*!
	Ceil a value, relative to an interval

	param value Value to be ceiled
	param intervalSize Interval size

	return Rounded value

	floorEps()
	*/
	static ceilEps(value, intervalSize) {
		var eps = Static._eps * intervalSize;

		value = (value - eps) / intervalSize;
		return Math.ceil(value) * intervalSize;
	}

	/*!
	Floor a value, relative to an interval
	
	param value Value to be floored
	param intervalSize Interval size
	
	return Rounded value
	sa floorEps()
	 */
	static floorEps(value, intervalSize) {
		var eps = Static._eps * intervalSize;

		value = (value + eps) / intervalSize;
		return Math.floor(value) * intervalSize;
	}

	/*!
	Divide an interval into steps
	
	stepSize = (intervalSize - intervalSize * 10e^{-6}) / numSteps\f$
	
	param intervalSize Interval size
	param numSteps Number of steps
	return Step size
	 */
	static divideEps(intervalSize, numSteps) {
		if (numSteps === 0.0 || intervalSize === 0.0)
			return 0.0;

		return (intervalSize - (Static._eps * intervalSize)) / numSteps;
	}

}

/*!
Divide an interval into steps

stepSize = (intervalSize - intervalSize * 10e^{-6}) / numSteps\f$

param intervalSize Interval size
param numSteps Number of steps
return Step size
 */
function divideEps(intervalSize, numSteps) {
	if (numSteps === 0.0 || intervalSize === 0.0)
		return 0.0;

	return (intervalSize - (Static._eps * intervalSize)) / numSteps;
}


/////////////////ScaleEngine/////////////////start
//var ScaleEngine = function (bs) {
class ScaleEngine {
	constructor(bs) {
		var m_base = 10;
		var m_lowerMargin = 0.0;
		var m_upperMargin = 0.0;
		if (typeof (bs) !== 'undefined')
			m_base = bs;
		var m_transform = null;
		var m_referenceValue = 0.0;

		var m_attributes = 0;



		/*!
		\return the margin at the lower end of the scale
		The default margin is 0.

		\sa setMargins()
		 */
		this.lowerMargin = function () {
			return m_lowerMargin;
		}

		/*!
		\return the margin at the upper end of the scale
		The default margin is 0.

		\sa setMargins()
		 */
		this.upperMargin = function () {
			return m_upperMargin;
		}

		/*!
		\brief Specify margins at the scale's endpoints
		\param lower minimum distance between the scale's lower boundary and the
		smallest enclosed value
		\param upper minimum distance between the scale's upper boundary and the
		greatest enclosed value

		Margins can be used to leave a minimum amount of space between
		the enclosed intervals and the boundaries of the scale.

		\warning
		\li QwtLogScaleEngine measures the margins in decades.

		\sa upperMargin(), lowerMargin()
		 */

		this.setMargins = function (lower, upper) {
			m_lowerMargin = Math.max(lower, 0.0);
			m_upperMargin = Math.max(upper, 0.0);
		}

		/*!
		Assign a transformation

		param transform Transformation

		The transformation object is used as factory for clones
		that are returned by transformation()

		The scale engine takes ownership of the transformation.

		QwtTransform::copy(), transformation()

		 */
		this.setTransformation = function (transform) {
			if (transform !== m_transform) {
				//delete m_transform;
				m_transform = transform;
			}
		}

		/*!
		Create and return a clone of the transformation
		of the engine. When the engine has no special transformation
		NULL is returned, indicating no transformation.

		return A clone of the transfomation
		setTransformation()
		 */
		this.transformation = function () {
			var transform = null;
			if (m_transform) {
				transform = m_transform.copy();
			}

			return transform;
		}
		/*!
		Calculate a step size for an interval size

		param intervalSize Interval size
		param numSteps Number of steps

		return Step size
		 */
		this.divideInterval = function (intervalSize, numSteps) {
			return ScaleArithmetic.divideInterval(intervalSize, numSteps, m_base);
		}

		/*!
		Check if an interval "contains" a value

		param interval Interval
		param value Value

		return True, when the value is inside the interval
		 */
		this.contains = function (interval, value) {
			if (!interval.isValid())
				return false;

			if (Utility.m3FuzzyCompare(value, interval.minValue(), interval.width()) < 0)
				return false;

			if (Utility.m3FuzzyCompare(value, interval.maxValue(), interval.width()) > 0)
				return false;

			return true;
		}

		/*!
		Remove ticks from a list, that are not inside an interval

		param ticks Tick list
		param interval Interval

		return Stripped tick list
		 */
		this.strip = function (ticks, interval) {
			if (!interval.isValid() || ticks.length === 0)
				return [];

			if (this.contains(interval, ticks[0])
				&& this.contains(interval, ticks[ticks.length - 1])) {
				return ticks;
			}

			var strippedTicks = [];
			for (var i = 0; i < ticks.length; i++) {
				if (this.contains(interval, ticks[i]))
					strippedTicks.push(ticks[i]);
			}
			return strippedTicks;
		}

		/*!
		brief Build an interval around a value

		In case of v == 0.0 the interval is [-0.5, 0.5],
		otherwide it is [0.5 * v, 1.5 * v]

		param value Initial value
		return Calculated interval
		 */

		this.buildInterval = function (value) {
			var delta = (value === 0.0) ? 0.5 : Math.abs(0.5 * value);

			if (Number.MAX_VALUE - delta < value)
				return new Interval(Number.MAX_VALUE - delta, Number.MAX_VALUE);

			if (-Number.MAX_VALUE + delta > value)
				return new Interval(-Number.MAX_VALUE, -Number.MAX_VALUE + delta);

			return new Interval(value - delta, value + delta);
		}

		this.setAttribute = function (attribute, on) {
			if (on)
				m_attributes |= attribute;
			else
				m_attributes &= ~attribute;
		}

		this.testAttribute = function (attribute) {
			return (m_attributes & attribute);
		}

		this.setAttributes = function (attributes) {
			m_attributes = attributes;
		}

		this.attributes = function () {
			return m_attributes;
		}


		/*!
		Set the base of the scale engine

		While a base of 10 is what 99.9% of all applications need
		certain scales might need a different base: f.e 2

		The default setting is 10

		param base Base of the engine

		base()
		 */
		this.setBase = function (base) {
			m_base = Math.max(base, 2);
		}

		/*!
		return base Base of the scale engine
		setBase()
		 */
		this.base = function () {
			return m_base;
		}

		/*!
		\brief Specify a reference point
		\param r new reference value

		The reference point is needed if options IncludeReference or
		Symmetric are active. Its default value is 0.0.

		\sa Attribute
		 */
		this.setReference = function (r) {
			m_referenceValue = r;
		}

		/*!
		\return the reference value
		\sa setReference(), setAttribute()
		 */
		this.reference = function () {
			return m_referenceValue;
		}

	}
	toString() {
		return '[ScaleEngine]';
	}
}
/* ScaleEngine.prototype.toString = function () {
	return '[ScaleEngine]';
}; */
//////////////////////////////////////////////////////end

/////////////////LinearScaleEngine - subclass of ScaleEngine//////////start
//var LinearScaleEngine = function (bs) {
// Call the parent constructor, making sure (using Function#call)
// that "this" is set correctly during the call
class LinearScaleEngine extends ScaleEngine {
	constructor(bs) {
		super(bs);
		//ScaleEngine.call(this, bs);

		/*!
		Align and divide an interval
	
		\param maxNumSteps Max. number of steps
		\param x1 First limit of the interval (In/Out)
		\param x2 Second limit of the interval (In/Out)
		\param stepSize Step size (Out)
	
		\sa setAttribute()
		 */
		this.autoScale = function (maxNumSteps, xValueObject, stepSize) {

			var interval = new Interval(xValueObject["x1"], xValueObject["x2"]);
			interval = interval.normalized();

			interval.setMinValue(interval.minValue() - this.lowerMargin());
			interval.setMaxValue(interval.maxValue() + this.upperMargin());

			/*if ( testAttribute( QwtScaleEngine::Symmetric ) )
			interval = interval.symmetrize( reference() );
	
			if ( testAttribute( QwtScaleEngine::IncludeReference ) )
			interval = interval.extend( reference() );*/

			if (interval.width() === 0.0)
				interval = this.buildInterval(interval.minValue());

			stepSize = ScaleArithmetic.divideInterval(
				interval.width(), Math.max(maxNumSteps, 1), this.base());

			//if ( !testAttribute( QwtScaleEngine::Floating ) )
			//interval = align( interval, stepSize );

			xValueObject["x1"] = interval.minValue();
			xValueObject["x2"] = interval.maxValue();

			//if ( testAttribute( Inverted ) ){			
			// qSwap( x1, x2 );
			// stepSize = -stepSize;
			//}


		}

		/*!
		\brief Calculate a scale division for an interval
	
		\param x1 First interval limit
		\param x2 Second interval limit
		\param maxMajorSteps Maximum for the number of major steps
		\param maxMinorSteps Maximum number of minor steps
		\param stepSize Step size. If stepSize == 0, the engine
		calculates one.
	
		\return Calculated scale division
		 */
		this.divideScale = function (x1, x2, maxMajorSteps, maxMinorSteps, stepSize) {
			if (typeof (stepSize) === "undefined")
				stepSize = 0.0;
			var interval = new Interval(x1, x2).normalized();
			if (interval.width() <= 0)
				return new ScaleDiv();

			stepSize = Math.abs(stepSize);
			if (stepSize === 0.0) {
				if (maxMajorSteps < 1)
					maxMajorSteps = 1;

				stepSize = ScaleArithmetic.divideInterval(interval.width(), maxMajorSteps, this.base());
			}

			var scaleDiv = new ScaleDiv();

			if (stepSize !== 0.0) {
				var ticks = [];

				this.buildTicks(interval, stepSize, maxMinorSteps, ticks);
				scaleDiv = new ScaleDiv(interval, ticks);
				//console.log(interval.width())
				//console.log(ticks)
			}

			if (x1 > x2)
				scaleDiv.invert();

			return scaleDiv;
		}

		/*!
		\brief Calculate ticks for an interval
	
		\param interval Interval
		\param stepSize Step size
		\param maxMinorSteps Maximum number of minor steps
		\param ticks Arrays to be filled with the calculated ticks
	
		\sa buildMajorTicks(), buildMinorTicks
		 */
		this.buildTicks = function (interval, stepSize, maxMinorSteps, ticks) {

			var boundingInterval = this.align(interval, stepSize);

			ticks[ScaleDiv.TickType.MajorTick] = this.buildMajorTicks(boundingInterval, stepSize);

			if (maxMinorSteps > 0) {
				var minorTicks = [];
				var mediumTicks = [];
				this.buildMinorTicks(ticks[ScaleDiv.TickType.MajorTick], maxMinorSteps, stepSize,
					minorTicks, mediumTicks);
				ticks[ScaleDiv.TickType.MinorTick] = minorTicks;
				ticks[ScaleDiv.TickType.MediumTick] = mediumTicks;
			}

			for (var i = 0; i < ScaleDiv.TickType.NTickTypes; i++) {
				var obj = this.strip(ticks[i], interval);
				ticks[i] = [];
				ticks[i] = obj;

				// ticks very close to 0.0 are
				// explicitely set to 0.0

				for (var j = 0; j < ticks[i].length; j++) {
					if (Utility.m3FuzzyCompare(ticks[i][j], 0.0, stepSize) === 0)
						ticks[i][j] = 0.0;
				}
			}
		}

		/*!
		\brief Calculate major ticks for an interval
	
		\param interval Interval
		\param stepSize Step size
	
		\return Calculated ticks
		 */
		this.buildMajorTicks = function (interval, stepSize) {
			var numTicks = Math.round(interval.width() / stepSize) + 1;
			if (numTicks > 10000)
				numTicks = 10000;

			var ticks = [];


			ticks.push(interval.minValue());
			for (var i = 1; i < numTicks - 1; i++)
				ticks.push(interval.minValue() + i * stepSize);
			ticks.push(interval.maxValue());

			//console.log(ticks)
			return ticks;
		}

		/*!
		\brief Calculate minor/medium ticks for major ticks
	
		\param majorTicks Major ticks
		\param maxMinorSteps Maximum number of minor steps
		\param stepSize Step size
		\param minorTicks Array to be filled with the calculated minor ticks
		\param mediumTicks Array to be filled with the calculated medium ticks
	
		 */
		this.buildMinorTicks = function (majorTicks, maxMinorSteps, stepSize, minorTicks, mediumTicks) {

			var minStep = Static.mStepSize(stepSize, maxMinorSteps, this.base());
			if (minStep === 0.0)
				return;

			// # ticks per interval
			var numTicks = Math.ceil(Math.abs(stepSize / minStep)) - 1;

			var medIndex = -1;
			if (numTicks % 2)
				medIndex = numTicks / 2;

			// calculate minor ticks

			for (var i = 0; i < majorTicks.length; i++) {
				var val = majorTicks[i];
				for (var k = 0; k < numTicks; k++) {
					val += minStep;

					var alignedValue = val;
					if (Utility.m3FuzzyCompare(val, 0.0, stepSize) === 0)
						alignedValue = 0.0;

					if (k == medIndex)
						mediumTicks.push(alignedValue);
					else
						minorTicks.push(alignedValue);
				}
			}
		}
		/*!
		\brief Align an interval to a step size
	
		The limits of an interval are aligned that both are integer
		multiples of the step size.
	
		\param interval Interval
		\param stepSize Step size
	
		\return Aligned interval
		 */
		this.align = function (interval, stepSize) {
			var x1 = interval.minValue();
			var x2 = interval.maxValue();

			if (-Number.MAX_VALUE + stepSize <= x1) {
				var x = ScaleArithmetic.floorEps(x1, stepSize);
				if (Utility.m3FuzzyCompare(x1, x, stepSize) !== 0)
					x1 = x;
			}

			if (Number.MAX_VALUE - stepSize >= x2) {
				var x = ScaleArithmetic.ceilEps(x2, stepSize);
				if (Utility.m3FuzzyCompare(x2, x, stepSize) !== 0)
					x2 = x;
			}

			return new Interval(x1, x2);
		}

	}
	toString() {
		return '[LinearScaleEngine]';
	}
}
//LinearScaleEngine.prototype = Object.create(ScaleEngine.prototype);
// Set the "constructor" property to refer to LinearScaleEngine
//LinearScaleEngine.prototype.constructor = LinearScaleEngine;

/* LinearScaleEngine.prototype.toString = function () {
	return '[LinearScaleEngine]';
} */
///////////////////////////////////////////////////////////////end

/////////////////LogScaleEngine - subclass of ScaleEngine//////////start
//var LogScaleEngine = function (bs) {
// Call the parent constructor, making sure (using Function#call)
// that "this" is set correctly during the call
class LogScaleEngine extends ScaleEngine {
	constructor(bs) {
		super(bs);
		//ScaleEngine.call(this, bs);

		this.setTransformation(new LogTransform());

		/*!
		Align and divide an interval
	
		\param maxNumSteps Max. number of steps
		\param x1 First limit of the interval (In/Out)
		\param x2 Second limit of the interval (In/Out)
		\param stepSize Step size (Out)
	
		\sa QwtScaleEngine::setAttribute()
		 */
		this.autoScale = function (maxNumSteps, xValueObject, stepSize) {

			//if ( x1 > x2 )
			//qSwap( x1, x2 );

			var logBase = this.base();

			var interval = new Interval(xValueObject["x1"] / Math.pow(logBase, this.lowerMargin()),
				xValueObject["x2"] * Math.pow(logBase, this.upperMargin()));

			if (interval.maxValue() / interval.minValue() < logBase) {
				// scale width is less than one step -> try to build a linear scale

				var linearScaler = new LinearScaleEngine();
				linearScaler.setAttributes(this.attributes());
				linearScaler.setReference(this.reference());
				linearScaler.setMargins(this.lowerMargin(), this.upperMargin());

				linearScaler.autoScale(maxNumSteps, xValueObject, stepSize);

				var linearInterval = new Interval(xValueObject["x1"], xValueObject["x2"]);
				linearInterval.normalized();

				linearInterval = linearInterval.limited(1.0e-100, 1.0e100);

				if (linearInterval.maxValue() / linearInterval.minValue() < logBase) {
					// the aligned scale is still less than one step
					if (stepSize < 0.0)
						stepSize = -Static.mLog(logBase, Math.abs(stepSize));
					else
						stepSize = Static.mLog(logBase, stepSize);

					return;
				}
			}

			var logRef = 1.0;
			if (this.reference() > 1.0e-100 / 2)
				logRef = Math.min(this.reference(), 1.0e100 / 2);

			//        if ( testAttribute( QwtScaleEngine::Symmetric ) )
			//        {
			//            const double delta = qMax( interval.maxValue() / logRef,
			//                logRef / interval.minValue() );
			//            interval.setInterval( logRef / delta, logRef * delta );
			//        }

			//        if ( testAttribute( QwtScaleEngine::IncludeReference ) )
			//            interval = interval.extend( logRef );

			interval = interval.limited(1.0e-100, 1.0e100);

			if (interval.width() == 0.0)
				interval = this.buildInterval(interval.minValue());

			stepSize = ScaleArithmetic.divideInterval(Static.mLogInterval(logBase, interval).width(),
				Math.max(maxNumSteps, 1));
			if (stepSize < 1.0)
				stepSize = 1.0;

			//if ( !testAttribute( QwtScaleEngine::Floating ) )
			//interval = align( interval, stepSize );

			xValueObject["x1"] = interval.minValue();
			xValueObject["x2"] = interval.maxValue();

			//        if ( testAttribute( QwtScaleEngine::Inverted ) )
			//        {
			//            qSwap( x1, x2 );
			//            stepSize = -stepSize;
			//        }
		}

		/*!
		\brief Calculate a scale division for an interval
	
		\param x1 First interval limit
		\param x2 Second interval limit
		\param maxMajorSteps Maximum for the number of major steps
		\param maxMinorSteps Maximum number of minor steps
		\param stepSize Step size. If stepSize == 0, the engine
		calculates one.
	
		\return Calculated scale division
		 */
		this.divideScale = function (x1, x2, maxMajorSteps, maxMinorSteps, stepSize) {
			//alert(456)
			var interval = new Interval(x1, x2);
			interval.normalized();
			interval = interval.limited(1.0e-100, 1.0e100);

			if (interval.width() <= 0)
				return new ScaleDiv();

			var logBase = this.base();

			if (interval.maxValue() / interval.minValue() < logBase) {
				// scale width is less than one decade -> build linear scale


				var linearScaler = new LinearScaleEngine();
				linearScaler.setAttributes(this.attributes());
				linearScaler.setReference(this.reference());
				linearScaler.setMargins(this.lowerMargin(), this.upperMargin());

				if (stepSize != 0.0) {
					if (stepSize < 0.0)
						stepSize = -Math.pow(logBase, -stepSize);
					else
						stepSize = Math.pow(logBase, stepSize);
				}

				return linearScaler.divideScale(x1, x2,
					maxMajorSteps, maxMinorSteps, stepSize);
			}

			stepSize = Math.abs(stepSize);
			if (stepSize == 0.0) {
				if (maxMajorSteps < 1)
					maxMajorSteps = 1;
				//alert(mLogInterval( logBase, interval ).width())
				stepSize = ScaleArithmetic.divideInterval(Static.mLogInterval(logBase, interval).width(), maxMajorSteps, this.base());
				//alert(stepSize)
				if (stepSize < 1.0)
					stepSize = 1.0; // major step must be >= 1 decade
			}

			var scaleDiv = new ScaleDiv();
			//alert(stepSize)
			if (stepSize != 0.0) {
				//alert(stepSize)
				var ticks = [];

				this.buildTicks(interval, stepSize, maxMinorSteps, ticks);
				scaleDiv = new ScaleDiv(interval, ticks);

				//alert(432)
			}

			if (x1 > x2)
				scaleDiv.invert();

			return scaleDiv;
		}

		/*!
		\brief Calculate ticks for an interval
	
		\param interval Interval
		\param maxMinorSteps Maximum number of minor steps
		\param stepSize Step size
		\param ticks Arrays to be filled with the calculated ticks
	
		\sa buildMajorTicks(), buildMinorTicks
		 */
		this.buildTicks = function (interval, stepSize, maxMinorSteps, ticks) {

			var boundingInterval = this.align(interval, stepSize);

			ticks[ScaleDiv.TickType.MajorTick] = this.buildMajorTicks(boundingInterval, stepSize);


			if (maxMinorSteps > 0) {
				var minorTicks = [];
				var mediumTicks = [];
				this.buildMinorTicks(ticks[ScaleDiv.TickType.MajorTick], maxMinorSteps, stepSize,
					minorTicks, mediumTicks);
				ticks[ScaleDiv.TickType.MinorTick] = minorTicks;
				ticks[ScaleDiv.TickType.MediumTick] = mediumTicks;
			}



			for (var i = 0; i < ScaleDiv.TickType.NTickTypes; i++) {
				var obj = this.strip(ticks[i], interval);
				ticks[i] = [];
				ticks[i] = obj;

				// ticks very close to 0.0 are
				// explicitely set to 0.0

				for (var j = 0; j < ticks[i].length; j++) {
					if (Utility.m3FuzzyCompare(ticks[i][j], 0.0, stepSize) === 0)
						ticks[i][j] = 0.0;
				}
			}
		}

		/*!
		\brief Calculate major ticks for an interval
	
		\param interval Interval
		\param stepSize Step size
	
		\return Calculated ticks
		 */
		this.buildMajorTicks = function (interval, stepSize) {
			var width = Static.mLogInterval(this.base(), interval).width();

			var numTicks = Math.round(width / stepSize) + 1;
			if (numTicks > 10000)
				numTicks = 10000;

			var lxmin = Math.log(interval.minValue());
			var lxmax = Math.log(interval.maxValue());
			var lstep = (lxmax - lxmin) / (numTicks - 1);

			var ticks = [];

			ticks.push(interval.minValue());

			for (var i = 1; i < numTicks - 1; i++)
				ticks.push(Math.exp(lxmin + i * lstep));

			ticks.push(interval.maxValue());

			//alert(ticks)

			return ticks;
		}

		/*!
		\brief Calculate minor/medium ticks for major ticks
	
		\param majorTicks Major ticks
		\param maxMinorSteps Maximum number of minor steps
		\param stepSize Step size
		\param minorTicks Array to be filled with the calculated minor ticks
		\param mediumTicks Array to be filled with the calculated medium ticks
		 */
		this.buildMinorTicks = function (majorTicks, maxMinorSteps, stepSize, minorTicks, mediumTicks) {
			var logBase = this.base();

			if (stepSize < 1.1) // major step width is one base
			{
				var minStep = this.divideInterval(stepSize, maxMinorSteps + 1);
				if (minStep == 0.0)
					return;

				var numSteps = Math.round(stepSize / minStep);

				var mediumTickIndex = -1;
				if ((numSteps > 2) && (numSteps % 2 == 0))
					mediumTickIndex = numSteps / 2;

				for (i = 0; i < majorTicks.length - 1; i++) {
					var v = majorTicks[i];
					var s = logBase / numSteps;

					if (s >= 1.0) {
						for (j = 2; j < numSteps; j++) {
							minorTicks.push(v * j * s);
						}
					} else {
						for (j = 1; j < numSteps; j++) {
							var tick = v + j * v * (logBase - 1) / numSteps;
							if (j == mediumTickIndex)
								mediumTicks.push(tick);
							else
								minorTicks.push(tick);
						}
					}
				}
			} else {
				var minStep = this.divideInterval(stepSize, maxMinorSteps);
				if (minStep == 0.0)
					return;

				if (minStep < 1.0)
					minStep = 1.0;

				// # subticks per interval
				var numTicks = Math.round(stepSize / minStep) - 1;

				// Do the minor steps fit into the interval?
				if (Utility.m3FuzzyCompare((numTicks + 1) * minStep,
					stepSize, stepSize) > 0) {
					numTicks = 0;
				}

				if (numTicks < 1)
					return;

				var mediumTickIndex = -1;
				if ((numTicks > 2) && (numTicks % 2))
					mediumTickIndex = numTicks / 2;

				// substep factor = base^substeps
				var minFactor = Math.max(Math.pow(logBase, minStep), logBase);

				for (var i = 0; i < majorTicks.length; i++) {
					var tick = majorTicks[i];
					for (var j = 0; j < numTicks; j++) {
						tick *= minFactor;

						if (j == mediumTickIndex)
							mediumTicks.push(tick);
						else
							minorTicks.push(tick);
					}
				}
			}
		}

		/*!
		\brief Align an interval to a step size
	
		The limits of an interval are aligned that both are integer
		multiples of the step size.
	
		\param interval Interval
		\param stepSize Step size
	
		\return Aligned interval
		 */
		this.align = function (interval, stepSize) {
			var intv = Static.mLogInterval(this.base(), interval);

			var x1 = ScaleArithmetic.floorEps(intv.minValue(), stepSize);
			if (Utility.m3FuzzyCompare(interval.minValue(), x1, stepSize) == 0)
				x1 = interval.minValue();

			var x2 = ScaleArithmetic.ceilEps(intv.maxValue(), stepSize);
			if (Utility.m3FuzzyCompare(interval.maxValue(), x2, stepSize) == 0)
				x2 = interval.maxValue();

			return Static.mPowInterval(this.base(), new Interval(x1, x2));
		}

	}
	toString() {
		return '[LogScaleEngine]';
	}
}
//LogScaleEngine.prototype = Object.create(ScaleEngine.prototype);
// Set the "constructor" property to refer to LogScaleEngine
//LogScaleEngine.prototype.constructor = LogScaleEngine;

/* LogScaleEngine.prototype.toString = function () {
	return '[LogScaleEngine]';
} */
///////////////////////////////////////////////////////////////end
