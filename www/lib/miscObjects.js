'use strict';
// var MoveToElement = 0;
// var LineToElement = 1;
// var Misc.CurveToElement = 2;
// var CurveToDataElement = 3;

/**
* A collection useful clases.
* @namespace
*/
var Misc = {}

Misc.EPSILON = Number.MIN_VALUE;

Misc.MoveToElement = 0;
Misc.LineToElement = 1;
Misc.CurveToElement = 2;
Misc.CurveToDataElement = 3;



/**
 * @classdesc Specify the font face, font size, and color of text
 * @constructor
 * @param {*} w 
 * @param {*} h 
 * 
 */
Misc.Image = function (w, h/* , a */) {
    var _w = w;
    var _h = h;

    var _colorTable = null;
    //var _a = 255;
    //var m_ctx = ctx;
    if (typeof w === 'object' && (_.has(w, "width") && _.has(w, "height"))) {
        _w = w.width;
        _h = w.height;
        //a = h;
    }
    if (w == undefined) {
        _w = 0;
        _h = 0;
    }

    /* if(a !== undefined){
        if(a < 255 && a >=0)
            _a = a;
    } */

    var cnvs = $('<canvas/>');
    var m_ctx = cnvs[0].getContext("2d");

    /*
    For every pixel in an ImageData object there are four pieces of information, the RGBA values:
    R - The color red (from 0-255)
    G - The color green (from 0-255)
    B - The color blue (from 0-255)
    A - The alpha channel (from 0-255; 0 is transparent and 255 is fully visible)
    The color/alpha information is held in an array, and is stored in the data property of the ImageData object.
    */
    var m_data = null;
    if (_w !== 0 && _h !== 0)
        m_data = m_ctx.createImageData(_w, _h);


    this.data = function () {
        return m_data.data;
    }

    this.scaleImageData = function (scale) {
        if (!m_data)
            return;
        var scaled = m_ctx.createImageData(m_data.width * scale, m_data.height * scale);
        var subLine = m_ctx.createImageData(scale, 1).data
        for (var row = 0; row < m_data.height; row++) {
            for (var col = 0; col < m_data.width; col++) {
                var sourcePixel = m_data.data.subarray(
                    (row * m_data.width + col) * 4,
                    (row * m_data.width + col) * 4 + 4
                );
                for (var x = 0; x < scale; x++) subLine.set(sourcePixel, x * 4)
                for (var y = 0; y < scale; y++) {
                    var destRow = row * scale + y;
                    var destCol = col * scale;
                    scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4)
                }
            }
        }

        m_data = scaled;
    }

    this.imageData = function () {
        return m_data;
    }

    this.setImageData = function (d) {
        m_data = d;
    }

    this.width = function () {
        return _w;
    }

    this.height = function () {
        return _h;
    }

    this.size = function () {
        return new Misc.Size(_w, _h);
    }

    this.isNull = function () {
        return m_data == null;
    }


    this.copy = function () {
        var res = new Misc.Image(this.width(), this.height());
        var imageDataCopy = new ImageData(new Uint8ClampedArray(this.imageData().data),
            this.imageData().width,
            this.imageData().height
        )
        res.setImageData(imageDataCopy);
        return res;
    }

    this.setAlpha = function (a) {
        var data = m_data.data;
        var i, len = data.length;
        for (i = 3; i < len; i += 4) {
            data[i] = a;
        }
    }

    this.setPixel = function (x, y, rgba) {
        if (typeof rgba == 'number') {
            rgba = _colorTable[Math.round(rgba)];
        }

        /* var arr = m_data.data.subarray(
                    (y * m_data.width + x) * 4,
                    (y * m_data.width + x) * 4 + 4
                );
        arr.set([rgba.r, rgba.g, rgba.b, rgba.a]); */


        var redAddress = y * (_w * 4) + x * 4;
        m_data.data[redAddress] = rgba.r;
        m_data.data[redAddress + 1] = rgba.g;
        m_data.data[redAddress + 2] = rgba.b;
        m_data.data[redAddress + 3] = 255;
        if (rgba.a) {
            if (rgba.a > 255)
                rgba.a = 255;
            if (rgba.a < 0)
                rgba.a = 0;
            m_data.data[redAddress + 3] = rgba.a;
        }

    }

    this.setColorTable = function (ct) {
        _colorTable = ct;
    }

    this.pixel = function (x, y) {
        if (y == undefined && _colorTable) {//x is a index into the colorTable
            return _colorTable[Math.round(x)];
        }
        var redAddress = y * (_w * 4) + x * 4;
        return { r: m_data.data[redAddress], g: m_data.data[redAddress + 1], b: m_data.data[redAddress + 2], a: m_data.data[redAddress + 3] };
    }
}

