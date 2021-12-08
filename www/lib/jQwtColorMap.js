'use strict';

class ColorStop {
    constructor(p, c) {
        this.pos;
        this.m_rgb;
        //var r, g, b, a;
        /*this.r
        this.g
        this.b
        this.a*/

        // precalculated values
        //var rStep, gStep, bStep, aStep;
        /*this.r0
        this.g0
        this.b0
        this.a0
        this.posStep;*/

        if (p == undefined) {
            this.pos = 0.0;
            this.m_rgb = 0;
        } else {
            this.pos = p;
            this.m_rgb = Static.HTMLToRGB(c);
            this.r = this.m_rgb.r;
            this.g = this.m_rgb.g;
            this.b = this.m_rgb.b;
            //a = qAlpha( rgb );

            /*
            when mapping a value to rgb we will have to calcualate:
            - const int v = int( ( s1.v0 + ratio * s1.vStep ) + 0.5 );

            Thus adding 0.5 ( for rounding ) can be done in advance
             */
            this.r0 = this.r + 0.5;
            this.g0 = this.g + 0.5;
            this.b0 = this.b + 0.5;
            this.a0 = this.a + 0.5;

            this.rStep = 0.0;
            this.gStep = 0.0;
            this.bStep = 0.0;
            this.aStep = 0.0;
            this.posStep = 0.0;
        }

        this.updateSteps = function (nextStop) {
            this.rStep = nextStop.r - this.r;
            this.gStep = nextStop.g - this.g;
            this.bStep = nextStop.b - this.b;
            this.aStep = nextStop.a - this.a;
            this.posStep = nextStop.pos - this.pos;
        }
    }
}

class ColorStops {
    constructor() {
        var m_doAlpha = false;

        var m_stops = []; //new Array(256);

        this.findUpper = function (pos) {
            var index = 0;
            var n = m_stops.length;

            //var stops = m_stops.data();
            while (n > 0) {
                var half = n >> 1;
                var middle = index + half;

                if (m_stops[middle].pos <= pos) {
                    index = middle + 1;
                    n -= half + 1;
                } else
                    n = half;
            }
            return index;

        }

        this.insert = function (pos, color) {
            // Lookups need to be very fast, insertions are not so important.
            // Anyway, a balanced tree is what we need here. TODO ...
            if (color[0] !== "#");
            color = Static.colorNameToHex(color);

            if (pos < 0.0 || pos > 1.0)
                return;

            var index;
            if (m_stops.length == 0) {
                index = 0;
                m_stops.resize(1);
            } else {
                index = this.findUpper(pos);
                if (index == m_stops.length ||
                    Math.abs(m_stops[index].pos - pos) >= 0.001) {
                    m_stops.resize(m_stops.length + 1);
                    for (var i = m_stops.length - 1; i > index; i--)
                        m_stops[i] = m_stops[i - 1];
                }
            }

            m_stops[index] = new ColorStop(pos, color);
            if (color.alpha != 255)
                m_doAlpha = true;

            if (index > 0)
                m_stops[index - 1].updateSteps(m_stops[index]);

            if (index < m_stops.length - 1)
                m_stops[index].updateSteps(m_stops[index + 1]);
        }

        this.rgb = function (mode, pos) {
            if (pos <= 0.0)
                return m_stops[0].m_rgb;
            if (pos >= 1.0)
                return m_stops[m_stops.length - 1].m_rgb;

            var index = this.findUpper(pos);
            if (mode == FixedColors) {
                return m_stops[index - 1].m_rgb;
            } else {
                var s1 = m_stops[index - 1];

                var ratio = (pos - s1.pos) / (s1.posStep);

                var r = Math.round(s1.r0 + ratio * s1.rStep);
                var g = Math.round(s1.g0 + ratio * s1.gStep);
                var b = Math.round(s1.b0 + ratio * s1.bStep);

                /*if ( d_doAlpha ){
                if ( s1.aStep ){
                var a = int( s1.a0 + ratio * s1.aStep );
                return qRgba( r, g, b, a );
                }
                else{
                return qRgba( r, g, b, s1.a );
                }
                }*/
                //else
                //{
                return Static.mRgb(r, g, b);
                //}
            }
        }

        this.stops = function () {
            var positions = new Array(m_stops.length);
            for (var i = 0; i < m_stops.length; i++)
                positions[i] = m_stops[i].pos;
            return positions;
        }
    }
}

