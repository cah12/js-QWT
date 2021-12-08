'use strict';

class AxisData {
	constructor(){
		this.axisName = "";
		this.isEnabled = false;
		this.doAutoScale = true;
		this.minValue; // = -1000.0;
		this.maxValue; // = 1000.0;
		this.stepSize; // = 0;
		this.maxMajor; // = 10;
		this.maxMinor; // = 100;
		this.isValid = true;
		this.scaleDiv = null;
		this.scaleEngine = null;
		this.scaleWidget = null;
		this.scaleDomDiv = null;
		this.canvas = null;
	}

    toString() {
        return '[AxisData]';
    };
}

class Plot {
    constructor(_plotDiv, pTitle) {
        var plotDiv
        if (!_plotDiv) {
            plotDiv = $("#plotDiv")
        } else {
            plotDiv = _plotDiv
        }

        var self = this; //'self' is used in place of 'this' in callbacks
        var m_plotItemStore = [];
        var d_axisData = [];

        // var m_plotCanvas = 0

        var m_sidebarVisible = false;

        var _title = "";
        var m_footer = "";
        var legendEnable = false;
        var m_cursor = ""
            var m_defaultCursor = "";

        var m_autoReplot = false;
        var m_legend = null;

        var m_legendFont = new Misc.Font;

        this.zoomer = null; //stores zoomer known to the plot
        this.panner = null; //stores panner known to the plot

        this.isSidebarVisible = function () {
            return m_sidebarVisible;
        }

        /* this.setSidebarVisibility = function(on){
        m_sidebarVisible = on;
        } */

        Static.bind("showSidebar", function (e, on) {
            //self.setSidebarVisibility(on)
            m_sidebarVisible = on;
        })

        this.setLegendFont = function (font) {
            m_legendFont = font;
        }

        this.legendFont = function () {
            return m_legendFont;
        }

        //! Replots the plot if autoReplot() is \c true.
        this.autoRefresh = function () {
            if (m_autoReplot) {
                this.replot();
                //this.updateLayout
            }
        }

        /*!
        \brief Set or reset the autoReplot option

        If the autoReplot option is set, the plot will be
        updated implicitly by manipulating member functions.
        Since this may be time-consuming, it is recommended
        to leave this option switched off and call replot()
        explicitly if necessary.

        The autoReplot option is set to false by default, which
        means that the user has to call replot() in order to make
        changes visible.
        \param tf \c true or \c false. Defaults to \c true.
        \sa replot()
         */
        this.setAutoReplot = function (tf) {
            m_autoReplot = tf;
        }

        /*!
        \return true if the autoReplot option is set.
        \sa setAutoReplot()
         */
        this.autoReplot = function () {
            return m_autoReplot;
        }

        this.plotItemStore = function () {
            return m_plotItemStore;
        }

        var m_titleFont = new Misc.Font(12);

        var m_footerFont = new Misc.Font(12);

        var layout = new Layout(plotDiv, this);
        this.getLayout = function () {
            return layout;
        }

        /*!
        \brief Return the current interval of the specified axis

        This is only a convenience function for axisScaleDiv( axisId )->interval();

        \param axisId Axis index
        \return Scale interval

        \sa QwtScaleDiv, axisScaleDiv()
         */
        this.axisInterval = function (axisId) {
            if (!this.axisValid(axisId))
                return new Interval();

            return d_axisData[axisId].scaleDiv.interval();
        }

        this.setAxisDecimalPlaces = function (axisId, places) {
            if (!this.axisValid(axisId))
                return;
            this.axisScaleDraw(axisId).setDecimalPlaces(places);

            this.autoRefresh();
        }

        this.setNonExponentNotationLimits = function (lower, upper) {
            for (var axisId = 0; axisId < axisCnt; ++axisId) {
                this.axisScaleDraw(axisId).setNonExponentLimits(lower, upper);
            }
            this.autoRefresh();
        }

        this.axisDecimalPlaces = function (axisId) {
            if (!this.axisValid(axisId))
                return 3;

            return this.axisScaleDraw(axisId).decimalPlaces();
        }

        var centralWidget = new Widget(layout.getCentralDiv())
            var titleWidget = new Widget(layout.getTitleDiv())
            var footerWidget = new Widget(layout.getFooterDiv())

            centralWidget.plot = this;

        this.getCentralWidget = function () {
            return centralWidget;
        }

        this.getTitleWidget = function () {
            return titleWidget;
        }

        this.getFooterWidget = function () {
            return footerWidget;
        }

        //! Initialize axes
        this.initAxesData = function () {
            var axisId;

            for (axisId = 0; axisId < axisCnt; axisId++)
                d_axisData[axisId] = new AxisData();

            d_axisData[yLeft].axisName = "AxisYLeft";
            d_axisData[yRight].axisName = "AxisYRight";
            d_axisData[xTop].axisName = "AxisXTop";
            d_axisData[xBottom].axisName = "AxisXBottom";

            /* d_axisData[yLeft].scaleDomDiv = layout.getScaleDivElement(yLeft);
            d_axisData[yRight].scaleDomDiv = layout.getScaleDivElement(yRight);
            d_axisData[xTop].scaleDomDiv = layout.getScaleDivElement(xTop);
            d_axisData[xBottom].scaleDomDiv = layout.getScaleDivElement(xBottom); */

            d_axisData[yLeft].scaleWidget = new ScaleWidget(this, layout.getScaleDivElement(yLeft), LeftScale);
            d_axisData[yRight].scaleWidget = new ScaleWidget(this, layout.getScaleDivElement(yRight), RightScale);
            d_axisData[xTop].scaleWidget = new ScaleWidget(this, layout.getScaleDivElement(xTop), TopScale);
            d_axisData[xBottom].scaleWidget = new ScaleWidget(this, layout.getScaleDivElement(xBottom), BottomScale);

            //#if 1
            // better find the font sizes from the application font
            //QFont fscl( fontInfo().family(), 10 );
            //QFont fttl( fontInfo().family(), 12, QFont::Bold );
            //#endif

            for (axisId = 0; axisId < axisCnt; axisId++) {
                var d = d_axisData[axisId];

                d.scaleEngine = new LinearScaleEngine();
                d.scaleWidget.setTransformation(d.scaleEngine.transformation());

                //d.scaleWidget->setFont( fscl );
                //d.scaleWidget->setMargin( 2 );

                //QwtText text = d.scaleWidget->title();
                //text.setFont( fttl );
                //d.scaleWidget->setTitle( text );

                d.doAutoScale = true;
                d.minValue = 0.0;
                d.maxValue = 1000.0;
                d.stepSize = 0.0;
                d.maxMinor = 5;
                d.maxMajor = 8;
                d.isValid = false;
            }
            d_axisData[yLeft].isEnabled = true;
            d_axisData[yRight].isEnabled = true;
            d_axisData[xBottom].isEnabled = true;
            d_axisData[xTop].isEnabled = true;

        }

        this.axisMaxMinor = function (axisId) {
            if (this.axisValid(axisId))
                return d_axisData[axisId].maxMinor;
            return 0;
        }

        this.axisMaxMajor = function (axisId) {
            if (this.axisValid(axisId))
                return d_axisData[axisId].maxMajor;
            return 0;
        }

        ////////////////////////////////
        /*!
        Set the maximum number of minor scale intervals for a specified axis

        \param axisId Axis index
        \param maxMinor Maximum number of minor steps

        \sa axisMaxMinor()
         */
        this.setAxisMaxMinor = function (axisId, maxMinor) {
            if (this.axisValid(axisId)) {
                var maxMinor = Static.qBound(0, maxMinor, 100);

                var d = d_axisData[axisId];
                if (maxMinor != d.maxMinor) {
                    d.maxMinor = maxMinor;
                    d.isValid = false;
                    this.autoRefresh();
                }
            }
        }

        /*!
        Set the maximum number of major scale intervals for a specified axis

        \param axisId Axis index
        \param maxMajor Maximum number of major steps

        \sa axisMaxMajor()
         */
        this.setAxisMaxMajor = function (axisId, maxMajor) {
            if (this.axisValid(axisId)) {
                var maxMajor = Static.qBound(1, maxMajor, 10000);

                var d = d_axisData[axisId];
                if (maxMajor != d.maxMajor) {
                    d.maxMajor = maxMajor;
                    d.isValid = false;
                    this.autoRefresh();
                }
            }
        }

        ////////////////////////////////


        /*!
        \return \c true if the specified axis exists, otherwise \c false
        \param axisId axis index
         */
        this.axisValid = function (axisId) {
            return ((axisId >= yLeft) && (axisId < axisCnt));
        }
        /*!
        Change the scale engine for an axis

        \param axisId Axis index
        \param scaleEngine Scale engine

        \sa axisScaleEngine()
         */
        this.setAxisScaleEngine = function (axisId, engine) {
            if (this.axisValid(axisId) && engine !== null) {

                var d = d_axisData[axisId];
                //alert(d.scaleEngine)

                d.scaleEngine = engine;
                //alert(d.scaleEngine)

                d_axisData[axisId].scaleWidget.setTransformation(engine.transformation());
                //alert(d_axisData[axisId].scaleWidget.scaleDraw().scaleMap().transformation())


                d.isValid = false;

                this.autoRefresh();

            }
        }

        /*!
        \return the plot's legend
        \sa insertLegend()
         */
        this.legend = function () {
            return m_legend;
        }

        this.insertLegend = function (legend) {
            m_legend = legend;
            m_legend.setLegendDiv(layout.getLegendDiv());
            m_legend.setPlot(this);
            //We add any items attached to the plot before insertLegend was called.
            for (var i = 0; i < m_plotItemStore.length; ++i) {
                this.insertLegendItem(m_plotItemStore[i]);
            }
        }

        /*if the legend is not enabled, it is enabled when an item is added.*/
        this.insertLegendItem = function (plotItem, rowNumber) {
            if (m_legend === null || plotItem == null)
                return;
            if (plotItem.testItemAttribute(Legend)) {
                m_legend.addItem(plotItem, rowNumber);
            }
            if (!m_legend.isEmpty()) {
                //legendEnable = true;
                if (legendEnable) {
                    layout.getLegendDiv().show();
                }
            }
            //this.enableLegend(true);
        }

        /*if the legend is enabled, it is disabled when the last item is removed.*/
        this.removeLegendItem = function (plotItem) {
            if (m_legend === null)
                return;
            //var row = m_legend.rowNumberFromName(plotItem.title());
            //if(row >=0){
            var rowNumber = m_legend.removeItem(plotItem);
            if (m_legend.isEmpty()) {
                //legendEnable = false;
                layout.getLegendDiv().hide();

            }
            //this.enableLegend(legendEnable);
            // }
            return rowNumber
        }

        /*!
        Emit legendDataChanged() for a plot item

        \param plotItem Plot item
        \sa QwtPlotItem::legendData(), legendDataChanged()
         */
        this.updateLegend = function (plotItem) {
            if (plotItem == null)
                return;

            if (plotItem.testItemAttribute(Legend)) {
                //reinsert legend item
                var rowNumber = this.removeLegendItem(plotItem)
                    this.insertLegendItem(plotItem, rowNumber)
            }

        }

        /*!
        \param axisId Axis index
        \return Scale engine for a specific axis
         */
        this.axisScaleEngine = function (axisId) {
            if (this.axisValid(axisId))
                return d_axisData[axisId].scaleEngine;
            else
                return null;
        }
        /*!
        \brief Enable autoscaling for a specified axis

        This member function is used to switch back to autoscaling mode
        after a fixed scale has been set. Autoscaling is enabled by default.

        \param axisId Axis index
        \param on On/Off
        \sa setAxisScale(), setAxisScaleDiv(), updateAxes()

        \note The autoscaling flag has no effect until updateAxes() is executed
        ( called by replot() ).
         */
        this.setAxisAutoScale = function (axisId, on) {
            if (this.axisValid(axisId) && (d_axisData[axisId].doAutoScale !== on)) {
                d_axisData[axisId].doAutoScale = on;
                //Static.trigger("rescaled")
                this.autoRefresh();
            }
        }
        /*!
        \return \c True, if autoscaling is enabled
        \param axisId Axis index
         */
        this.axisAutoScale = function (axisId) {
            if (this.axisValid(axisId))
                return d_axisData[axisId].doAutoScale;
            else
                return false;
        }

        /*!
        \brief Disable autoscaling and specify a fixed scale for a selected axis.

        In updateAxes() the scale engine calculates a scale division from the
        specified parameters, that will be assigned to the scale widget. So
        updates of the scale widget usually happen delayed with the next replot.

        \param axisId Axis index
        \param min Minimum of the scale
        \param max Maximum of the scale
        \param stepSize Major step size. If <code>step == 0</code>, the step size is
        calculated automatically using the maxMajor setting.

        \sa setAxisMaxMajor(), setAxisAutoScale(), axisStepSize(), QwtScaleEngine::divideScale()
         */
        this.setAxisScale = function (axisId, min, max, stepSize) {
            var step = 0;
            if (typeof(stepSize) !== "undefined")
                step = stepSize;
            if (this.axisValid(axisId)) {
                var d = d_axisData[axisId];
                d.doAutoScale = false;
                d.isValid = false;
                d.minValue = min;
                d.maxValue = max;
                d.stepSize = step;
                Static.trigger("rescaled");
                this.autoRefresh();
            }
        }

        /*!
        \brief Enable or disable a specified axis

        When an axis is disabled, this only means that it is not
        visible on the screen. Curves, markers and can be attached
        to disabled axes, and transformation of screen coordinates
        into values works as normal.

        Only xBottom and yLeft are enabled by default.

        \param axisId Axis index
        \param tf \c true (enabled) or \c false (disabled)
         */
        this.enableAxis = function (axisId, tf) {
            if (this.axisValid(axisId) && tf !== d_axisData[axisId].isEnabled) {
                d_axisData[axisId].isEnabled = tf;
                if (tf)
                    d_axisData[axisId].scaleWidget.show();
                else
                    d_axisData[axisId].scaleWidget.hide();
                this.autoRefresh();
            }
        }
        /*!
        \return \c True, if a specified axis is enabled
        \param axisId Axis index
         */
        this.axisEnabled = function (axisId) {
            //alert("hhh")
            if (this.axisValid(axisId))
                return d_axisData[axisId].isEnabled;
            else
                return false;
        }

        /*!
        \brief Change the title of a specified axis

        \param axisId Axis index
        \param title Axis title
         */
        this.setAxisTitle = function (axisId, title) {
            if (this.axisValid(axisId)) {
                d_axisData[axisId].scaleWidget.setTitle(title);
                this.autoRefresh();
            }
        }
        /*!
        \return Title of a specified axis
        \param axisId Axis index
         */
        this.axisTitle = function (axisId) {
            if (this.axisValid(axisId))
                return d_axisData[axisId].scaleWidget.title();
            else
                return "";
        }

        /*!
        \brief Return the scale division of a specified axis

        axisScaleDiv(axisId).lowerBound(), axisScaleDiv(axisId).upperBound()
        are the current limits of the axis scale.

        \param axisId Axis index
        \return Scale division

        \sa QwtScaleDiv, setAxisScaleDiv(), QwtScaleEngine::divideScale()
         */
        this.axisScaleDiv = function (axisId) {
            return d_axisData[axisId].scaleDiv;
        }
        /*!
        \brief Disable autoscaling and specify a fixed scale for a selected axis.

        The scale division will be stored locally only until the next call
        of updateAxes(). So updates of the scale widget usually happen delayed with
        the next replot.

        \param axisId Axis index
        \param scaleDiv Scale division

        \sa setAxisScale(), setAxisAutoScale()
         */
        this.setAxisScaleDiv = function (axisId, scaleDiv) {
            if (this.axisValid(axisId)) {
                d = d_axisData[axisId];
                d.doAutoScale = false;
                d.scaleDiv = scaleDiv;
                d.isValid = true;
                this.autoRefresh();
            }
        }
        /*!
        \brief Return the scale draw of a specified axis

        \param axisId Axis index
        \return Specified scaleDraw for axis, or NULL if axis is invalid.
         */
        this.axisScaleDraw = function (axisId) {
            if (!this.axisValid(axisId))
                return null;
            return this.axisWidget(axisId).scaleDraw();
        }

        /*!
        \brief Change the font of an axis

        \param axisId Axis index
        \param font Font
        \warning This function changes the font of the tick labels,
        not of the axis title.
         */
        this.setAxisLabelFont = function (axisId, fontObj) {
            if (this.axisValid(axisId)) {
                this.axisWidget(axisId).setLabelFont(fontObj);
                this.autoRefresh();
            }
        }

        this.axisLabelFont = function (axisId) {
            if (this.axisValid(axisId))
                return this.axisWidget(axisId).labelFont();
            return null;
        }

        this.setAxisTitleFont = function (axisId, fontObj) {
            if (this.axisValid(axisId)) {
                this.axisWidget(axisId).setTitleFont(fontObj);
                this.autoRefresh();
            }
        }

        this.axisTitleFont = function (axisId) {
            if (this.axisValid(axisId))
                return this.axisWidget(axisId).titleFont();
            return null;
        }

        this.initAxesData();

        this.isCursorSet = function () {
            return m_cursor !== "";
        }

        this.cursor = function (cursor) {
            return m_cursor;
        }

        this.setCursor = function (cursor) {
            if (cursor == m_cursor)
                return;
            m_cursor = cursor;
            layout.getCentralDiv().css("cursor", m_cursor)
        }

        this.setDefaultCursor = function (cursor) {
            if (m_defaultCursor == cursor)
                return;
            m_defaultCursor = cursor;
        }

        this.unsetCursor = function () {
            if (m_defaultCursor == m_cursor)
                return;
            m_cursor = m_defaultCursor;
            layout.getCentralDiv[0].style.cursor = m_cursor;
        }

        this.title = function () {
            return _title;
        }

        this.hideTitle = function () {
            if (_title == "")
                return
                layout.getTitleDiv().hide();
            layout.updateLayout();
            this.autoRefresh();
        }

        this.showTitle = function () {
            if (_title == "")
                return
                layout.getTitleDiv().show();
            layout.updateLayout();
            this.autoRefresh();
        }

        this.setTitle = function (ttl) {
            if (_title !== ttl) {
                _title = ttl;

                if (ttl.trim(" ").length == 0)
                    _title = "";

                if (_title !== "") {
                    layout.getTitleDiv().show(); //ensure the div is visible
                    Static.trigger("titleAdded", true)
                } else {
                    layout.getTitleDiv().hide();
                    Static.trigger("titleAdded", false)
                }
                layout.updateLayout();
                this.autoRefresh();
                //console.log("setTitle called")
            }
        }

        //this.setTitle("")
        this.setTitleFont = function (fontObj) {
            if (fontObj.th < 0 || fontObj.name === "" || fontObj.style === "")
                return;
            m_titleFont = fontObj;
            layout.adjustLayout(layout.getTitleDiv(), fontObj.th * 2);
            this.autoRefresh();
        }
        this.setTitleFont(new Misc.Font(20, "Arial", "normal", "bold"))

        this.titleFont = function () {
            return m_titleFont;
        }

        this.footer = function () {
            return m_footer;
        }

        this.hideFooter = function () {
            if (m_footer == "")
                return
                layout.getFooterDiv().hide();
            layout.updateLayout();
            this.autoRefresh();
        }

        this.showFooter = function () {
            if (m_footer == "")
                return
                layout.getFooterDiv().show();
            layout.updateLayout();
            this.autoRefresh();
        }

        this.setFooter = function (ftr) {
            if (m_footer !== ftr) {
                m_footer = ftr;
                if (m_footer !== "") {
                    layout.getFooterDiv().show(); //ensure the div is visible
                    Static.trigger("footerAdded", true)
                } else {
                    layout.getFooterDiv().hide();
                    Static.trigger("footerAdded", false)
                }
                layout.updateLayout();
                this.autoRefresh();
            }
        }

        this.setFooterFont = function (fontObj) {
            if (fontObj.th < 0 || fontObj.name === "" || fontObj.style === "")
                return;
            m_footerFont = fontObj;
            layout.adjustLayout(layout.getFooterDiv(), fontObj.th * 2);
            this.autoRefresh();
        }
        this.setFooterFont(new Misc.Font(15, "Arial", "normal", "bold"))

        this.footerFont = function () {
            return m_footerFont;
        }

        this.enableLegend = function (on) {
            //if (on == legendEnable)
            //return;
            legendEnable = on;
            if (!m_legend || m_legend.isEmpty())
                return;
            //legendEnable = on;
            if (on) {
                layout.getLegendDiv().show();
            } else {
                layout.getLegendDiv().hide();
            }
            this.autoRefresh();
        }

        this.isLegendEnabled = function (on) {
            //console.log(layout.getLegendDiv()[0].style.display)
            return !(layout.getLegendDiv()[0].style.display == 'none'); //legendEnable;
        }

        /*!
        Transform the x or y coordinate of a position in the
        drawing region into a value.

        \param axisId Axis index
        \param pos position

        \return Position as axis coordinate

        \warning The position can be an x or a y coordinate,
        depending on the specified axis.
         */
        this.invTransform = function (axisId, pos) {
            if (this.axisValid(axisId))
                return (this.canvasMap(axisId).invTransform(pos));
            else
                return 0.0;
        }

        /*!
        \brief Transform a value into a coordinate in the plotting region

        \param axisId Axis index
        \param value value
        \return X or Y coordinate in the plotting region corresponding
        to the value.
         */
        this.transform = function (axisId, value) {
            if (this.axisValid(axisId))
                return (this.canvasMap(axisId).transform(value));
            else
                return 0.0;
        }

        /*this.setLegendBackground = function (color) {
        this.getLayout().getLegendDiv().css("background-color", color);

        }
        this.setLegendBackground("rgb(238, 232, 170)")*/

        var _plotBackGround = "";

        this.setPlotBackground = function (color) {
            this.getCentralWidget().getElement().css("background-color", color);

        }
        this.setPlotBackground("rgb(238, 232, 170)")

        /*this.setPlotContainerBackground = function (brush) {
        if(typeof(brush)=="string")
        brush = new Misc.Brush(brush)
        _plotBackGround = brush;
        this.autoRefresh();
        }*/

        this.plotBackground = function (brush) {
            return this.getCentralWidget().getElement().css("background-color");
        }

        this.setBorderRadius = function (radius) {
            var cw = this.getCentralWidget()
                //cw.getElement().css("border-radius", radius)
                cw.getCanvas().css("border-radius", radius)
        }

        this.borderRadius = function (radius) {
            return m_borderRadius;
        }

        this.findPlotCurve = function (title) {
            var list = this.itemList(Static.Rtti_PlotCurve)
                for (var i = 0; i < list.length; ++i) {
                    if (list[i].title() === title)
                        return list[i];
                }
                return null;
        }

        this.hasVisiblePlotCurve = function () {
            var list = this.itemList(Static.Rtti_PlotCurve);
            for (var i = 0; i < list.length; ++i) {
                if (list[i].isVisible())
                    return true;
            }
            return false;
        }

        this.hasPlotCurve = function () {
            /* var list = this.itemList(Static.Rtti_PlotCurve)
            for (var i = 0; i < list.length; ++i) {
            if (list[i].title() === title)
            return list[i];
            }
            return null; */
            return this.itemList(Static.Rtti_PlotCurve).length > 0
        }

        this.drawBackGround = function () {
            var painter = new PaintUtil.Painter(centralWidget);
            painter.fillRect(new Misc.Rect(0, 0, centralWidget.width(), centralWidget.height()), _plotBackGround);
            painter = null
        }

        this.drawTitle = function () {
            if (_title === "")
                return;
            var painter = new PaintUtil.Painter(titleWidget);
            painter.setFont(m_titleFont);
            painter.drawText(_title, titleWidget.width() / 2, 2.6 * m_titleFont.th / 2, "center");
            painter = null
        }

        this.drawFooter = function () {
            if (m_footer === "")
                return;
            var painter = new PaintUtil.Painter(footerWidget);
            painter.setFont(m_footerFont);
            painter.drawText(m_footer, footerWidget.width() / 2, 2.6 * m_footerFont.th / 2, "center");
            painter = null
        }

        this.itemList = function (type) {
            if (typeof(type) === 'undefined')
                return m_plotItemStore;
            return _.filter(m_plotItemStore, function (item) {
                return item.rtti === type;
            });
        }

        this.insertItem = function (item) {
            m_plotItemStore.push(item);
        }

        this.removeItem = function (item) {
            var index = m_plotItemStore.indexOf(item);
            if (index > -1) {
                m_plotItemStore.splice(index, 1);
            }
        }

        /*!
        \param axisId Axis
        \return Map for the axis on the canvas. With this map pixel coordinates can
        translated to plot coordinates and vice versa.
        \sa QwtScaleMap, transform(), invTransform()

         */
        this.canvasMap = function (axisId) {
            var map = new ScaleMap();
            //        if ( !d_data->canvas )
            //            return map;

            map.setTransformation(this.axisScaleEngine(axisId).transformation());

            var sd = this.axisScaleDiv(axisId);
            map.setScaleInterval(sd.lowerBound(), sd.upperBound());

            if (1) { //this.axisEnabled(axisId)) {
                var s = this.axisWidget(axisId);
                if (axisId == yLeft || axisId == yRight) {
                    //var y = s->y() + s->startBorderDist() - d_data->canvas->y();
                    var h = s.height();
                    map.setPaintInterval(h, 0);
                } else {
                    //double x = s->x() + s->startBorderDist() - d_data->canvas->x();
                    var w = s.width();
                    map.setPaintInterval(0, w);
                }

            }
            /*else {

            // int margin = 0;
            //if ( !plotLayout()->alignCanvasToScale( axisId ) )
            // margin = plotLayout()->canvasMargin( axisId );

            //const QRect &canvasRect = d_data->canvas->contentsRect();
            if (axisId == yLeft || axisId == yRight) {
            map.setPaintInterval(centralWidget.height(), 0);
            } else {
            map.setPaintInterval(0, centralWidget.width());
            }
            }*/
            return map;
        }

        /*!
        \return Scale widget of the specified axis, or NULL if axisId is invalid.
        \param axisId Axis index
         */
        this.axisWidget = function (axisId) {
            if (this.axisValid(axisId))
                return d_axisData[axisId].scaleWidget;

            return null;
        }

        /*!
        \brief Rebuild the axes scales

        In case of autoscaling the boundaries of a scale are calculated
        from the bounding rectangles of all plot items, having the
        QwtPlotItem::AutoScale flag enabled ( QwtScaleEngine::autoScale() ).
        Then a scale division is calculated ( QwtScaleEngine::didvideScale() )
        and assigned to scale widget.

        When the scale boundaries have been assigned with setAxisScale() a
        scale division is calculated ( QwtScaleEngine::didvideScale() )
        for this interval and assigned to the scale widget.

        When the scale has been set explicitly by setAxisScaleDiv() the
        locally stored scale division gets assigned to the scale widget.

        The scale widget indicates modifications by emitting a
        QwtScaleWidget::scaleDivChanged() signal.

        updateAxes() is usually called by replot().

        \sa setAxisAutoScale(), setAxisScale(), setAxisScaleDiv(), replot()
        QwtPlotItem::boundingRect()
         */
        this.updateAxes = function () {

            // Find bounding interval of the item data
            // for all axes, where autoscaling is enabled

            var intv = [new Interval(Number.MAX_VALUE, -Number.MAX_VALUE),
                new Interval(Number.MAX_VALUE, -Number.MAX_VALUE),
                new Interval(Number.MAX_VALUE, -Number.MAX_VALUE),
                new Interval(Number.MAX_VALUE, -Number.MAX_VALUE)
            ];

            for (i = 0; i < m_plotItemStore.length; ++i) {

                var item = m_plotItemStore[i];
                // alert(m_plotItemStore[i])

                // alert(m_plotItemStore[i].testItemAttribute( AutoScale ))
                if (!item.testItemAttribute(AutoScale))
                    continue;
                //alert(i)

                if (!item.isVisible())
                    continue;

                //alert(11)
                //alert(this.axisAutoScale( item.xAxis()))
                if (this.axisAutoScale(item.xAxis()) || this.axisAutoScale(item.yAxis())) {
                    //alert(item)
                    var rect = item.boundingRect();
                    //alert(rect)

                    if (rect.width() >= 0.0) {
                        //intv[item.xAxis()] |= new Interval( rect.left(), rect.right());
                        if (rect.left() < intv[item.xAxis()].minValue())
                            intv[item.xAxis()].setMinValue(rect.left());
                        if (rect.right() > intv[item.xAxis()].maxValue())
                            intv[item.xAxis()].setMaxValue(rect.right());
                        //intv[item.xAxis()].setInterval(rect.left(), rect.right())
                    }

                    if (rect.height() >= 0.0) {
                        //intv[item.yAxis()] |= new Interval( rect.top(), rect.bottom );
                        if (rect.top() < intv[item.yAxis()].minValue())
                            intv[item.yAxis()].setMinValue(rect.top());
                        if (rect.bottom() > intv[item.yAxis()].maxValue())
                            intv[item.yAxis()].setMaxValue(rect.bottom());
                    }
                }

            }
            // alert(intv[yLeft].maxValue())

            // Adjust scales

            for (var axisId = 0; axisId < axisCnt; axisId++) {

                var d = d_axisData[axisId];
                var minValue = d.minValue;
                var maxValue = d.maxValue;
                var stepSize = d.stepSize;
                //alert(d.doAutoScale)

                if (d.doAutoScale && intv[axisId].isValid()) {
                    //alert("here")
                    d.isValid = false;

                    minValue = intv[axisId].minValue();
                    maxValue = intv[axisId].maxValue();
                    //alert("minValue: "+minValue +", "+"maxValue: " + maxValue)

                    var xValues = {
                        "x1": minValue,
                        "x2": maxValue
                    };
                    d.scaleEngine.autoScale(d.maxMajor, xValues, stepSize);
                    minValue = xValues["x1"];
                    maxValue = xValues["x2"];
                }
                if (!d.isValid) {
                    //alert("or here")
                    d.scaleDiv = d.scaleEngine.divideScale(
                            minValue, maxValue,
                            d.maxMajor, d.maxMinor, stepSize);
                    d.isValid = true;
                    //alert(d.scaleDiv.ticks(2))
                }
                var scaleWidget = this.axisWidget(axisId);
                scaleWidget.setScaleDiv(d.scaleDiv);

                //var startDist, endDist;
                var startAndEndObj = {
                    start: undefined,
                    end: undefined
                }
                scaleWidget.getBorderDistHint(startAndEndObj);
                scaleWidget.setBorderDist(startAndEndObj.start, startAndEndObj.end);

            }
            for (var i = 0; i < m_plotItemStore.length; ++i) {
                var item = m_plotItemStore[i];
                if (item.testItemInterest(ScaleInterest)) {
                    item.updateScaleDiv(this.axisScaleDiv(item.xAxis()),
                        this.axisScaleDiv(item.yAxis()));
                }
            }

        }

        /*!
        \brief Attach/Detach a plot item

        \param plotItem Plot item
        \param on When true attach the item, otherwise detach it
         */
        this.attachItem = function (plotItem, on) {

            if (on) {
                this.insertItem(plotItem);
                if (plotItem.testItemAttribute(Legend)) {
                    this.insertLegendItem(plotItem);
                }
                //Static.trigger("itemAttached", [plotItem, true])
            } else {
                if (plotItem.testItemAttribute(Legend)) {
                    this.removeLegendItem(plotItem);
                }
                this.removeItem(plotItem);
                //Static.trigger("itemAttached", [plotItem, false])
                //plotItem = null
            }
            //console.log(on)
            Static.trigger("itemAttached", [plotItem, on])
            if (!on)
                plotItem = null
                    this.autoRefresh();
        }

        /*
        void QwtPlot::attachItem( QwtPlotItem *plotItem, bool on ){
        if ( plotItem->testItemInterest( QwtPlotItem::LegendInterest ) ){
        // plotItem is some sort of legend

        const QwtPlotItemList& itmList = itemList();
        for ( QwtPlotItemIterator it = itmList.begin();
        it != itmList.end(); ++it ){
        QwtPlotItem *item = *it;

        QList<QwtLegendData> legendData;
        if ( on && item->testItemAttribute( QwtPlotItem::Legend ) ){
        legendData = item->legendData();
        plotItem->updateLegend( item, legendData );
        }
        }
        }

        if ( on )
        insertItem( plotItem );
        else
        removeItem( plotItem );

        Q_EMIT itemAttached( plotItem, on );

        if ( plotItem->testItemAttribute( QwtPlotItem::Legend ) ){
        // the item wants to be represented on the legend

        if ( on ){
        updateLegend( plotItem );
        }
        else{
        const QVariant itemInfo = itemToInfo( plotItem );
        Q_EMIT legendDataChanged( itemInfo, QList<QwtLegendData>() );
        }
        }

        autoRefresh();
        }

         */

        this.replot = function () {
            this.updateAxes();

            //Without a border of width 1px gridlines will not align with scale ticks.
            //var centralDiv = this.getLayout().getCentralDiv()
            //if(centralDiv.css("border-style") =="none")
            //centralDiv.css("border-style", "solid")
            //if(centralDiv.css("border-width") !=="1px")
            //centralDiv.css("border-width", 1)

            /*m_scaleDraw.data.plotCanvasBorderWidth =
            parseFloat(m_plot.getLayout().getCentralDiv().
            css("border-width"))*/

            for (var axisId = 0; axisId < axisCnt; axisId++) {
                var axisWidget = d_axisData[axisId].scaleWidget;
                axisWidget.scaleDraw().data.plotBorderWidth =
                    parseFloat(this.getLayout().getCentralDiv().css("border-width"));
                axisWidget.draw();
            }

            this.drawTitle();
            this.drawFooter();

            //var i = 0;
            for (var i = 0; i < m_plotItemStore.length; ++i) {
                if (!m_plotItemStore[i].isVisible())
                    continue;
                m_plotItemStore[i].draw(this.axisScaleDraw(m_plotItemStore[i].xAxis()).scaleMap(),
                    this.axisScaleDraw(m_plotItemStore[i].yAxis()).scaleMap());
            }

            Static.trigger("replot")

        }

        this.setAutoReplot(true)

        layout.getTitleDiv().hide();
        if (typeof(pTitle) !== 'undefined') {
            this.setTitle(pTitle)
        }

        m_defaultCursor = layout.getCentralDiv().css("cursor");
        this.setCursor("crosshair");

        this.enableAxis(yRight, false);
        this.enableAxis(xTop, false);
        layout.getFooterDiv().hide(); //initially hidden
        layout.getLegendDiv().hide(); //initially hidden


        Static.bind('resize', function () {
            self.replot();
        });

        this.setAutoReplot(false)

        this.toString = function () {
            return '[Plot "' + _title + '"]';
        }

        //m_plotCanvas = new PlotCanvas(this)


        //Force replot before printing
        Static.bind("beforePrint", function () {
            //alert("before")
            self.replot()
        })

    }
}