/*style
          solid
          dash : ctx.setLineDash([10, 5])
          dashDot : ctx.setLineDash([12, 5, 3, 5])
          dashDotDot : ctx.setLineDash([12, 5, 3, 5, 3, 5])
          dot : ctx.setLineDash([2, 8])
        */
/**
 * @classdesc Specify the font face, font size, and color of text
 * @constructor
 * @param {*} c 
 * @param {*} w 
 * @param {*} s 
 * 
 */
Misc.Pen = function (c, w, s) {
    if (typeof c === 'object') {
        return new Misc.Pen(c.color, c.width, c.style)
    }
    this.color = 'black';
    this.width = 1.0;
    this.style = 'solid';
    if (c == Static.NoPen || s == Static.NoPen)
        this.style = Static.NoPen;

    if (typeof (s) !== "undefined")
        this.style = s;
    if (typeof (w) !== "undefined")
        this.width = w;
    if (typeof (c) !== "undefined")
        this.color = c;
}
Misc.Pen.prototype.toString = function () {
    return '[color:' + this.color + ', width:' + this.width + ', style:' + this.style + ']';
}

Misc.Pen.prototype.isEqual = function (otherPen) {
    if (otherPen == undefined)
        return false;
    if (this.color == otherPen.color &&
        this.style == otherPen.style &&
        this.width == otherPen.width)
        return true

    return false;
}

/**
 * @classdesc Specify the font face, font size, and color of text
 * @constructor
 * @param {*} type 
 * 
 */
Misc.Brush = function (type) {
    this.color = Static.NoBrush;
    if (typeof (type) !== "undefined" /*  && typeof(type)=="string" */)
        this.color = type;
}
Misc.Brush.prototype.toString = function () {
    return '[Brush: ' + this.color + ']'
}

Misc.Brush.prototype.isEqual = function (otherBrush) {
    if (this.color == otherBrush.color)
        return true
    return false
}

/**
 * @classdesc Specify the font face, font size, and color of text
 * @constructor
 * @param {*} point1 
 * @param {*} point2 
 * 
 */
Misc.Line = function (point1, point2) {
    var m_p1 = point1;
    var m_p2 = point2
    this.p1 = function () {
        return m_p1
    }
    this.p2 = function () {
        return m_p2
    }
}
Misc.Line.prototype.x1 = function () {
    return this.p1().x
}
Misc.Line.prototype.x2 = function () {
    return this.p2().x
}
Misc.Line.prototype.y1 = function () {
    return this.p1().y
}
Misc.Line.prototype.y2 = function () {
    return this.p2().y
}
Misc.Line.prototype.x2 = function () {
    return this.p2().x
}

Misc.Line.prototype.length = function () {
    return Math.sqrt((this.p2().x - this.p1().x) * (this.p2().x - this.p1().x) + (this.p2().y - this.p1().y) * (this.p2().y - this.p1().y));
}

/**
 * @classdesc Specify the font face, font size, and color of text
 * @constructor
 * @param {*} w 
 * @param {*} h 
 * 
 */
Misc.Size = function (w, h) {
    if (w instanceof Misc.Size) {
        h = w.height;
        w = w.width;
    }
    this.width = 0.0;
    this.height = 0.0;
    if (typeof (h) !== "undefined") {
        this.width = w;
        this.height = h;
    }
}
Misc.Size.prototype.isValid = function () {
    if (this.width < 0 || this.height < 0)
        return false;
    return true;
}

