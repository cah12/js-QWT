'use strict';
/**
 * A collection of utility classes for painting to the canvas
 * @namespace
 */
var PaintUtil = {};
PaintUtil.ContextPainter = function (ctx) {

    var m_ctx = ctx;
    var penStyle = "";
    var m_font = null;

    class Transform {
        constructor() {
            var trans = m_ctx.getTransform();

            this.dx = function () {
                return trans.m41;
            }

            this.dy = function () {
                return trans.m42;
            }
            /*
            x' = m11*x + m21*y + dx
            y' = m22*y + m12*x + dy
            if (is not affine) {
                w' = m13*x + m23*y + m33
                x' /= w'
                y' /= w'
            }
            If rotation or shearing has been specified, this function returns the bounding rectangle. To retrieve the exact region the given rectangle maps to, use the mapToPolygon() function instead.
            */
            this.mapRect = function (rect) {
                var x = rect.left();
                var y = rect.top();
                return new Misc.Rect(trans.m11 * x + trans.m21 * y + this.dx(), trans.m22 * y + trans.m12 * x + this.dy(), rect.width(), rect.height());
            }

            this.map = function (pt) {
                var x = pt.x;
                var y = pt.y;
                return new Misc.Point(trans.m11 * x + trans.m21 * y + this.dx(), trans.m22 * y + trans.m12 * x + this.dy());
            }
        }
    }

    this.getTransform = function (x, y) {
        return new Transform();
    }

    this.textSize = function (str) {
        m_ctx.save()
        m_ctx.font = m_font.weight + " " + m_font.style + " " + m_font.th + "px " + m_font.name;
        var w = m_ctx.measureText(str).width;
        var h = m_ctx.measureText("M").width;
        m_ctx.restore()
        return new Misc.Size(w, h);
    }

    this.context = function () {
        return m_ctx;
    }

    this.canvasWidth = function () {
        return m_ctx.canvas.width;
    }

    this.canvasHeight = function () {
        return m_ctx.canvas.height;
    }

    this.save = function () {
        m_ctx.save();
    }

    this.restore = function () {
        m_ctx.restore();
    }



    this.translate = function (x, y) {
        m_ctx.translate(x, y);
    }

    this.rotate = function (rot) {
        m_ctx.rotate(rot * Math.PI / 180);
    }

    this.scale = function (x, y) {
        m_ctx.scale(x, y);
    }


    /*style
      solid
      dash : ctx.setLineDash([10, 5])
      dashDot : ctx.setLineDash([12, 5, 3, 5])
      dashDotDot : ctx.setLineDash([12, 5, 3, 5, 3, 5])
      dot : ctx.setLineDash([2, 8])
    */
    this.setPen = function (pen) {
        if (this.style == Static.NoPen)
            m_ctx.strokeStyle = "transparent";
        else
            m_ctx.strokeStyle = pen.color;
        m_ctx.lineWidth = pen.width;
        if (pen.style === "dash")
            m_ctx.setLineDash([10, 5]);
        else if (pen.style === "dot")
            m_ctx.setLineDash([3, 8]);
        else if (pen.style === "dashDot")
            m_ctx.setLineDash([12, 5, 3, 5]);
        else if (pen.style === "dashDotDot")
            m_ctx.setLineDash([12, 5, 3, 5, 3, 5]);

        penStyle = pen.style;
    }

    this.pen = function () {
        var color = ""
        if (m_ctx.strokeStyle == "transparent")
            color = NoPen;
        else
            color = m_ctx.strokeStyle;
        return new Misc.Pen(color, m_ctx.lineWidth, penStyle);

    }

    this.setBrush = function (brush) {
        if (brush.color === undefined || brush.color === Static.NoBrush)
            m_ctx.fillStyle = "transparent";
        else
            m_ctx.fillStyle = brush.color;
    }

    this.brush = function () {
        return m_ctx.fillStyle;
    }

    this.setFont = function (font) {
        m_ctx.font = font.weight + " "
            + font.style + " "
            + font.th + "px "
            + font.name;
        if (typeof (font.fontColor) !== "")
            m_ctx.fillStyle = font.fontColor;

        m_font = font;
    }

    this.font = function () {
        return m_font;
    }

    this.fillRect = function (rect, brush) {
        if (brush.style !== NoBrush) {
            //m_ctx.save();
            this.setBrush(brush);
            m_ctx.rect(rect.left(), rect.top(), rect.width(), rect.height());
            m_ctx.fill();
            //m_ctx.restore();
        }
    }

    this.drawPath = function (path) {
        m_ctx.beginPath()
        for (var i = 0; i < path.elementCount(); i++) {
            var element = path.elementAt(i);
            var x = element.x;
            var y = element.y;


            switch (element.type) {
                case Misc.MoveToElement:
                    {

                        //                        if ( doAlign )
                        //                        {
                        //                            x = qRound( x );
                        //                            y = qRound( y );
                        //                        }


                        m_ctx.moveTo(x, y);
                        break;
                    }
                case Misc.LineToElement:
                    {
                        //                        if ( doAlign )
                        //                        {
                        //                            x = qRound( x );
                        //                            y = qRound( y );
                        //                        }


                        m_ctx.lineTo(x, y);
                        break;
                    }
                case Misc.CurveToElement:
                    {
                        var element1 = path.elementAt(++i);
                        var x1 = element1.x;
                        var y1 = element1.y;

                        var element2 = path.elementAt(++i);
                        var x2 = element2.x;
                        var y2 = element2.y;

                        m_ctx.bezierCurveTo(x, y, x1, y1, x2, y2);

                        break;
                    }
                case Misc.CurveToDataElement:
                    {
                        break;
                    }
            }
        }
        m_ctx.stroke();
        m_ctx.fill();
    }


    this.drawPoint = function (pt) {
        var pw = this.pen().width
        m_ctx.fillStyle = this.pen().color;
        m_ctx.fillRect(pt.x - pw * 1.0, pt.y - pw * 1.0, pw * 1.9, pw * 2.0)
    }

    this.drawPoints = function (points) {
        m_ctx.fillStyle = this.pen().color
        var pw = this.pen().width
        for (var i = 0; i < points.length; ++i)
            m_ctx.fillRect(points[i].x - pw * 1.0, points[i].y - pw * 1.0, pw * 1.9, pw * 2.0)

    }

    this.drawLine = function (param1, param2, param3, param4) {
        m_ctx.beginPath()
        if (typeof (param4) !== "undefined" && typeof (param3) !== "undefined") {
            m_ctx.moveTo(param1, param2);
            m_ctx.lineTo(param3, param4);
            //m_ctx.stroke();
        }
        else {
            m_ctx.moveTo(param1.x, param1.y);
            m_ctx.lineTo(param2.x, param2.y);
        }
        m_ctx.stroke();
    }


    this.drawImage = function (image, param1, param2, param3, param4) {
        var x = 0, y = 0, w = image.width(), h = image.height();
        if (typeof param1 === 'object') {
            x = param1.left();
            y = param1.top();
            w = param1.width();
            h = param1.height();
        }
        if (typeof param1 === 'number' && typeof param2 === 'number') {
            x = param1;
            y = param2;
        }
        if (typeof param3 === 'number' && typeof param4 === 'number') {
            w = param3;
            h = param4;
        }
        if (image.width() > 0 && image.height() > 0) {
            m_ctx.putImageData(image.imageData(), x, y, 0, 0, w, h);
        }
    }

    this.drawPolyline = function (polyline) {
        m_ctx.beginPath();
        //m_ctx.lineCap = "butt";
        m_ctx.moveTo(polyline[0].x, polyline[0].y);
        for (var i = 1; i < polyline.length; ++i)
            m_ctx.lineTo(polyline[i].x, polyline[i].y);
        m_ctx.stroke();
    }

    this.drawPolygon = function (polyline) {
        if ((polyline[0].x !== polyline[polyline.length - 1].x) || (polyline[0].y !== polyline[polyline.length - 1].y))
            polyline.push(polyline[0]);
        m_ctx.beginPath();
        this.drawPolyline(polyline);
        m_ctx.closePath();
        m_ctx.fill();
    }

    this.drawRect = function (x, y, width, height) {
        m_ctx.beginPath();
        if (typeof (x) == 'number')
            m_ctx.rect(x, y, width, height);
        else {
            var rect = x;
            m_ctx.rect(rect.left(), rect.top(), rect.width(), rect.height());
        }
        m_ctx.stroke();
        m_ctx.fill();
        m_ctx.closePath()
    }

    this.drawCircle = function (x, y, radius) {
        m_ctx.beginPath();
        if (typeof (x) == 'number')
            //m_ctx.rect(x, y, width, height);
            m_ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        else {
            var pt = x;
            radius = y;
            m_ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI, false);
        }
        m_ctx.stroke();
        m_ctx.fill();
        m_ctx.closePath()
    }

    //this.drawEllipse = function(centerX, centerY, width, height) {
    this.drawEllipse = function (rect) {
        var centerX = (rect.left() + rect.right()) / 2
        var centerY = (rect.top() + rect.bottom()) / 2
        var width = rect.width()
        var height = rect.height()
        m_ctx.beginPath();

        m_ctx.moveTo(centerX, centerY - height / 2); // A1

        m_ctx.bezierCurveTo(
            centerX + width / 2, centerY - height / 2, // C1
            centerX + width / 2, centerY + height / 2, // C2
            centerX, centerY + height / 2); // A2

        m_ctx.bezierCurveTo(
            centerX - width / 2, centerY + height / 2, // C3
            centerX - width / 2, centerY - height / 2, // C4
            centerX, centerY - height / 2); // A1

        //m_ctx.fillStyle = "red";
        //m_ctx.stroke();
        //m_ctx.fill();

        m_ctx.stroke();
        m_ctx.fill();
        m_ctx.closePath()
        m_ctx.closePath();
    }

    //    this.drawRect2 = function(x, y, width, height ){
    //        m_ctx.beginPath();
    //        m_ctx.rect(x, y, width, height);
    //        m_ctx.stroke();
    //    }

    //rotation is clockwise from the x-axis
    this.drawRotatedText = function (txt, tx, ty, rotation) {
        // var bottomUp = -1;
        // if(typeof(topDown) !== "undefined"){
        //     if(topDown === true)        
        //         bottomUp = 1;
        // }
        var thetaRad = Math.PI * rotation / 180; //radians
        var size = m_ctx.measureText(txt);
        m_ctx.save();
        // var x = tx;// + size.width/2;
        // var y = ty - bottomUp*size.width/2;
        var x = tx// - size.width*0.5*Math.cos(thetaRad);
        var y = ty// - size.width*0.5*Math.sin(thetaRad);
        m_ctx.translate(x, y);

        m_ctx.rotate(thetaRad);
        //m_ctx.translate(-x,-y);
        // if(bottomUp === -1)
        //m_ctx.textAlign = "start";
        m_ctx.textAlign = "left";

        m_ctx.fillText(txt, 0, 0);
        m_ctx.restore();

    }


    this.drawVerticalText = function (txt, tx, ty, topDown) {
        var bottomUp = -1;
        if (typeof (topDown) !== "undefined") {
            if (topDown === true)
                bottomUp = 1;
        }

        var size = m_ctx.measureText(txt);
        m_ctx.save();
        var x = tx;// + size.width/2;
        var y = ty - bottomUp * size.width / 2;
        m_ctx.translate(x, y);

        m_ctx.rotate(bottomUp * Math.PI / 2);
        m_ctx.translate(-x, -y);
        if (bottomUp === -1)
            m_ctx.textAlign = "left";
        m_ctx.fillText(txt, x, y);
        m_ctx.restore();

    }

    function adjustedText(text, maxTextLength) {
        //if(text==undefined ||text=="")return ""
        var txt = text;
        var textLength = m_font.textSize(txt).width;
        while (textLength > maxTextLength) {
            if (!txt.substring) break
            txt = txt.substring(0, txt.length - 1);
            textLength = m_font.textSize(txt).width;
        }
        return txt;
    }

    this.drawText = function (text, x, y, alignment, maxTextLength) {
        if (typeof (maxTextLength) !== "undefined")
            text = adjustedText(text, maxTextLength);
        if (typeof (alignment) !== "undefined")
            m_ctx.textAlign = alignment;
        //m_ctx.fillStyle = this.pen().color;
        m_ctx.fillText(text, x, y);
    }

    this.toString = function () {
        return '[Painter: ' + m_ctx + ']'
    }
}



