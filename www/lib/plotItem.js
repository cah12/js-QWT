'use strict';
//ItemInterest { ScaleInterest = 0x01 , LegendInterest = 0x02 
/**
 * Plot Item Attributes.
 * 
 * Various aspects of a plot widget depend on the attributes of the attached plot items. If and how a single plot 
 * item participates in these updates depends on its attributes.
 * @typedef {number} PlotItem.ItemAttribute
 */

/**
 * Plot Item Interests. 
 * 
 * Plot items might depend on the situation of the corresponding plot widget. By enabling an interest the plot item 
 * will be notified, when the corresponding attribute of the plot widgets has changed.
 * @typedef {number} PlotItem.ItemInterest
 */

/**
 * Base class for items on the plot canvas.
 * 
 * A plot item is "something", that can be painted on the plot canvas, or only affects the scales of the plot widget. They can be categorized as: 
 * 
 * <dl><dt>Representator<br>A "Representator" is an item that represents some sort of data on the plot canvas. The different representator classes are organized according to the characteristics of the data:
 * <ul><li>QwtPlotMarker Represents a point or a horizontal/vertical coordinate</li>
 * <li>QwtPlotCurve Represents a series of points</li>
 * <li>QwtPlotSpectrogram ( QwtPlotRasterItem ) Represents raster data</li>
 * <li>...</li></ul></dt>
 * <dt><br>Decorators<br>A "Decorator" is an item, that displays additional information, that is not related to any data:
 * <ul><li>QwtPlotGrid</li>
 * <li>QwtPlotScaleItem</li>
 * <li>QwtPlotSvgItem</li>
 * <li>...</li></ul></dt></dl>
 * 
 * Depending on the{@link PlotItem.ItemAttribute}flags, an item is included into autoscaling or has an entry on the legend. 
 * Before misusing the existing item classes it might be better to implement a new type of plot item ( don't implement a 
 * watermark as spectrogram ). Deriving a new type of QwtPlotItem primarily means to implement the YourPlotItem::draw() method.
 * 
 */