Misc.Size.prototype.isEmpty = function () {
    return this.width <= 0 || this.height <= 0;
}

Misc.Size.prototype.copy = function () {
    return new Misc.Size(this.width, this.height);
}

Misc.Size.prototype.isEqual = function (size) {
    /* if ((this.width == size.width) && (this.height == size.height))
        return true;
    return false; */
    var x = this.width - size.width, y = this.height - size.height;
    return x * x + y * y < Misc.EPSILON;
}

/*Returns a size holding the maximum width and height of this size and the given otherSize.*/
Misc.Size.prototype.expandedTo = function (otherSize) {
    return new Misc.Size(Math.max(this.width, otherSize.width), Math.max(this.height, otherSize.height))
}

/* Returns a size holding the minimum width and height of this size and the given otherSize. */
Misc.Size.prototype.boundedTo = function (otherSize) {
    return new Misc.Size(Math.min(this.width, otherSize.width), Math.min(this.height, otherSize.height));
}

Misc.Size.prototype.toString = function () {
    return '[' + this.width + ', ' + this.height + ']'
}

/**
 * @classdesc Specify the font face, font size, and color of text
 * @constructor
 * @param {*} x 
 * @param {*} y 
 * 
 */
Misc.Point = function (x, y) {
    this.x = 0.0;
    this.y = 0.0;
    if (typeof (y) !== "undefined") {
        this.y = y;
    }
    if (typeof (x) !== "undefined") {
        this.x = x;
    }

    /* this.toString = function(){
    return '(' + this.x + ', ' + this.y + ')'
    } */

    /* this.isEqual = function(pt){
    return (this.x === pt.x && this.y === pt.y)
    } */

    /* interpolatedPoint = function(pt, xVal){
    if(xVal == pt.x){
    return pt;
    }
    if(xVal == this.x){
    return this;
    }
    var yVal  = (this.y - pt.y)/(this.x - pt.x)*(xVal - pt.x) + pt.y;
    return new Misc.Point(xVal, yVal);
    } */
}
Misc.Point.prototype.interpolatedPoint = function (pt, xVal) {
    if (xVal == pt.x) {
        return pt;
    }
    if (xVal == this.x) {
        return this;
    }
    var yVal = (this.y - pt.y) / (this.x - pt.x) * (xVal - pt.x) + pt.y;
    return new Misc.Point(xVal, yVal);
}

Misc.Point.prototype.logInterpolatedPoint = function (pt, xVal) {
    if (xVal == pt.x) {
        return pt;
    }
    if (xVal == this.x) {
        return this;
    }
    var yVal = (this.y - pt.y) / (math.log(this.x, 10) - math.log(pt.x, 10)) * (math.log(xVal, 10) - math.log(pt.x, 10)) + pt.y;
    return new Misc.Point(xVal, yVal);
}

Misc.Point.prototype.isEqual = function (pt) {
    //return (this.x === pt.x && this.y === pt.y)
    var x = this.x - pt.x, y = this.y - pt.y;
    return x * x + y * y < Misc.EPSILON;
}

Misc.Point.prototype.toString = function () {
    return '(' + this.x + ', ' + this.y + ')'
}

/**
 * @classdesc Specify the font face, font size, and color of text
 * @constructor
 * @param {*} param1 
 * @param {*} param2 
 * @param {*} param3 
 * @param {*} param4 
 * 
 */