//! Constructor
class ColorMap {
    constructor(format) {
        var m_format = format

            this.format = function () {
            return m_format;
        }

        /*!
        Build and return a color map of 256 colors

        The color table is needed for rendering indexed images in combination
        with using colorIndex().

        \param interval Range for the values
        \return A color table, that can be used for a QImage
         */
        this.colorTable = function (interval) {
            var table = new Array(256)
                if (interval.isValid()) {
                    var step = interval.width() / (table.length - 1);
                    for (var i = 0; i < table.length; i++)
                        table[i] = this.rgb(interval, interval.minValue() + step * i);
                }

                return table;
        }

        /*!
        Map a value of a given interval into a RGB value.

        \param interval Range for the values
        \param value Value
        \return RGB value, corresponding to value
         */
        //Subclass must reimplement rgb()
        this.rgb = function (interval, value) {
            return {
                r: 0,
                g: 0,
                b: 0
            };
        }
    }
}

//Define the LinearColorMap constructor
/*!
Constructor
\param format
 */
/*!
Build a color map with two stops at 0.0 and 1.0. The color
at 0.0 is Qt::blue, at 1.0 it is Qt::yellow.

\param format Preferred format of the color map
 */
/*!
Build a color map with two stops at 0.0 and 1.0.

\param color1 Color used for the minimum value of the value interval
\param color2 Color used for the maximum value of the value interval
\param format Preferred format for the color map
 */
//function LinearColorMap(color1, color2, format) {
class LinearColorMap extends ColorMap {
    constructor(color1, color2, format) {
        // Call the parent constructor, making sure (using Function#call)
        // that "this" is set correctly during the call
        var singleParam = format == undefined;
        if (singleParam)
            format = color1;
        //ColorMap.call(this, format);
        super(format);

        var m_colorStops

        this.m_mode = ScaledColors;
        //this.m_mode = FixedColors;


        /*!
        Set the color range

        Add stops at 0.0 and 1.0.

        \param color1 Color used for the minimum value of the value interval
        \param color2 Color used for the maximum value of the value interval

        \sa color1(), color2()
         */
        this.setColorInterval = function (color1, color2) {
            m_colorStops = new ColorStops();
            m_colorStops.insert(0.0, color1);
            m_colorStops.insert(1.0, color2);
        }

        if (!singleParam)
            this.setColorInterval(color1, color2);
        else
            this.setColorInterval("#0000FF", "#FFFF00"); //blue, yellow

        /*!
        \brief Set the mode of the color map

        FixedColors means the color is calculated from the next lower
        color stop. ScaledColors means the color is calculated
        by interpolating the colors of the adjacent stops.

        \sa mode()
         */
        this.setMode = function (mode) {
            this.m_mode = mode;
        }

        /*!
        \return Mode of the color map
        \sa setMode()
         */
        this.mode = function () {
            return this.m_mode;
        }

        /*!
        Add a color stop

        The value has to be in the range [0.0, 1.0].
        F.e. a stop at position 17.0 for a range [10.0,20.0] must be
        passed as: (17.0 - 10.0) / (20.0 - 10.0)

        \param value Value between [0.0, 1.0]
        \param color Color stop
         */
        this.addColorStop = function (value, color) {
            if (value >= 0.0 && value <= 1.0)
                m_colorStops.insert(value, color);
        }

        /*!
        \return Positions of color stops in increasing order
         */
        this.colorStops = function () {
            return m_colorStops.stops();
        }

        /*!
        \return the first color of the color range
        \sa setColorInterval()
         */
        this.color1 = function () {
            //return QColor( m_colorStops.rgb( this.m_mode, 0.0 ) );
            return m_colorStops.rgb(this.m_mode, 0.0);
        }

        /*!
        \return the second color of the color range
        \sa setColorInterval()
         */
        this.color2 = function () {
            //return QColor( m_colorStops.rgb( this.m_mode, 1.0 ) );
            return m_colorStops.rgb(this.m_mode, 1.0);
        }

        /*!
        Map a value of a given interval into a RGB value

        \param interval Range for all values
        \param value Value to map into a RGB value

        \return RGB value for value
         */
        this.rgb = function (interval, value) {
            if (isNaN(value))
                return 0 //0u;

                var width = interval.width();
            if (width <= 0.0)
                return 0 //0u;

                var ratio = (value - interval.minValue()) / width;
            return m_colorStops.rgb(this.m_mode, ratio);
        }

        /*!
        \brief Map a value of a given interval into a color index

        \param interval Range for all values
        \param value Value to map into a color index

        \return Index, between 0 and 255
         */
        this.colorIndex = function (interval, value) {
            var width = interval.width();

            if (isNaN(value) || width <= 0.0 || value <= interval.minValue())
                return 0;

            if (value >= interval.maxValue())
                return 255;

            var ratio = (value - interval.minValue()) / width;

            var index;
            if (this.m_mode == FixedColors)
                index = /*static_cast<unsigned char>*/(ratio * 255); // always floor
            else
                index = /*static_cast<unsigned char>*/(ratio * 255 + 0.5);

            return index;
        }

    }
}