PaintUtil.GraphicPainter = function (graphic) {
    var svgNS = "http://www.w3.org/2000/svg";
    var m_graphic = graphic;
    var m_pen = new Misc.Pen;
    m_pen.style = Static.NoPen;
    var m_brush = new Misc.Brush;

    var m_font = new Misc.Font;


    var elem = null;

    this.setBrush = function (b) {

        m_brush = b
    }

    this.setPen = function (p) {
        m_pen = p
    }

    /*style
      solid
      dash : ctx.setLineDash([10, 5])
      dashDot : ctx.setLineDash([12, 5, 3, 5])
      dashDotDot : ctx.setLineDash([12, 5, 3, 5, 3, 5])
      dot : ctx.setLineDash([2, 8])
    */
    function doSetPen() {
        if (m_pen.style === Static.NoPen)
            elem.attr("stroke", "transparent");
        else
            elem.attr("stroke", m_pen.color);
        elem.attr("stroke-Width", m_pen.width);
        if (m_pen.style === "dash")
            elem.attr("stroke-dasharray", [10, 5]);
        else if (m_pen.style === "dot")
            elem.attr("stroke-dasharray", [3, 8]);
        else if (m_pen.style === "dashDot")
            elem.attr("stroke-dasharray", [12, 5, 3, 5]);
        else if (m_pen.style === "dashDotDot")
            elem.attr("stroke-dasharray", [12, 5, 3, 5, 3, 5]);

        //penStyle = m_pen.style;
    }

    function doSetBrush() {
        if (m_brush.color === Static.NoBrush)
            elem.attr("fill", "transparent");
        else
            elem.attr("fill", m_brush.color);
    }

    this.pen = function () {
        return m_pen;
    }

    this.rotate = function (rotation, x, y) {
        xCenter = x || 0
        yCenter = y || 0
        if (rotation)
            elem.attr("transform",
                " rotate(" + rotation + ' ' + xCenter + ' ' + yCenter + ")"
            );
    }


    this.transform = function (obj) {
        var xTrans = obj.translateX || 0
        var yTrans = obj.translateY || 0
        var xScale = obj.scaleX || 1
        var yScale = obj.scaleY || 1
        var rotation = obj.rotation || 0
        var xCenter = obj.rotationX || 0
        var yCenter = obj.rotationY || 0

        var transformStr = ""
        if (xScale != 1 || yScale != 1)
            transformStr += " scale(" + xScale + ' ' + yScale + ")"
        if (rotation)
            transformStr += " rotate(" + rotation + ' ' + xCenter + ' ' + yCenter + ")"
        if (xTrans != 1 || yTrans != 1)
            transformStr += " translate(" + xTrans + ' ' + yTrans + ")"

        elem.attr("transform", transformStr);


    }

    this.drawRect = function (x, y, w, h) {
        elem = $(document.createElementNS(svgNS, "rect"));
        elem.attr("x", x);
        elem.attr("y", y);
        elem.attr("width", w);
        elem.attr("height", h);

        /*if(rotation)
         elem.attr("transform", 
             " rotate("+rotation+' '+x+' '+y+ ")"
             );*/

        doSetBrush();
        //elem.attr("stroke",m_pen.color);
        //elem.attr("stroke-Width",1);
        doSetPen()
        elem.appendTo($(m_graphic.svg()))
    }

    this.drawPath = function (path) {
        elem = $(document.createElementNS(svgNS, "path"));
        var data = path.data
        var d = "";
        for (var i = 0; i < path.elementCount(); i++) {
            var element = path.elementAt(i);
            var x = element.x + data.xOffset;
            var y = element.y + data.yOffset;

            switch (element.type) {
                case Misc.MoveToElement:
                    {

                        d += 'M' + x + ' ' + y + ' ';
                        break;
                    }
                case Misc.LineToElement:
                    {
                        d += 'L' + x + ' ' + y + ' ';
                        break;
                    }
                case Misc.CurveToElement:
                    {
                        var element1 = path.elementAt(++i);
                        var x1 = element1.x + data.xOffset;
                        var y1 = element1.y + data.yOffset;

                        var element2 = path.elementAt(++i);
                        var x2 = element2.x + data.xOffset;
                        var y2 = element2.y + data.yOffset;

                        d += 'C ' + x + ' ' + y + ' ' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2 + ' ';
                        break;
                    }
                case Misc.CurveToDataElement:
                    {
                        break;
                    }
            }
        }
        elem.attr("d", d);
        elem.attr("transform",
            " scale(" + data.scale + ")" +
            " rotate(" + data.rotation + ' ' + data.xCenter + ' ' + data.yCenter + ")"
        );
        doSetBrush();
        //elem.attr("stroke",m_pen.color);
        //elem.attr("stroke-Width",1);
        doSetPen()
        elem.appendTo($(m_graphic.svg()))
    }

    this.fillRect = function (rect, brush) {
        elem = $(document.createElementNS(svgNS, "rect"));
        elem.attr("x", rect.left);
        elem.attr("y", rect.top);
        elem.attr("width", rect.width);
        elem.attr("height", rect.height);
        elem.attr("fill", brush.color);
        doSetPen();
        elem.appendTo($(m_graphic.svg()))
    }

    /*elem = $(document.createElementNS(svgNS,"rect"));
       elem.attr("x",x);
       elem.attr("y",y);
       elem.attr("width",w);
       elem.attr("height",h);
       doSetBrush();
       elem.attr("stroke",m_pen.color);
       elem.attr("stroke-Width",1);
       elem.appendTo($(m_graphic.svg()))   */

    this.drawCircle = function (x, y, radius) {
        /*elem = $(document.createElementNS(svgNS,"circle"));
        elem.attr("cx",x);
        elem.attr("cy",y);
        elem.attr("r",radius);
        elem.attr("fill","red");
        doSetPen();
        elem.appendTo($(m_graphic.svg()))*/

        elem = $(document.createElementNS(svgNS, "circle"));
        elem.attr("cx", x);
        elem.attr("cy", y);
        elem.attr("r", radius);
        doSetBrush();
        //elem.attr("stroke",m_pen.color);
        //elem.attr("stroke-Width",1);
        doSetPen()
        elem.appendTo($(m_graphic.svg()))

    }

    this.drawLine = function (x1, y1, x2, y2) {
        elem = $(document.createElementNS(svgNS, "line"));
        elem.attr("x1", x1);
        elem.attr("y1", y1);
        elem.attr("x2", x2);
        elem.attr("y2", y2);
        doSetPen();
        elem.appendTo($(m_graphic.svg()))
    }

    this.drawText = function (text, x, y) {
        elem = $(document.createElementNS(svgNS, "text"));
        elem.attr('x', x);
        elem.attr('y', y);
        doSetFont();
        doSetPen();
        doSetBrush();
        elem[0].textContent = text;
        elem.appendTo($(m_graphic.svg()));

    }

    this.textSize = function (text) {
        return m_font.textSize(text);
    }

    this.setFont = function (font) {
        m_font = font;
    }

    this.font = function () {
        return m_font;
    }

    function doSetFont() {
        elem.attr("font-size", m_font.th);
        elem.attr("font-family", m_font.name);
        elem.attr("font-weight", m_font.weight);
        elem.attr("font-style", m_font.style);
    }


    this.toString = function () {
        return '[GraphicPainter]';
    }
}