Misc.Rect = function (param1, param2, param3, param4) {
    var m_left = 0.0;
    var m_top = 0.0;
    var m_right = -1.0;
    var m_bottom = -1.0;
    var m_width = -1.0;
    var m_height = -1;
    if (typeof (param4) !== "undefined") {
        m_left = param1;
        m_top = param2;
        m_width = param3;
        m_height = param4;
        m_right = m_left + m_width;
        m_bottom = m_top + m_height;
    } else if (typeof (param3) !== "undefined") {
        m_left = param1.x;
        m_top = param1.y;
        m_width = param2;
        m_height = param3;
        m_right = m_left + m_width;
        m_bottom = m_top + m_height;
    } else if (typeof (param2) !== "undefined") {
        m_left = param1.x;
        m_top = param1.y;
        if (typeof (param2.x) !== "undefined") {
            m_right = param2.x;
            m_bottom = param2.y;
            m_width = m_right - m_left;
            m_height = m_bottom - m_top;
        } else {
            m_width = param2.width;
            m_height = param2.height;
            m_right = m_left + m_width;
            m_bottom = m_top + m_height;
        }
    }

    this.left = function () {
        return m_left;
    }
    //Sets the left edge of the rectangle to the given x coordinate.
    //May change the width, but will never change the right edge of the rectangle.
    this.setLeft = function (val) {
        if (m_left === val)
            return;
        m_left = val
        m_width = m_right - m_left;
    }

    this.top = function () {
        return m_top;
    }
    //Sets the top edge of the rectangle to the given y coordinate.
    //May change the height, but will never change the bottom edge of the rectangle.
    this.setTop = function (val) {
        if (m_top === val)
            return;
        m_top = val
        m_height = m_bottom - m_top;
    }

    this.right = function () {
        return m_right;
    }
    //Sets the right edge of the rectangle to the given x coordinate.
    //May change the width, but will never change the leftt edge of the rectangle.
    this.setRight = function (val) {
        if (m_right === val)
            return;
        m_right = val
        m_width = m_right - m_left;
    }
    this.bottom = function () {
        return m_bottom;
    }
    //Sets the bottom edge of the rectangle to the given y coordinate.
    //May change the height, but will never change the top edge of the rectangle.
    this.setBottom = function (val) {
        if (m_bottom === val)
            return;
        m_bottom = val;
        m_height = m_bottom - m_top;
    }
    this.width = function () {
        return m_width;
    }

    this.height = function () {
        return m_height;
    }
}
//Sets the width of the rectangle to the given width.
//The right edge is changed, but not the left one.
Misc.Rect.prototype.setWidth = function (val) {
    if (this.width() === val)
        return;
    //m_width = val;
    //m_right = m_left + m_width;
    this.setRight(this.left() + val);
}

Misc.Rect.prototype.isValid = function () {
    if (this.width() <= 0 || this.height() <= 0)
        return false;
    return true;
}

Misc.Rect.prototype.copy = function () {
    return new Misc.Rect(this.left(), this.top(), this.width(), this.height());
}

//Sets the height of the rectangle to the given height.
//The bottom edge is changed, but not the top one.
Misc.Rect.prototype.setHeight = function (val) {
    if (this.height() === val)
        return;
    // m_height = val;
    //m_bottom = m_top + m_height
    this.setBottom(this.top() + val);

}

//Adds dx1, dy1, dx2 and dy2 respectively to the existing coordinates of the rectangle.
Misc.Rect.prototype.adjust = function (dx1, dy1, dx2, dy2) {
    this.setLeft(this.left() + dx1);
    this.setTop(this.top() + dy1);
    this.setRight(this.right() + dx2);
    this.setBottom(this.bottom() + dy2);

}

Misc.Rect.prototype.size = function () {
    return new Misc.Size(this.width(), this.height());
}

Misc.Rect.prototype.setSize = function (sz) {
    this.setWidth(sz.width)
    this.setHeight(sz.height)
    //return new Misc.Size(this.width(), this.height());
}

/* this.setRect = function( x, y, width, height){
m_left = x;
m_top = y;
m_width = width;
m_height = height;
m_right = m_left + m_width;
m_bottom = m_top + m_height;
} */

Misc.Rect.prototype.setRect = function (x, y, width, height) {
    //m_left = x;
    this.setLeft(x);
    // m_top = y;
    this.setTop(y);
    // m_width = width;
    this.setWidth(width);
    // m_height = height;
    this.setHeight(height);
    // m_right = m_left + m_width;
    // m_bottom = m_top + m_height;
}

