'use strict';
/////////////////ScaleDraw - subclass of AbstractScaleDraw//////////start
// Define the ScaleDraw constructor
//ScaleDraw.inheritsFrom(AbstractScaleDraw);
//function ScaleDraw() {
class ScaleDraw extends AbstractScaleDraw {
    constructor() {
        super();
        const Enum = Enumerator.getDefaultEnumNampespace();
        //AbstractScaleDraw.call(this);
        var m_alignment = ScaleDraw.Alignment.BottomScale;

        /*!
        Return the orientation

        TopScale, BottomScale are horizontal (Qt::Horizontal) scales,
        LeftScale, RightScale are vertical (Qt::Vertical) scales.

        \return Orientation of the scale

        \sa alignment()
         */
        this.orientation = function () {
            if (m_alignment === ScaleDraw.Alignment.TopScale || m_alignment === ScaleDraw.Alignment.BottomScale)
                return Static.Horizontal;
            return Static.Vertical;
        }

        /*!
        Return alignment of the scale
        \sa setAlignment()
        \return Alignment of the scale
         */
        this.alignment = function () {
            return m_alignment;
        }
        /*!
        Set the alignment of the scale

        \param align Alignment of the scale

        The default alignment is QwtScaleDraw::ScaleDraw.Alignment.BottomScale
        \sa alignment()
         */
        this.setAlignment = function (align) {
            m_alignment = align;
        }

        /*!
        \brief Determine the minimum border distance

        This member function returns the minimum space
        needed to draw the mark labels at the scale's endpoints.

        \param font Font
        \param start Start border distance
        \param end End border distance
         */
        this.getBorderDistHint = function (font, startAndEndObj) {
            /*start = 0;
            end = 1.0;

            if ( !hasComponent( QwtAbstractScaleDraw::Labels ) )
            return;

            const QList<double> &ticks = scaleDiv().ticks( ScaleDiv.TickType.MajorTick );
            if ( ticks.count() == 0 )
            return;

            // Find the ticks, that are mapped to the borders.
            // minTick is the tick, that is mapped to the top/left-most position
            // in widget coordinates.

            double minTick = ticks[0];
            double minPos = scaleMap().transform( minTick );
            double maxTick = minTick;
            double maxPos = minPos;

            for ( int i = 1; i < ticks.count(); i++ ){
            const double tickPos = scaleMap().transform( ticks[i] );
            if ( tickPos < minPos ){
            minTick = ticks[i];
            minPos = tickPos;
            }
            if ( tickPos > scaleMap().transform( maxTick ) ){
            maxTick = ticks[i];
            maxPos = tickPos;
            }
            }

            double e = 0.0;
            double s = 0.0;
            if ( orientation() == Qt::Vertical ){
            s = -labelRect( font, minTick ).top();
            s -= qAbs( minPos - qRound( scaleMap().p2() ) );

            e = labelRect( font, maxTick ).bottom();
            e -= qAbs( maxPos - scaleMap().p1() );
            }
            else{
            s = -labelRect( font, minTick ).left();
            s -= qAbs( minPos - scaleMap().p1() );

            e = labelRect( font, maxTick ).right();
            e -= qAbs( maxPos - scaleMap().p2() );
            }

            if ( s < 0.0 )
            s = 0.0;
            if ( e < 0.0 )
            e = 0.0;

            start = qCeil( s );
            end = qCeil( e );*/
        }

        //ScaleDraw.prototype = Object.create(AbstractScaleDraw.prototype);
        //ScaleDraw.prototype.constructor = ScaleDraw;
        //ScaleDraw.prototype.parent = AbstractScaleDraw.prototype;

        this.toString = function () {
            return '[ScaleDraw]';
        }

        /*!
        Draw a tick

        \param painter Painter
        \param value Value of the tick
        \param len Length of the tick

        \sa drawBackbone(), drawLabel()
         */
        this.drawTick = function (painter, value, len) {
            if (len <= 0)
                return;
            var bwAdjust = 0 //this.data.plotBorderWidth-1
                var tval = this.scaleMap().transform(value) + bwAdjust;

            var bb = this.hasComponent(AbstractScaleDraw.ScaleComponent.Backbone);

            switch (this.alignment()) {
            case ScaleDraw.Alignment.LeftScale: {
                    var x1 = painter.canvasWidth();
                    if (bb)
                        x1 -= 2;
                    var x2 = x1 - len;
                    painter.drawLine(x1, tval, x2, tval);
                    break;
                }

            case ScaleDraw.Alignment.RightScale: {
                    var x1 = 0;
                    if (bb)
                        x1 += 2;
                    var x2 = x1 + len;
                    painter.drawLine(x1, tval, x2, tval);
                    break;
                }

            case ScaleDraw.Alignment.BottomScale: {
                    var y1 = 0;
                    if (bb)
                        y1 += 2;
                    var y2 = y1 + len;
                    painter.drawLine(tval, y1, tval, y2);
                    break;
                }

            case ScaleDraw.Alignment.TopScale: {
                    var y1 = painter.canvasHeight();
                    if (bb)
                        y1 -= 2;
                    var y2 = y1 - len;
                    painter.drawLine(tval, y1, tval, y2);
                    break;
                }
            }
        }

        /*!
        Draws the baseline of the scale
        \param painter Painter

        \sa drawTick(), drawLabel()
         */
        this.drawBackbone = function (painter) {
            var off = 0.5 * painter.pen().width;
            var bb = this.hasComponent(AbstractScaleDraw.ScaleComponent.Backbone);

            switch (this.alignment()) {
            case ScaleDraw.Alignment.LeftScale: {
                    var x = painter.canvasWidth() - off;
                    if (bb)
                        x -= 2;
                    painter.drawLine(x, 0, x, painter.canvasHeight());
                    break;
                }
            case ScaleDraw.Alignment.RightScale: {
                    var x = off;
                    if (bb)
                        x += 2;
                    painter.drawLine(x, 0, x, painter.canvasHeight());
                    break;
                }
            case ScaleDraw.Alignment.TopScale: {
                    var y = painter.canvasHeight() - off;
                    if (bb)
                        y -= 2;
                    painter.drawLine(0, y, painter.canvasWidth(), y);
                    break;
                }
            case ScaleDraw.Alignment.BottomScale: {
                    var y = off;
                    if (bb)
                        y += 2;
                    painter.drawLine(0, y, painter.canvasWidth(), y);
                    break;
                }
            }
        }

        /*!
        Find the position, where to paint a label

        The position has a distance that depends on the length of the ticks
        in direction of the alignment().

        \param value Value
        \return Position, where to paint a label
         */
        this.labelPosition = function (ctx, value) {
            ctx.save();
            var tval = this.scaleMap().transform(value);

            var dist = this.spacing();

            if (this.hasComponent(AbstractScaleDraw.ScaleComponent.Backbone))
                dist += 1; //qMax( 1, penWidth() );

            if (this.hasComponent(AbstractScaleDraw.ScaleComponent.Ticks))
                dist += this.tickLength(ScaleDiv.TickType.MajorTick);

            //alert(dist)
            var bwAdjust = 0 //this.data.plotBorderWidth-1

                var px = 0;
            var py = 0;
            var th = ctx.measureText("M").width;

            switch (this.alignment()) {
            case ScaleDraw.Alignment.RightScale: {
                    px = dist;
                    py = tval + 0.5 * th + bwAdjust;
                    break;
                }
            case ScaleDraw.Alignment.LeftScale: {
                    px = ctx.canvas.width - dist;
                    py = tval + 0.5 * th + bwAdjust;
                    break;
                }
            case ScaleDraw.Alignment.BottomScale: {
                    px = tval + bwAdjust;
                    py = dist + th;
                    break;
                }
            case ScaleDraw.Alignment.TopScale: {
                    px = tval + bwAdjust;
                    py = ctx.canvas.height - (dist);
                    break;
                }
            }
            ctx.restore();
            return new Misc.Point(px, py);
        }

        /*!
        Draws the label for a major scale tick

        \param painter Painter
        \param value Value

        \sa drawTick(), drawBackbone(), boundingLabelRect()
         */
        this.drawLabel = function (painter, value) {
            value = Utility.toPrecision(value, this.precision())
                //var limits = this.getNonExponentNotationLimits()
                //if (value > limits.upper || value < limits.lower)
                    //value = parseFloat(value).toExponential(this.decimalPlaces());
                var lbl = this.label(value);
            if (lbl === "")
                return;

            var pos = this.labelPosition(painter.context(), value);
            if (this.orientation() == Static.Horizontal && (pos.x === 0 || pos.x == painter.canvasWidth()))
                return;

            var tsz = painter.textSize(lbl);
            var th = tsz.height;
            if (this.orientation() == Static.Vertical && ((Math.abs(pos.y - 0.5 * th - 0) < th) || (Math.abs(pos.y - 0.5 * th - painter.canvasHeight()) < th)))
                return;

            var alignment = "center";
            var maxTextLength = "undefined";

            
            if (this.alignment() === ScaleDraw.Alignment.LeftScale) {
                alignment = "right";
                maxTextLength = "undefined";
            } else if (this.alignment() === ScaleDraw.Alignment.RightScale) {
                alignment = "left";
                maxTextLength = "undefined";
            } else {
                maxTextLength = painter.canvasWidth() / (this.scaleDiv().ticks(ScaleDiv.TickType.MajorTick).length - 1) - 5;
                var textWidth = tsz.width;
                if (textWidth > maxTextLength)
                    textWidth = maxTextLength;
                if ((pos.x - textWidth / 2) < 0 || (pos.x + textWidth / 2) > painter.canvasWidth()) {
                    return;
                }
            }

            painter.drawText(lbl, pos.x, pos.y, alignment, maxTextLength);

        }

    }
}

Enumerator.enum("Alignment { BottomScale , TopScale , LeftScale , RightScale }", ScaleDraw);