class PlotItem {
    /**
     * @property {} <br><h5><b>PlotItem_Attributes(Enum)</b></h5>    <br>Various aspects of a plot widget depend on the attributes of the attached plot items. If and how a single plot item participates in these updates depends on its attributes.
     * @property {PlotItem.ItemAttribute} Legend=0x01                    The item is represented on the legend.
     * @property {PlotItem.ItemAttribute} AutoScale=0x02                 The boundingRect() of the item is included in the autoscaling calculation as long as its width or height is >= 0.0.
     * @property {PlotItem.ItemAttribute} Margins=0x04                   The item needs extra space to display something outside its bounding rectangle.
     * @property {} <br><h5><b>PlotItem_Interests(Enum)</b></h5>    <br>Plot items might depend on the situation of the corresponding plot widget. By enabling an interest the plot item will be notified, when the corresponding attribute of the plot widgets has changed
     * @property {PlotItem.ItemInterest} ScaleInterest=0x01                    The item is interested in updates of the scales
     * @property {PlotItem.ItemInterest} LegendInterest=0x02                 The item is interested in updates of the legend ( of other items ) This flag is intended for items, that want to implement a legend for displaying entries of other plot item.
     */
    constructor(tle) {
        
        var self = this;
        this.plotId = "";
        var _context = null;
        var _plot = null;
        var cnvs = null;
        var d_interests

        var m_domDiv = $("#centralDiv");

        var m_isVisible = true;
        var m_attributes = 0x0;
        //interests( 0 ),
        //renderHints( 0 ),
        //renderThreadCount( 1 ),
        var m_z = 0.0;
        var m_xAxis = Axis.AxisId.xBottom;
        var m_yAxis = Axis.AxisId.yLeft;
        var m_title = tle || "";

        this.rtti = PlotItem.RttiValues.Rtti_PlotItem;

        var m_legendIconSize = new Misc.Size(10, 10);

        this.getLegendIconSize = function () {
            return m_legendIconSize;
        }

        /*!
        Set the size of the legend icon

        The default setting is 8x8 pixels

        \param size Size
        \sa legendIconSize(), legendIcon()
         */
        this.setLegendIconSize = function (size) {
            //if ( (m_legendIconSize.width != size.width) &&  (m_legendIconSize.height != size.height))
            {
                m_legendIconSize = size;
                //legendChanged();
                if (_plot)
                    _plot.updateLegend(this)
            }
        }

        //if (typeof(tle) !== 'undefined')
        //m_title = tle;

        /*!
        Toggle an item interest

        \param interest Interest type
        \param on true/false

        \sa testItemInterest(), ItemAttribute
         */
        this.setItemInterest = function (interest, on) {
            //if ( d_interests.testFlag( interest ) != on )
            {
                if (on)
                    d_interests |= interest;
                else
                    d_interests &= ~interest;

                this.itemChanged();
            }
        }

        /*!
        Test an item interest

        \param interest Interest type
        \return true/false
        \sa setItemInterest(), ItemAttribute
         */
        this.testItemInterest = function (interest) {
            //return d_interests.testFlag( interest );
            return d_interests & interest;
        }

        this.plot = function () {
            return _plot;
        }

        this.title = function () {
            return m_title;
        }

        this.setTitle = function (tle) {
            if (m_title !== tle) {
                m_title = tle;
                this.legendChanged();
                this.itemChanged()
                Static.trigger("titleChange", [this, tle]);
            }
            /*if(_plot)
            _plot.updateLegend(this)*/
        }

        //this.setBorderRadius = function(radius){
        //cnvs.css("border-radius", radius)
        //}

        this.clearCanvas = function () {
            this.getContext().clearRect(0, 0, cnvs[0].width, cnvs[0].height);
        }

        this.attach = function (plot) {
            if (plot == _plot) { //Cannot attach the same plot more than once
                return;
            }

            if (_plot) {//item already attach to a plot. detach before proceeding
                //_plot.attachItem(this, false);
                this.getContext().clearRect(0, 0, cnvs[0].width, cnvs[0].height);
                cnvs.hide()
                cnvs = null
                //console.log("canvas destroyed")
                _plot.attachItem(this, false);

            }

            //arument == null. detach
            /* if(plot == null){
                _plot.attachItem(this, false);
            } */

            _plot = plot;

            if (_plot) {

                if (cnvs === null) {

                    cnvs = $('<canvas />').attr({
                        style: "position: absolute; background-color: transparent"
                    });
                    //console.log("canvas created")
                    _plot.getLayout().getCentralDiv().append(cnvs);
                    cnvs.css({
                        "border-radius": "inherit"
                    });

                    if (m_z != 0) {
                        cnvs.css("zIndex", m_z);
                    }
                    //var cw = _plot.getCentralWidget()
                    // var radius = parseInt(_plot.getLayout().getCentralDiv().css("border-radius"))
                    //console.log(_plot.borderRadius())
                    //console.log(plot.borderRadius())
                    //cnvs.css("border-radius", 25)
                    // 	//parseInt(plotCanvas.css("border-radius")))

                }
                _plot.attachItem(this, true);
            }

        }

        /*!
        \brief This method detaches a QwtPlotItem from any
        QwtPlot it has been associated with.

        detach() is equivalent to calling attach( NULL )
        \sa attach()
         */
        this.detach = function () {
            this.attach(null);
        }

        this.setZ = function (z) {
            if (m_z !== z) {
                m_z = z;
                if (cnvs) {
                    cnvs.css("zIndex", m_z)
                }
                this.itemChanged()
            }
        }

        this.getZ = function (z) {
            return m_z
        }

        this.getCanvas = function () {
            return cnvs;
        }

        this.syncSizes = function () {
            var cd = _plot.getLayout().getCentralDiv()
            //var bw = parseInt(_plot.getPlotCanvas().css("border-width"))
            //console.log(bw)
            cnvs[0].width = parseFloat(cd.css("width"));
            cnvs[0].height = parseFloat(cd.css("height"));
        }

        this.getContext = function () {
            this.syncSizes();
            return cnvs[0].getContext("2d");
        };
        /*!
        Set X and Y axis

        The item will painted according to the coordinates of its Axes.

        \param xAxis X Axis ( QwtPlot::Axis.AxisId.xBottom or QwtPlot::Axis.AxisId.xTop )
        \param yAxis Y Axis ( QwtPlot::yLeft or QwtPlot::yRight )

        \sa setXAxis(), setYAxis(), xAxis(), yAxis(), QwtPlot::Axis
         */
        this._setAxes = function (xAxis, yAxis) {
            if (xAxis == Axis.AxisId.xBottom || xAxis == Axis.AxisId.xTop)
                m_xAxis = xAxis;

            if (yAxis == Axis.AxisId.yLeft || yAxis == Axis.AxisId.yRight)
                m_yAxis = yAxis;

            this.itemChanged();
        }

        /*!
        Toggle an item attribute

        \param attribute Attribute type
        \param on true/false

        \sa testItemAttribute(), ItemInterest
         */
        this.setItemAttribute = function (attribute, on) {
            if (on)
                m_attributes |= attribute;
            else
                m_attributes &= ~attribute;
            if (attribute == PlotItem.ItemAttribute.Legend)
                this.legendChanged();

            this.itemChanged();

        }

        /*!
        Test an item attribute

        \param attribute Attribute type
        \return true/false
        \sa setItemAttribute(), ItemInterest
         */
        this.testItemAttribute = function (attribute) {
            return m_attributes & attribute;
        }

        //! Show the item
        this.show = function () {
            this.setVisible(true);
        }

        //! Hide the item
        this.hide = function () {
            this.setVisible(false);
        }

        // /*!
        // Show/Hide the item

        // \param on Show if true, otherwise hide
        // \sa isVisible(), show(), hide()
        // */
        this.doSetVisible = function (on) {
            if (on !== m_isVisible) {
                m_isVisible = on;
                if (!on)
                    cnvs.hide();
                else
                    cnvs.show();
                this.itemChanged();
                Static.trigger("visibilityChange", [this, on])
            }
        }

        /*!
        \return true if visible
        \sa setVisible(), show(), hide()
         */
        this.isVisible = function () {
            return m_isVisible;
        }

        /*!
        Update the legend and call QwtPlot::autoRefresh() for the
        parent plot.

        \sa QwtPlot::legendChanged(), QwtPlot::autoRefresh()
         */
        this.itemChanged = function () {
            if (_plot)
                _plot.autoRefresh();
        }

        /*!
        Update the legend of the parent plot.
        \sa QwtPlot::updateLegend(), itemChanged()
         */
        this.legendChanged = function () {
            if (this.testItemAttribute(PlotItem.ItemAttribute.Legend) && _plot)
                _plot.updateLegend(this);
        }

        /*!
        Set the X axis

        The item will painted according to the coordinates its Axes.

        \param axis X Axis ( QwtPlot::Axis.AxisId.xBottom or QwtPlot::Axis.AxisId.xTop )
        \sa setAxes(), setYAxis(), xAxis(), QwtPlot::Axis
         */
        this._setXAxis = function (axis) {
            if (axis == Axis.AxisId.xBottom || axis == Axis.AxisId.xTop) {
                m_xAxis = axis;
                this.itemChanged();
            }
            /*if(_plot)
            _plot.autoRefresh()*/
        }

        /*!
        Set the Y axis

        The item will painted according to the coordinates its Axes.

        \param axis Y Axis ( QwtPlot::yLeft or QwtPlot::Axis.AxisId.yRight )
        \sa setAxes(), setXAxis(), yAxis(), QwtPlot::Axis
         */
        this._setYAxis = function (axis) {
            if (axis == Axis.AxisId.yLeft || axis == Axis.AxisId.yRight) {
                m_yAxis = axis;
                this.itemChanged();
            }

        }

        //! Return xAxis
        this.xAxis = function () {
            return m_xAxis;
        }

        //! Return yAxis
        this.yAxis = function () {
            return m_yAxis;
        }

        this.getCanvasRect = function () {
            this.syncSizes();
            return new Misc.Rect(new Misc.Point(), cnvs[0].width, cnvs[0].height);
        }



        /* this.draw = function (xMap, yMap) {
            //console.log("No drawing mehod define in subclass");
        }; */

        /*!
        \return Legend icon size
        \sa setLegendIconSize(), legendIcon()
         */
        this.legendIconSize = function () {
            return this.getLegendIconSize();
        }

        /*!
        \return Icon representing the item on the legend

        The default implementation returns an invalid icon

        \param index Index of the legend entry
        ( usually there is only one )
        \param size Icon size

        \sa setLegendIconSize(), legendData()
         */
        this.legendIcon = function (index, size) {
            return null;
        }

        /*!
        \brief Return a default icon from a brush

        The default icon is a filled rectangle used
        in several derived classes as legendIcon().

        \param brush Fill brush
        \param size Icon size

        \return A filled rectangle
         */
        this.defaultIcon = function (brush, size) {
            var icon = null;
            if (size.width > 0 && size.height > 0) {
                //icon.setDefaultSize( size );

                var r = new Misc.Rect(0, 0, size.width, size.height);
                icon = new GraphicUtil.Graphic(null, size.width + 1, size.height + 1)
                var painter = new GraphicPainter(icon);
                painter.fillRect(r, brush);
            }

            return icon;
        }

        /*!
        \brief Return all information, that is needed to represent
        the item on the legend

        Most items are represented by one entry on the legend
        showing an icon and a text, but f.e. QwtPlotMultiBarChart
        displays one entry for each bar.

        QwtLegendData is basically a list of QVariants that makes it
        possible to overload and reimplement legendData() to
        return almost any type of information, that is understood
        by the receiver that acts as the legend.

        The default implementation returns one entry with
        the title() of the item and the legendIcon().

        \return Data, that is needed to represent the item on the legend
        \sa title(), legendIcon(), QwtLegend, QwtPlotLegendItem
         */
        this.legendData = function () {
            var data = new LegendData;

            var titleValue = this.title();

            //QVariant titleValue;
            //qVariantSetValue( titleValue, label );
            data.setValue(LegendData.Role.TitleRole, titleValue);
            //alert(this.legendIconSize())
            var iconValue = this.legendIcon(0, this.legendIconSize());
            if (iconValue) {
                //QVariant iconValue;
                //qVariantSetValue( iconValue, graphic );
                data.setValue(LegendData.Role.IconRole, iconValue);
            }

            //var list =[];
            //list.push(data);
            return [data];
        };

        this.toString = function () {
            return '[PlotItem "' + this.plotId + '"]';
        }

    }
    /*!
        \return An invalid bounding rect: QRectF(1.0, 1.0, -2.0, -2.0)
        \note A width or height < 0.0 is ignored by the autoscaler
         */
    boundingRect() {
        return new Misc.Rect()//1.0, 1.0, -2.0, -2.0); //{ left:1.0, top:1.0, right:-2.0, bottom:-2.0 , width:-3.0, height: -3.0}; // invalid
    }