/* this.united = function(rect){
return new Misc.Rect(Math.min(m_left, rect.left()),
Math.min(m_top, rect.top()),
Math.max(m_right, rect.right()) - Math.min(m_left, rect.left()),
Math.max(m_bottom, rect.bottom()) - Math.min(m_top, rect.top()))
} */

Misc.Rect.prototype.united = function (rect) {
    return new Misc.Rect(Math.min(this.left(), rect.left()),
        Math.min(this.top(), rect.top()),
        Math.max(this.right(), rect.right()) - Math.min(this.left(), rect.left()),
        Math.max(this.bottom(), rect.bottom()) - Math.min(this.top(), rect.top()));
}

Misc.Rect.prototype.normalized = function () {
    //normalize the rect.
    var rc = new Misc.Rect(this.left(), this.top(), this.width(), this.height());
    if (rc.width() < 0) {
        var temp = rc.right();
        rc.setRight(rc.left());
        rc.setLeft(temp);
    }
    if (this.height() < 0) {
        var temp = rc.bottom();
        rc.setBottom(rc.top());
        rc.setTop(temp);
    }
    return rc;
}

Misc.Rect.prototype.toRect = function () {
    return new Misc.Rect(Math.round(this.left()), Math.round(this.top()), Math.round(this.width()), Math.round(this.height()));

}


Misc.Rect.prototype.center = function () {
    return new Misc.Point(0.5 * (this.left() + this.right()), 0.5 * (this.top() + this.bottom()));
}

//Moves the rectangle, leaving the top-left corner at
//the given position. The rectangle's size is unchanged.
Misc.Rect.prototype.moveTopLeft = function (pt) {
    var w = this.width();
    var h = this.height();
    //m_left = pt.x;
    this.setLeft(pt.x);
    //m_top = pt.y;
    this.setTop(pt.y);
    //m_right = pt.x+m_width;
    this.setRight(pt.x + w);
    //m_bottom = pt.y+m_height;
    this.setBottom(pt.y + h);
}

Misc.Rect.prototype.moveBottomRight = function (pt) {
    var w = this.width();
    var h = this.height();
    // m_right = pt.x;
    this.setRight(pt.x);
    // m_bottom = pt.y;
    this.setBottom(pt.y);
    // m_left = pt.x-m_width
    this.setLeft(pt.x - w);
    // m_top = pt.y-m_height;
    this.setTop(pt.y - h);
}

Misc.Rect.prototype.moveCenter = function (pt) {
    var w = this.width();
    var h = this.height();
    // m_right = pt.x + 0.5*m_width;
    this.setRight(pt.x + 0.5 * w);
    // m_bottom = pt.y+0.5*m_height;
    this.setBottom(pt.y + 0.5 * h);
    // m_left = pt.x-0.5*m_width;
    this.setLeft(pt.x - 0.5 * w);
    // m_top = pt.y-0.5*m_height;
    this.setTop(pt.y - 0.5 * h);
}

//Returns true if this rectangle intersects with the given
//rectangle (i.e., there is at least one pixel that is within both
//rectangles), otherwise returns false.
Misc.Rect.prototype.intersects = function (rect) {
    //            var bres = this.contains(rect.leftTop() ) || this.contains(rect.rightTop() ) ||
    //                    this.contains(rect.leftBottom() ) || this.contains(rect.rightBottom() );
    //            var bres1 = rect.contains(this.leftTop() ) || rect.contains(this.rightTop() ) ||
    //                    rect.contains(this.leftBottom() ) || rect.contains(this.rightBottom() );
    //            return bres || bres1;

    var xmin = Math.max(this.left(), rect.left());
    var xmax1 = this.left() + this.width();
    var xmax2 = rect.left() + rect.width();
    var xmax = Math.min(xmax1, xmax2);
    if (xmax > xmin) {
        var ymin = Math.max(this.top(), rect.top());
        var ymax1 = this.top() + this.height();
        var ymax2 = rect.top() + rect.height();
        var ymax = Math.min(ymax1, ymax2);
        if (ymax > ymin) {
            return true;
        }
    }
    return false;
}

