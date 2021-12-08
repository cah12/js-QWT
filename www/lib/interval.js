'use strict';
///////////////Interval////////////////////////
//function Interval(minValue, maxValue, borderFlags) {

/**
 * @classdesc A abstract base class for drawing scales. It can be used to draw linear or logarithmic scales.
 * 
 */
class Interval {
    /**
     * 
     * @param {*} minValue 
     * @param {*} maxValue 
     * @param {*} borderFlags 
     */
    constructor(minValue, maxValue, borderFlags) {
        // if(minValue <= Number.MIN_VALUE && maxValue == 0){
        //     minValue = -0.5;
        //     maxValue = 0.5;
        // }
        
        // console.log(`min: ${minValue}`)
        // console.log(`max: ${maxValue}`)
        var d_minValue = 0.0;
        var d_maxValue = -1.0;
        var d_borderFlags = Interval.BorderFlag.IncludeBorders;

        //minValue, maxValue, borderFlags
        if (typeof(minValue) !== 'undefined' && typeof(maxValue) !== 'undefined') {
            d_minValue = minValue;
            d_maxValue = maxValue;
        }
        if (typeof(borderFlags) !== 'undefined')
            d_borderFlags = borderFlags;

        /*!
        Change the border flags

        \param borderFlags Or'd BorderMode flags
        \sa borderFlags()
         */
        this.setBorderFlags = function (borderFlags) {
            d_borderFlags = borderFlags;
        }

        /*!
        \return Border flags
        \sa setBorderFlags()
         */
        this.borderFlags = function () {
            return d_borderFlags;
        }

        /*!
        Assign the lower limit of the interval

        \param minValue Minimum value
         */
        this.setMinValue = function (minValue) {
            d_minValue = minValue;
        }

        /*!
        Assign the upper limit of the interval

        \param maxValue Maximum value
         */
        this.setMaxValue = function (maxValue) {
            d_maxValue = maxValue;
        }

        //! \return Lower limit of the interval
        this.minValue = function () {
            return d_minValue;
        }

        //! \return Upper limit of the interval
        this.maxValue = function () {
            return d_maxValue;
        }
    }
    toString() {
        return '[Interval]';
    };
    /*!
    Assign the limits of the interval

    \param minValue Minimum value
    \param maxValue Maximum value
    \param borderFlags Include/Exclude borders
     */
    setInterval(minValue, maxValue, borderFlags) {
        this.setMinValue(minValue);
        this.setMaxValue(maxValue);
        this.setBorderFlags(borderFlags);
    }

    /*!
    A interval is valid when minValue() <= maxValue().
    In case of QwtInterval::ExcludeBorders it is true
    when minValue() < maxValue()

    \return True, when the interval is valid
     */
    isValid() {
        if ((this.borderFlags() & Interval.BorderFlag.ExcludeBorders) === 0)
            return this.minValue() <= this.maxValue();
        else
            return this.minValue() < this.maxValue();
    }

    /*!
    \brief Return the width of an interval

    The width of invalid intervals is 0.0, otherwise the result is
    maxValue() - minValue().

    \return Interval width
    \sa isValid()
     */
    width() {
        return this.isValid() ? (this.maxValue() - this.minValue()) : 0.0;
    }
    //! \return true, if isValid() && (minValue() >= maxValue())
    isNull() {
        return this.isValid() && this.minValue() >= this.maxValue();
    }

    /*!
    Invalidate the interval

    The limits are set to interval [0.0, -1.0]
    \sa isValid()
     */
    invalidate() {
        this.setMinValue(0.0);
        this.setMaxValue(-1.0);
    }

    /*!
    \brief Normalize the limits of the interval

    If maxValue() < minValue() the limits will be inverted.
    \return Normalized interval

    \sa isValid(), inverted()
     */
    normalized() {
        if (this.minValue() > this.maxValue()) {
            return this.inverted();
        }
        if (this.minValue() == this.maxValue() && this.borderFlags() == Interval.BorderFlag.ExcludeMinimum) {
            return this.inverted();
        }

        return this;
    }

    /*!
    Invert the limits of the interval
    \return Inverted interval
    \sa normalized()
     */
    inverted() {
        var borderFlags = Interval.BorderFlag.IncludeBorders;
        if (this.borderFlags() & Interval.BorderFlag.ExcludeMinimum)
            borderFlags |= Interval.BorderFlag.ExcludeMaximum;
        if (this.borderFlags() & Interval.BorderFlag.ExcludeMaximum)
            borderFlags |= Interval.BorderFlag.ExcludeMinimum;

        return new Interval(this.maxValue(), this.minValue(), borderFlags);
    }

    /*!
    Test if a value is inside an interval

    \param value Value
    \return true, if value >= minValue() && value <= maxValue()
     */
    contains(value) {
        if (!this.isValid())
            return false;

        if (value < this.minValue() || value > this.maxValue())
            return false;

        if (value == this.minValue() && this.borderFlags() & Interval.BorderFlag.ExcludeMinimum)
            return false;

        if (value == this.maxValue() && this.borderFlags() & Interval.BorderFlag.ExcludeMaximum)
            return false;

        return true;
    }

    /*!
    Limit the interval, keeping the border modes

    \param lowerBound Lower limit
    \param upperBound Upper limit

    \return Limited interval
     */
    limited(lowerBound, upperBound) {
        if (!this.isValid() || lowerBound > upperBound)
            return new Interval();

        var minValue = Math.max(this.minValue(), lowerBound);
        minValue = Math.min(minValue, upperBound);

        var maxValue = Math.max(this.maxValue(), lowerBound);
        maxValue = Math.min(maxValue, upperBound);

        return new Interval(minValue, maxValue, this.borderFlags());
    }

};

Enumerator.enum("BorderFlag { IncludeBorders = 0x00 , ExcludeMinimum = 0x01 , ExcludeMaximum = 0x02 , ExcludeBorders = 0x03 }", Interval);
///////////////////////////////////////////////end
