'use strict';
/* Static.mTransformPath = function (xMap, yMap, path, doAlign) {
var shape = new Misc.MPath;
//shape.setFillRule( path.fillRule() );

for (var i = 0; i < path.elementCount(); i++) {
var element = path.elementAt(i);

var x = xMap.transform(element.x);
var y = yMap.transform(element.y);

switch (element.type) {
case Misc.MoveToElement: {
if (doAlign) {
x = Math.round(x);
y = Math.round(y);
}

shape.moveTo(x, y);
break;
}
case Misc.LineToElement: {
if (doAlign) {
x = Math.round(x);
y = Math.round(y);
}

shape.lineTo(x, y);
break;
}
case Misc.CurveToElement: {
var element1 = path.elementAt(++i);
var x1 = xMap.transform(element1.x);
var y1 = yMap.transform(element1.y);

var element2 = path.elementAt(++i);
var x2 = xMap.transform(element2.x);
var y2 = yMap.transform(element2.y);

shape.cubicTo(x, y, x1, y1, x2, y2);
break;
}
case Misc.CurveToDataElement: {
break;
}
}
}

return shape;
} */

/* Static.mInvTransform = function(xMap, yMap, rect) {
var x1 = xMap.invTransform(rect.left());
var x2 = xMap.invTransform(rect.right() - 1);
var y1 = yMap.invTransform(rect.top());
var y2 = yMap.invTransform(rect.bottom() - 1);
var r = new Misc.Rect(new Misc.Point(x1, y1), x2 - x1, y2 - y1);
//r.normalized()
return r.normalized();

}

Static.mTransform = function(xMap, yMap, rect) {
var x1 = xMap.transform(rect.left());
var x2 = xMap.transform(rect.right())// - 1);
var y1 = yMap.transform(rect.top());
var y2 = yMap.transform(rect.bottom())// - 1);
var r = new Misc.Rect(new Misc.Point(x1, y1), x2 - x1, y2 - y1);
//r.normalized()
return r.normalized();

}  */


/**
 * A scale map. ScaleMap offers transformations from the coordinate system of a scale into the linear coordinate system 
 * of a paint device and vice versa.
 */
class ScaleMap {
    static invTransform_Rect(xMap, yMap, rect) {
        var x1 = xMap.invTransform(rect.left());
        var x2 = xMap.invTransform(rect.right() - 1);
        var y1 = yMap.invTransform(rect.top());
        var y2 = yMap.invTransform(rect.bottom() - 1);
        var r = new Misc.Rect(new Misc.Point(x1, y1), x2 - x1, y2 - y1);
        //r.normalized()
        return r.normalized();

    }

    static transform_Rect(xMap, yMap, rect) {
        var x1 = xMap.transform(rect.left());
        var x2 = xMap.transform(rect.right()) // - 1);
            var y1 = yMap.transform(rect.top());
        var y2 = yMap.transform(rect.bottom()) // - 1);
            var r = new Misc.Rect(new Misc.Point(x1, y1), x2 - x1, y2 - y1);
        //r.normalized()
        return r.normalized();

    }

    /*!
    Transform a point from paint to scale coordinates
    xMap X map
    yMap Y map
    pos Position in paint coordinates
    Position in scale coordinates
     */
    static invTransform(xMap, yMap, pos) {
        return new Misc.Point(xMap.invTransform1(pos.x), yMap.invTransform1(pos.y));
        //return {x : xMap.invTransform1(pos.x), y : yMap.invTransform1(pos.y)};
    }

    /*!
    Transform a point from scale to paint coordinates
    xMap X map
    yMap Y map
    pos Position in scale coordinates
    Position in paint coordinates
     */
    static transform(xMap, yMap, pos) {
        return new Misc.Point(xMap.transform1(pos.x), yMap.transform1(pos.y));
    }