Misc.Rect.prototype.intersected = function (rect) {
    if ((rect.contains(new Misc.Point(this.left(), this.top()), false) ||
        rect.contains(new Misc.Point(this.right(), this.top()), false) ||
        rect.contains(new Misc.Point(this.right(), this.bottom()), false) ||
        rect.contains(new Misc.Point(this.left(), this.bottom()), false)) ||
        (this.contains(new Misc.Point(rect.left(), rect.top()), false) ||
            this.contains(new Misc.Point(rect.right(), rect.top()), false) ||
            this.contains(new Misc.Point(rect.right(), rect.bottom()), false) ||
            this.contains(new Misc.Point(rect.left(), rect.bottom()), false))
    ) {
        var left = Math.max(this.left(), rect.left());
        var top = Math.max(this.top(), rect.top());
        var width = Math.min(this.right() - left, rect.right() - left);
        var height = Math.min(this.bottom() - top, rect.bottom() - top);
        return new Misc.Rect(left, top, width, height);
    }
    return new Misc.Rect();
}


//Returns a new rectangle with dx1, dy1, dx2 and dy2 added
//respectively to the existing coordinates of this rectangle.
Misc.Rect.prototype.adjusted = function (left, top, right, bottom) {
    var pt1 = new Misc.Point(this.left() + left, this.top() + top);
    var pt2 = new Misc.Point(this.right() + right, this.bottom() + bottom);
    return new Misc.Rect(pt1, pt2);
}
//Returns true if the given point is inside or on the edge of the rectangle, otherwise
//returns false. If proper is true, this function only returns true if the given point is
//inside the rectangle (i.e., not on the edge).
Misc.Rect.prototype.contains = function (pt, proper) {
    if (typeof (proper) === "undefined" || proper === true)
        return pt.x > this.left() && pt.y > this.top() && pt.x < this.right() && pt.y < this.bottom();
    else
        return pt.x >= this.left() && pt.y >= this.top() && pt.x <= this.right() && pt.y <= this.bottom();
}

Misc.Rect.prototype.isEqual = function (other) {
    //console.log(r1)
    /* return this.left() == other.left() && this.right() == other.right() &&
    this.top() == other.top() && this.bottom() == other.bottom(); */
    var otherPoint = new Misc.Point(other.left(), other.top());

    if (new Misc.Point(this.left(), this.top()).isEqual(otherPoint)) {
        var x = this.width() - other.width(), y = this.height() - other.height();
        return x * x + y * y < Misc.EPSILON;
    }
    return false;

}

Misc.Rect.prototype.leftTop = function () {
    return new Misc.Point(this.left(), this.top());
}

Misc.Rect.prototype.topLeft = function () {
    return this.leftTop();
}

Misc.Rect.prototype.rightTop = function () {
    return new Misc.Point(this.right(), this.top());
}

Misc.Rect.prototype.topRight = function () {
    return new Misc.Point(this.right(), this.top());
}

Misc.Rect.prototype.leftBottom = function () {
    return new Misc.Point(this.left(), this.bottom());
}

Misc.Rect.prototype.rightBottom = function () {
    return new Misc.Point(this.right(), this.bottom());
}

Misc.Rect.prototype.bottomRight = function () {
    return this.rightBottom();
}

Misc.Rect.prototype.bottomLeft = function () {
    return this.rightBottom();
}

Misc.Rect.prototype.toString = function () {
    return '[' + this.left() + ', ' + this.top() + ', ' + this.width() + ', ' + this.height() + ']'
}

Misc.Rect.prototype.isEmpty = function () {
    return this.width() <= 0 || this.height() <= 0;
}

Misc.Rect.prototype.x = function () {
    return this.left();
}

Misc.Rect.prototype.y = function () {
    return this.top();
}


