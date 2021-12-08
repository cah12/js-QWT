'use strict';
/////////////////Transform - base class//////////start
/**
 * A transformation between coordinate systems. When being mapped between the scale and the paint device 
 * coordinate system, Transform manipulates values. 
 * A transformation consists of 2 methods:{@link transform}and{@link invTransform} where one is is the inverse function of the other.
 * When p1, p2 are the boundaries of the paint device coordinates and s1, s2 the boundaries of the scale, ScaleMap uses the following calculations:
 * 
 * p = p1 + ( p2 - p1 ) * ( T( s ) - T( s1 ) / ( T( s2 ) - T( s1 ) );
 * 
 * s = invT ( T( s1 ) + ( T( s2 ) - T( s1 ) ) * ( p - p1 ) / ( p2 - p1 ) );
 */
class Transform {
	constructor(){

	}
	/**
     * Returns a string representing the object.
     * @returns {String}
     */
	toString () {
		return '[Transform]';
	}
	
	/**
	 * 
	 * @param {*} value Value to be bounded
	 * @returns {Number} value unmodified
	 */
	bounded (value) {
		return value;
	}
}


/////////////////NullTransform - subclass of Transform//////////start
class NullTransform extends Transform {
	constructor(){
		super();

	}

	toString () {
		return '[NullTransform]';
	}

	/*!
	value Value to be transformed
	return value unmodified
	*/
	transform (value) {
		return value;
	}

	/*!
	value Value to be transformed
	return value unmodified
	*/
	invTransform (value) {
		return value;
	}

	//! \return Clone of the transformation
	copy () {
		return new NullTransform();
	}
}


class LogTransform extends Transform {
	constructor(){
		super();
	}

	toString () {
		return '[LogTransform]';
	}

	/*!
	value Value to be transformed
	return log( value )
	*/
	transform (value) {	
		return Math.log(value);
	}

	/*!
	param value Value to be transformed
	return exp( value )
	*/
	invTransform (value) {
		return Math.exp(value);
	}

	/*!
	value Value to be bounded
	return qBound( LogMin, value, LogMax )
	*/
	bounded (value) {
		if (value > Number.MAX_VALUE)
			return Number.MAX_VALUE;
		if (value < Number.MIN_VALUE)
			return Number.MIN_VALUE;
		return value;
	}

	//! \return Clone of the transformation
	copy () {
		return new LogTransform();
	}
}

class PowerTransform extends Transform{
	constructor(exponent){
		super();
		this.d_exponent = exponent;
	}

	toString () {
		return '[PowerTransform]';
	}
	
	/*!
	value Value to be transformed
	return Exponentiation preserving the sign
	 */
	transform (value) {
		if (value < 0.0)
			return -Math.pow(-value, 1.0 / this.d_exponent);
		else
			return Math.pow(value, 1.0 / this.d_exponent);
	
	}
	
	/*!
	value Value to be transformed
	return Inverse exponentiation preserving the sign
	 */
	invTransform (value) {
		if (value < 0.0)
			return -Math.pow(-value, this.d_exponent);
		else
			return Math.pow(value, this.d_exponent);
	}
	
	//! \return Clone of the transformation
	copy () {
		return new PowerTransform(this.d_exponent);
	}
}