    static transformPath(xMap, yMap, path, doAlign) {
        var shape = new Misc.MPath;
        //shape.setFillRule( path.fillRule() );

        for (var i = 0; i < path.elementCount(); i++) {
            var element = path.elementAt(i);

            var x = xMap.transform(element.x);
            var y = yMap.transform(element.y);

            switch (element.type) {
            case Misc.MoveToElement: {
                    if (doAlign) {
                        x = Math.round(x);
                        y = Math.round(y);
                    }

                    shape.moveTo(x, y);
                    break;
                }
            case Misc.LineToElement: {
                    if (doAlign) {
                        x = Math.round(x);
                        y = Math.round(y);
                    }

                    shape.lineTo(x, y);
                    break;
                }
            case Misc.CurveToElement: {
                    var element1 = path.elementAt(++i);
                    var x1 = xMap.transform(element1.x);
                    var y1 = yMap.transform(element1.y);

                    var element2 = path.elementAt(++i);
                    var x2 = xMap.transform(element2.x);
                    var y2 = yMap.transform(element2.y);

                    shape.cubicTo(x, y, x1, y1, x2, y2);
                    break;
                }
            case Misc.CurveToDataElement: {
                    break;
                }
            }
        }

        return shape;
    }
    constructor() {
        var d_s1 = 0.0;
        var d_s2 = 1.0;
        var d_p1 = 0.0;
        var d_p2 = 1.0;
        var d_cnv = 1.0;
        var d_ts1 = 0.0;
        var d_transform = null;
		
		this.setd_cnv = function(val) {
			d_cnv = val;
		}
		
		this.setd_ts1 = function(val) {
			d_ts1 = val;
		}

        /*!
        Initialize the map with a transformation
         */
        this.setTransformation = function (trans) {

            if (trans !== d_transform) {

                d_transform = trans;

            }

            this.setScaleInterval(d_s1, d_s2);
            //alert(d_transform)
        }

        this.transformation = function () {
            return d_transform;
        }

        /*
        Specify the borders of the scale interval
        s1 first border
        s2 second border
        scales might be aligned to
        transformation depending boundaries
         */
        this.setScaleInterval = function (s1, s2) {
            d_s1 = s1;
            d_s2 = s2;
            if (d_transform) {
                d_s1 = d_transform.bounded(d_s1);
                d_s2 = d_transform.bounded(d_s2);
            }
            this.updateFactor();
        }

        /*!
        Specify the borders of the paint device interval
        p1 first border
        p2 second border
         */
        this.setPaintInterval = function (p1, p2) {
            d_p1 = p1;
            d_p2 = p2;
            this.updateFactor();
        }
		
		this.copy = function(){
			var cpy = new ScaleMap();
			cpy.setScaleInterval(this.s1(), this.s2())
			cpy.setPaintInterval( this.p1(), this.p2() );
			return cpy;
		}

        this.updateFactor = function () {
            d_ts1 = d_s1;
            var ts2 = d_s2;
            if (d_transform) {
                d_ts1 = d_transform.transform(d_ts1);
                ts2 = d_transform.transform(ts2);
            }
            d_cnv = 1.0;
            if (d_ts1 != ts2) {
                d_cnv = (d_p2 - d_p1) / (ts2 - d_ts1);
            }
        }

        /*!
        Transform a point from paint to scale coordinates
        xMap X map
        yMap Y map
        pos Position in paint coordinates
        Position in scale coordinates
         */
        this.invTransform = function (p) {
            return this.invTransform1(p);
        }

        /*!
        Transform a point from scale to paint coordinates
        xMap X map
        yMap Y map
        pos Position in scale coordinates
        Position in paint coordinates
         */
        this.transform = function (s) {
            return this.transform1(s);
        }

        /*!
        Transform a point related to the scale interval into an point
        related to the interval of the paint device

        \param s Value relative to the coordinates of the scale
        \return Transformed value

        \sa invTransform()
         */
        this.transform1 = function (s) {
            if (d_transform) {
                //alert(s)
                s = d_transform.transform(s);
                //alert(s)
            }

            return d_p1 + (s - d_ts1) * d_cnv;
        }

        /*!
        Transform an paint device value into a value in the
        interval of the scale.

        \param p Value relative to the coordinates of the paint device
        \return Transformed value

        \sa transform()
         */
        this.invTransform1 = function (p) {
            var s = d_ts1 + (p - d_p1) / d_cnv;
            if (d_transform)
                //s = d_transform.invTransform1(s);
                s = d_transform.invTransform(s);
            return s;
        }		
		/*!
		\return First border of the scale interval
		*/
		this.s1 = function (){
			return d_s1;
		}

		/*!
			\return Second border of the scale interval
		*/
		this.s2 = function (){
			return d_s2;
		}

		/*!
			\return First border of the paint interval
		*/
		this.p1 = function (){
			return d_p1;
		}

		/*!
			\return Second border of the paint interval
		*/
		this.p2 = function (){
			return d_p2;
		}
		
		//! Copy constructor
		this.copy = function(){
			var cpy = new ScaleMap();
			cpy.setScaleInterval(d_s1, d_s2);
			cpy.setPaintInterval(d_p1, d_p2)
			cpy.setd_cnv(d_cnv);
			cpy.setd_ts1(d_ts1 );		
			if ( this.transformation() )
				cpy.setTransformation(this.transformation().copy());
			return cpy;
		}
		
		//! \return True, when ( p1() < p2() ) != ( s1() < s2() )
		this.isInverting = function()
		{
			return ( ( d_p1 < d_p2 ) != ( d_s1 < d_s2 ) );
		}

        this.toString = function () {
            return '[ScaleMap "' + d_cnv + '"]';
        }
    }

}
//////////////////////////////////////////////////////end