/* Constructs a polygon from the given rectangle. If closed is false, the polygon just contains the four points of 
the rectangle ordered clockwise, otherwise the polygon's fifth point is set to rectangle.topLeft().

Note that the bottom-right corner of the rectangle is located at (rectangle.x() + rectangle.width(), 
rectangle.y() + rectangle.height()). */

/**
 * @classdesc Specify the font face, font size, and color of text
 * @constructor
 * @param {*} rectangle 
 * @param {*} closed 
 * 
 */
Misc.Polygon = function (/* const QRect & */rectangle,/*  bool  */closed = false) {
    this.points = [];
    this.points.push(new Misc.Point(rectangle.left(), rectangle.top()),
        new Misc.Point(rectangle.right(), rectangle.top()),
        new Misc.Point(rectangle.right(), rectangle.bottom()),
        new Misc.Point(rectangle.left(), rectangle.bottom()));
    if (close) {
        this.points.push(new Misc.Point(rectangle.left(), rectangle.top()));
    }
}

Misc.Polygon.prototype.toString = function () {
    return "[Polygon]";
}



/**
 * @classdesc Specify the font face, font size, and color of text
 * @constructor
 * @param {number} th text height
 * @param {string} name font name
 * @param {string} style font style. Available styles are "normal", "italic", and "oblique". (This param is mostly used to specify italic text.)
 * @param {string | number} weight specify the font weight. Possible string values are "normal", "bold", "bolder" and "lighter". Possible number values are 100, 200, 300, 400, 500, 600, 700, 800, 900.
 * @param {string} color Set the color of text. The string provided should represent a valid html color.
 * 
*/
Misc.Font = function (th, name, style, weight, color) {
    if (typeof (th) == 'object') {
        this.th = th.th;
        this.name = th.name
        this.style = th.style; //normal italic or oblique
        this.weight = th.weight; //normal lighter or bold or 100, 200, ...900
        this.fontColor = th.fontColor;
    } else {
        this.th = 12;
        this.name = "Arial";
        this.style = "normal"; //normal italic or oblique
        this.weight = "normal"; //normal lighter or bold or 100, 200, ...900
        this.fontColor = "black";
    }
    if (typeof (th) != 'object') {
        if (typeof (color) !== "undefined")
            this.fontColor = color;
        if (typeof (weight) !== "undefined")
            this.weight = weight;
        if (typeof (style) !== "undefined")
            this.style = style;
        if (typeof (name) !== "undefined")
            this.name = name;
        if (typeof (th) !== "undefined")
            this.th = th;
    }
}




Misc.Font.prototype.textSize = function (str) {
    if (str == "" || typeof (str) == "undefined")
        return new Misc.Size(0, 0);
    var canvas = $('<canvas />')
    var context = canvas[0].getContext("2d");
    //context.save()
    context.font = this.weight + " " + this.style + " " + this.th + "px " + this.name;

    var w = context.measureText(str).width * 1.16;
    var h = context.measureText("M").width;
    //var w = str.width('this.weight + " " + this.style + " " + this.th + "px " + this.name')
    //context.restore()
    canvas.remove()
    return new Misc.Size(w, h);
}

Misc.Font.prototype.toString = function () {
    return '[th:' + this.th + ', name:' + this.name + ', style:' + this.style + ', weight:' + this.weight + ', color:' + this.fontColor + ']';
}

/**
 * @classdesc Specify the font face, font size, and color of text
 * @constructor
 * @param {*} elementType 
 * @param {*} xVal 
 * @param {*} yVal 
 * 
 */
Misc.MPathElement = function (elementType, xVal, yVal) {
    this.type = Misc.MoveToElement;
    this.x = 0.0;
    this.y = 0.0;
    if (typeof (xVal) !== "undefined")
        this.x = xVal;
    if (typeof (yVal) !== "undefined")
        this.y = yVal;
    if (typeof (elementType) !== "undefined")
        this.type = elementType;
}
Misc.MPathElement.prototype.toString = function () {
    return '[MPathElement: type(' + this.type + '), point' + new Misc.Point(this.x, this.y) + ']';
}

