'use strict';

 
/**
 * Construct a division without ticks
 * lowerBound First boundary
 * upperBound Second boundary
 * lowerBound might be greater than upperBound for inverted scales
 */
class ScaleDiv {	
	constructor(arg1, arg2, arg3, arg4, arg5) {
		var d_lowerBound = 0.0;
		var d_upperBound = 0.0;
		var d_ticks = []; //array of array of numbers
		if (typeof (arg1) == 'undefined' || typeof (arg2) == 'undefined') { //constructor 1
			;
		} else if ((typeof (arg3) == 'undefined') && ((typeof (arg1) == 'object') && (typeof (arg2) == 'object'))) { //constructor 2
			var interval = arg1;
			var ticks = arg2;
			d_lowerBound = interval.minValue();
			d_upperBound = interval.maxValue();

			for (var i = 0; i < ScaleDiv.TickType.NTickTypes; i++)
				d_ticks[i] = ticks[i];

		} else if (typeof (arg4) == 'undefined') { //constructor 3
			lowerBound = arg1;
			upperBound = arg2;
			ticks = arg3;
			d_lowerBound = lowerBound;
			d_upperBound = upperBound;

			for (i = 0; i < ScaleDiv.TickType.NTickTypes; i++)
				d_ticks[i] = ticks[i];

		} else if ((typeof (arg1) == 'undefined') && (typeof (arg2) == 'undefined') && (typeof (arg3) == 'undefined') && (typeof (arg4) == 'undefined') && (typeof (arg5) == 'undefined')) { //constructor 3
			lowerBound = arg1;
			upperBound = arg2;
			minorTicks = arg3;
			mediumTicks = arg4;
			majorTicks = arg5;
			d_lowerBound = lowerBound;
			d_upperBound = upperBound;
			d_ticks[ScaleDiv.TickType.MinorTick] = minorTicks;
			d_ticks[ScaleDiv.TickType.MediumTick] = mediumTicks;
			d_ticks[ScaleDiv.TickType.MajorTick] = majorTicks;

		}

		/*!
		Change the interval
		lowerBound First boundary
		upperBound Second boundary
		lowerBound might be greater than upperBound for inverted scales
		 */
		this.setInterval = function (arg1, arg2) {
			if (typeof (arg1) == 'number' && typeof (arg2) == 'number') {
				lowerBound = arg1;
				upperBound = arg2;
				d_lowerBound = lowerBound;
				d_upperBound = upperBound;

			} else if (typeof (arg1) == 'object' && typeof (arg2) == 'undefined') {
				interval = arg1;
				d_lowerBound = interval.minValue();
				d_upperBound = interval.maxValue();

			}

		};
		/*!
		lowerBound -> upperBound
		 */
		this.interval = function () {
			return new Interval(d_lowerBound, d_upperBound);
		};
		/*!
		Set the first boundary
		lowerBound First boundary
		 */
		this.setLowerBound = function (lowerBound) {
			d_lowerBound = lowerBound;
		};

		/*!
		First boundary
		 */
		this.lowerBound = function () {
			return d_lowerBound;
		};

		/*!
		Set the second boundary
		upperBound Second boundary
		 */
		this.setUpperBound = function (upperBound) {
			d_upperBound = upperBound;
		};

		/*!
		upper bound
		 */
		this.upperBound = function () {
			return d_upperBound;
		};

		/*
		upperBound() - lowerBound()
		 */
		this.range = function () {
			return d_upperBound - d_lowerBound;
		};

		// Check if the scale division is empty( lowerBound() == upperBound() )
		this.isEmpty = function () {
			return (d_lowerBound == d_upperBound);
		};

		// Check if the scale division is increasing( lowerBound() <= upperBound() )
		this.isIncreasing = function () {
			return d_lowerBound <= d_upperBound;
		};

		/*!
		Return if a value is between lowerBound() and upperBound()
		value Value
		return true/false
		 */
		this.contains = function (value) {
			var min = Math.min(d_lowerBound, d_upperBound);
			var max = Math.max(d_lowerBound, d_upperBound);
			return value >= min && value <= max;
		}
		/*!
		Invert the scale division
		 */
		this.invert = function () {
			//qSwap( d_lowerBound, d_upperBound );
			var temp = d_lowerBound;
			d_lowerBound = d_upperBound;
			d_upperBound = temp;

			for (var i = 0; i < ScaleDiv.TickType.NTickTypes; i++) {
				//QList<double>& ticks = d_ticks[i];
				var ticks = d_ticks[i];
				var size = ticks.length;
				var size2 = size / 2;

				for (var j = 0; j < size2; j++) {
					//qSwap( ticks[j], ticks[size - 1 - j] );
					temp = ticks[j];
					ticks[j] = ticks[size - 1 - j];
					ticks[size - 1 - j] = temp;
				}
				d_ticks[i] = ticks;
			}
		};

		/*!
		A scale division with inverted boundaries and ticks
		 */
		this.inverted = function () {
			var other = new ScaleDiv(d_lowerBound, d_upperBound, d_ticks);
			other.invert();
			return other;
		};

		/*!
		Return a scale division with an interval [lowerBound, upperBound]
		where all ticks outside this interval are removed
		param lowerBound Lower bound
		param upperBound Upper bound
		return Scale division with all ticks inside of the given interval
		note lowerBound might be greater than upperBound for inverted scales
		 */
		this.bounded = function (lowerBound, upperBound) {
			var min = Math.min(lowerBound, upperBound);
			var max = Math.max(lowerBound, upperBound);

			var sd = new ScaleDiv();
			sd.setInterval(lowerBound, upperBound);

			for (tickType = 0; tickType < ScaleDiv.TickType.NTickTypes; tickType++) {
				var ticks = d_ticks[tickType];

				var boundedTicks = [];
				for (i = 0; i < ticks.size(); i++) {
					var tick = ticks[i];
					if (tick >= min && tick <= max)
						boundedTicks.push(tick);
				}

				sd.setTicks(tickType, boundedTicks);
			}

			return sd;

		};

		/*!
		Assign ticks
		param type MinorTick, ScaleDiv.TickType.MediumTick or MajorTick
		param ticks Values of the tick positions
		 */
		this.setTicks = function (type, ticks) {
			if (type >= 0 && type < ScaleDiv.TickType.NTickTypes)
				d_ticks[type] = ticks;
		};

		/*!
		Return a list of ticks
		param type MinorTick, ScaleDiv.TickType.MediumTick or MajorTick
		return Tick list
		 */
		this.ticks = function (type) {
			if (type >= 0 && type < ScaleDiv.TickType.NTickTypes) {
				// console.log(type)
				// console.log(d_ticks)
				return d_ticks[type];
			}
			return [];
		};

	}

	/**
     * Returns a string representing the object.
     * @returns {String}
     */
	toString() {
		return '[ScaleDiv]';
	}
}
Enumerator.enum("TickType {	NoTick = -1 , MinorTick , MediumTick , MajorTick ,	NTickTypes }", ScaleDiv);