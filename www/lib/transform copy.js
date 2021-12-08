'use strict';
/////////////////Transform - base class//////////start
var Transform = function () {}

Transform.prototype.toString = function () {
	return '[Transform]';
}

/*!
value Value to be bounded
return value unmodified
 */
Transform.prototype.bounded = function (value) {
	return value;
}
//////////////////////////////////////////////////////end

/////////////////NullTransform - subclass of Transform//////////start
var NullTransform = function () {
	// Call the parent constructor, making sure (using Function#call)
	// that "this" is set correctly during the call
	Transform.call(this);
}
NullTransform.prototype = Object.create(Transform.prototype);
// Set the "constructor" property to refer to NullTransform
NullTransform.prototype.constructor = NullTransform;

NullTransform.prototype.toString = function () {
	return '[NullTransform]';
}

/*!
value Value to be transformed
return value unmodified
 */
NullTransform.prototype.transform = function (value) {
	return value;
}

/*!
value Value to be transformed
return value unmodified
 */
NullTransform.prototype.invTransform = function (value) {
	return value;
}

//! \return Clone of the transformation
NullTransform.prototype.copy = function () {
	return new NullTransform();
}
//////////////////////////////////////////////////////end

/////////////////LogTransform - subclass of Transform//////////start
var LogTransform = function () {
	// Call the parent constructor, making sure (using Function#call)
	// that "this" is set correctly during the call
	Transform.call(this);
}
LogTransform.prototype = Object.create(Transform.prototype);
// Set the "constructor" property to refer to NullTransform
LogTransform.prototype.constructor = LogTransform;

LogTransform.prototype.toString = function () {
	return '[LogTransform]';
}

/*!
value Value to be transformed
return log( value )
 */
LogTransform.prototype.transform = function (value) {	
	return Math.log(value);
}

/*!
param value Value to be transformed
return exp( value )
 */
LogTransform.prototype.invTransform = function (value) {
	return Math.exp(value);
}

/*!
value Value to be bounded
return qBound( LogMin, value, LogMax )
 */
LogTransform.prototype.bounded = function (value) {
	if (value > Number.MAX_VALUE)
		return Number.MAX_VALUE;
	if (value < Number.MIN_VALUE)
		return Number.MIN_VALUE;
	return value;
}

//! \return Clone of the transformation
LogTransform.prototype.copy = function () {
	return new LogTransform();
}
//////////////////////////////////////////////////////end

/////////////////PowerTransform - subclass of Transform//////////start
var PowerTransform = function (exponent) {
	// Call the parent constructor, making sure (using Function#call)
	// that "this" is set correctly during the call
	Transform.call(this);
	this.d_exponent = exponent;
}
PowerTransform.prototype = Object.create(Transform.prototype);
// Set the "constructor" property to refer to NullTransform
PowerTransform.prototype.constructor = PowerTransform;

PowerTransform.prototype.toString = function () {
	return '[PowerTransform]';
}

/*!
value Value to be transformed
return Exponentiation preserving the sign
 */
PowerTransform.prototype.transform = function (value) {
	if (value < 0.0)
		return -Math.pow(-value, 1.0 / d_exponent);
	else
		return Math.pow(value, 1.0 / d_exponent);

}

/*!
value Value to be transformed
return Inverse exponentiation preserving the sign
 */
PowerTransform.prototype.invTransform = function (value) {
	if (value < 0.0)
		return -Math.pow(-value, d_exponent);
	else
		return Math.pow(value, d_exponent);
}

//! \return Clone of the transformation
PowerTransform.prototype.copy = function () {
	return new PowerTransform(d_exponent);
}

//////////////////////////////////////////////////////end