/**
 * @classdesc Specify the font face, font size, and color of text
 * @constructor
 */
Misc.MPath = function () {

    var m_elements = [];
    this.data = {}; //useful for passing any data in path

    this.elements = function () {
        return m_elements;
    }
}
Misc.MPath.prototype.elementCount = function () {
    return this.elements().length;
}

Misc.MPath.prototype.elementAt = function (index) {
    if (index < 0 || index >= this.elements().length)
        return null;
    return this.elements()[index];
}

Misc.MPath.prototype.moveTo = function (x, y) {
    this.elements().push(new Misc.MPathElement(Misc.MoveToElement, x, y))
}

Misc.MPath.prototype.lineTo = function (x, y) {
    this.elements().push(new Misc.MPathElement(Misc.LineToElement, x, y))
}

Misc.MPath.prototype.cubicTo = function (x, y, x1, y1, x2, y2) {
    var els = this.elements();
    els.push(new Misc.MPathElement(Misc.CurveToElement, x, y))
    els.push(new Misc.MPathElement(Misc.CurveToElement, x1, y1))
    els.push(new Misc.MPathElement(Misc.CurveToElement, x2, y2))
}

Misc.MPath.prototype.toString = function () {
    var s = '[MPath: elementCount = ' + this.elements().length + ']';
    return s;
}

Misc.MPath.prototype.isEmpty = function () {
    return this.elements().length == 0 ? true : false;
}

Misc.MPath.prototype.addRect = function (rect) {
    var els = this.elements();
    els.push(new Misc.MPathElement(Misc.MoveToElement, rect.left(), rect.top()));
    els.push(new Misc.MPathElement(Misc.LineToElement, rect.right(), rect.top()));
    els.push(new Misc.MPathElement(Misc.LineToElement, rect.right(), rect.bottom()));
    els.push(new Misc.MPathElement(Misc.LineToElement, rect.left(), rect.bottom()));
    els.push(new Misc.MPathElement(Misc.LineToElement, rect.left(), rect.top()));
}

Misc.MPath.prototype.addPolygon = function (polygon) {
    if (!polygon || !polygon.length)
        return
    this.elements().push(new Misc.MPathElement(Misc.MoveToElement, polygon[0].x, polygon[0].y));
    for (var i = 1; i < polygon.length; ++i) {
        this.elements().push(new Misc.MPathElement(Misc.LineToElement, polygon[i].x, polygon[i].y));
    }
}

Misc.MPath.prototype.addPathElement = function (pathElement) {
    this.elements().push(pathElement);
}

Misc.MPath.prototype.boundingRect = function () {
    var pts = [];

    var left = 0;
    var top = 0;
    var right = 0;
    var bottom = 0;
    var firstPass = false;

    for (var i = 0; i < this.elements().length; i++) {
        var element = this.elements()[i];

        switch (element.type) {
            case Misc.LineToElement:
            case Misc.MoveToElement:
            case Misc.CurveToElement: {
                if (!firstPass) {
                    left = element.x;
                    top = element.y;
                    right = element.x;
                    bottom = element.y;
                    firstPass = true;
                }
                left = Math.min(left, element.x);
                right = Math.max(right, element.x);
                top = Math.min(top, element.y);
                bottom = Math.max(bottom, element.y);
                break;
            }
            case Misc.CurveToDataElement: {
                break;
            }
        }
    }

    if (this.data.rotation == undefined || this.data.rotation == 0) {
        return new Misc.Rect(left, top, right - left, bottom - top);
    }

    let theta = this.data.rotation;

    theta = theta * Math.PI / 180; //in radians

    let w = right - left;
    let h = bottom - top;

    let newHeight = Math.abs(w * Math.sin(theta)) + Math.abs(h * Math.cos(theta));

    let newWidth = Math.abs(h * Math.sin(theta)) + Math.abs(w * Math.cos(theta));
    return new Misc.Rect(left - (newWidth - w) / 2, top - (newHeight - h) / 2, newWidth, newHeight);
}