    // /*!
    // Show/Hide the item

    // \param on Show if true, otherwise hide
    // \sa isVisible(), show(), hide()
    // */
    setVisible(on) {
        this.doSetVisible(on);
        /* if ( on !== m_isVisible) {
            m_isVisible = on;
            if (!on)
                cnvs.hide();
            else
                cnvs.show();
            this.itemChanged();
            Static.trigger("visibilityChange", [this, on])
        } */
    }

    /*!
   Set the X axis

   The item will painted according to the coordinates its Axes.

   \param axis X Axis ( QwtPlot::Axis.AxisId.xBottom or QwtPlot::Axis.AxisId.xTop )
   \sa setAxes(), setYAxis(), xAxis(), QwtPlot::Axis
    */
    setXAxis(axis) {
        this._setXAxis(axis)
    }

    /*!
    Set the Y axis

    The item will painted according to the coordinates its Axes.

    \param axis Y Axis ( QwtPlot::yLeft or QwtPlot::Axis.AxisId.yRight )
    \sa setAxes(), setXAxis(), yAxis(), QwtPlot::Axis
     */
    setYAxis(axis) {
        this._setYAxis(axis)
    }

    /*!
    Set X and Y axis

    The item will painted according to the coordinates of its Axes.

    \param xAxis X Axis ( QwtPlot::Axis.AxisId.xBottom or QwtPlot::Axis.AxisId.xTop )
    \param yAxis Y Axis ( QwtPlot::yLeft or QwtPlot::Axis.AxisId.yRight )

    \sa setXAxis(), setYAxis(), xAxis(), yAxis(), QwtPlot::Axis
     */
    setAxes(xAxis, yAxis) {
        this._setAxes(xAxis, yAxis)
    }

    draw(xMap, yMap) {
        console.log("No drawing mehod define in subclass");
    }

}
Enumerator.enum("RttiValues {\
    Rtti_PlotItem = 0 , Rtti_PlotGrid , Rtti_PlotScale , Rtti_PlotLegend ,\
    Rtti_PlotMarker , Rtti_PlotCurve , Rtti_PlotSpectroCurve , Rtti_PlotIntervalCurve ,\
    Rtti_PlotHistogram , Rtti_PlotSpectrogram , Rtti_PlotGraphic , Rtti_PlotTradingCurve ,\
    Rtti_PlotBarChart , Rtti_PlotMultiBarChart , Rtti_PlotShape , Rtti_PlotTextLabel ,\
    Rtti_PlotZone , Rtti_PlotVectorField , Rtti_PlotUserItem = 1000\
  }", PlotItem);

Enumerator.enum("ItemAttribute { Legend = 0x01 , AutoScale = 0x02 , Margins = 0x04 }", PlotItem);

Enumerator.enum("ItemInterest { ScaleInterest = 0x01 , LegendInterest = 0x02 }",  PlotItem);