/**
 * @classdesc Detailed Description
 * 
 * Painter provides highly optimized functions to do most of the drawing GUI programs require. It can draw 
 * everything from simple lines to complex shapes like pies and chords. It can also draw aligned text and pixmaps. Normally, it 
 * draws in a "natural" coordinate system, but it can also do view and world transformation. Painter can operate on any object 
 * that inherits the Widget class.   
 * @constructor  
 * @param {*} param 
 * 
 */
PaintUtil.Painter = function (param) {
    var m_painter = null;
    var m_graphicPainter = false;

    if (param.toString() === '[Graphic]') {
        m_graphicPainter = true;
        m_painter = new PaintUtil.GraphicPainter(param);
    }
    else if (param.toString() === '[object CanvasRenderingContext2D]') {
        m_painter = new PaintUtil.ContextPainter(param);
    }
    else {
        m_painter = new PaintUtil.ContextPainter(param.getContext());
    }

    /**
     * 
     * @returns {boolean} true if painter is a graphic painter and fales otherwise.
     */
    this.isGraphicPainter = function () {
        return m_graphicPainter;
    }

    /**
     * 
     * @param {string} str 
     * @returns {Misc.Size}
     */
    this.textSize = function (str) {
        return m_painter.textSize(str)
    }

    /**
     * 
     * @returns {object}
     */
    this.context = function () {
        if (m_graphicPainter) {
            return;
        }
        return m_painter.context()
    }

    /**
     * 
     * @returns {number}
     */
    this.canvasWidth = function () {
        if (m_graphicPainter)
            return;
        return m_painter.canvasWidth()
    }

    /**
     * 
     * @returns {number}
     */
    this.canvasHeight = function () {
        if (m_graphicPainter)
            return;
        return m_painter.canvasHeight()
    }

    /**
     * Saves the current painter state. A save() must be followed by a corresponding restore(); See also {@link restore restore()}. 
     */
    this.save = function () {
        if (m_graphicPainter)
            return;
        m_painter.save()
    }

    /**
     * Restores the current painter state. 
     */
    this.restore = function () {
        if (m_graphicPainter)
            return;
        m_painter.restore()
    }

    /**
     * 
     * Translates the coordinate system by the vector (x, y).
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    this.translate = function (x, y) {
        if (m_graphicPainter)
            return;
        m_painter.translate(x, y)
    }

    /**
     * 
     * Scales the coordinate system by (x, y)..
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    this.scale = function (x, y) {
        if (m_graphicPainter)
            return;
        m_painter.scale(x, y)
    }

    /**
     * Translates the coordinate system by the vector (x, y) and rotate it clockwise. The given angle parameter is in degrees.
     * @param {number} rot 
     * @param {number} x 
     * @param {number} y 
     * @returns {void}
     */
    this.rotate = function (rot, x, y) {
        //rot *= Math.PI / 180
        if (m_graphicPainter)
            return;
        m_painter.rotate(rot, x, y)
    }

    /**
     * 
     * @param {object} obj 
     * @returns {object} the world transformation matrix.
     */
    this.transform = function (obj) {
        if (obj == undefined) {
            return m_painter.getTransform();
        }
        //rot *= Math.PI / 180
        if (!m_graphicPainter)
            return;
        m_painter.transform(obj)
    }



    /**
     * Sets the painter's pen to be the given pen. The pen defines how to draw lines and outlines, and it also defines the 
     * text color.
     * @param {Misc.Pen} pen 
     */
    this.setPen = function (pen) {
        m_painter.setPen(pen)
    }

    /**
     * 
     * @returns {Misc.Pen} the painter's pen.
     */
    this.pen = function () {
        return m_painter.pen()

    }

    this.setBrush = function (brush) {
        m_painter.setBrush(brush)
    }

    this.brush = function () {
        return m_painter.brush()
    }

    this.setFont = function (font) {
        m_painter.setFont(font)
    }

    this.font = function () {
        return m_painter.font()
    }

    this.fillRect = function (rect, brush) {
        m_painter.fillRect(rect, brush)
    }

    this.drawPath = function (path) {
        //if(m_graphicPainter)
        //return;
        m_painter.drawPath(path)
    }


    this.drawPoint = function (pt) {
        if (m_graphicPainter)
            return;
        m_painter.drawPoint(pt)
    }

    this.drawPoints = function (points) {
        if (m_graphicPainter)
            return;
        m_painter.drawPoints(points)
    }

    this.drawLine = function (param1, param2, param3, param4) {
        m_painter.drawLine(param1, param2, param3, param4)
    }

    //painter.drawImage(image);	
    //painter.drawImage(image, 50, 50);
    //painter.drawImage(image, 50, 50, 20, 20);
    //painter.drawImage(image, new Misc.Rect(10,10, 20, 20));
    //painter.drawImage(image, 10, 10)
    this.drawImage = function (image, param1, param2, param3, param4) {
        m_painter.drawImage(image, param1, param2, param3, param4)
    }

    this.drawPolyline = function (polyline) {
        if (m_graphicPainter)
            return;
        m_painter.drawPolyline(polyline)
    }

    this.drawPolygon = function (polyline) {
        if (m_graphicPainter)
            return;
        m_painter.drawPolygon(polyline)
    }

    this.drawRect = function (x, y, width, height) {
        m_painter.drawRect(x, y, width, height)
    }

    this.drawVerticalText = function (txt, tx, ty, topDown) {
        if (m_graphicPainter)
            return;
        m_painter.drawVerticalText(txt, tx, ty, topDown)
    }

    this.drawRotatedText = function (txt, tx, ty, rotation) {
        if (m_graphicPainter)
            return;
        m_painter.drawRotatedText(txt, tx, ty, rotation)
    }

    this.drawText = function (text, x, y, alignment, maxTextLength) {
        m_painter.drawText(text, x, y, alignment, maxTextLength)
    }

    /**
     * Paints a circle to the canvas using the current brush and pen of the painter.
     * @param {number} x the x position of the center of the circle (positive to the right)
     * @param {number} y the y position of the center of the circle (positive downwards)
     * @param {number} radius radius of the circle
     */
    this.drawCircle = function (x, y, radius) {
        //if(m_graphicPainter)
        //return;
        m_painter.drawCircle(x, y, radius)
    }

    /**
     * Paints an ellipse to the canvas using the current brush and pen of the painter.
     * @param {Misc.Rect} rect The bounding rectangle of the ellipse.
     */
    this.drawEllipse = function (rect) {
        //if(m_graphicPainter)
        //return;
        m_painter.drawEllipse(rect)
    }

    /**
     * 
     * @returns {string} A string representation of the object.
     */
    this.toString = function () {
        return m_painter.toString()
    }

}




