'use strict';

Static.XAxis = 0;
Static.YAxis = 1;
Static.ZAxis = 2;

/**
 * 
 */
class PlotSpectrogram extends PlotRasterItem {

    /*!
    Sets the following item attributes:
    - QwtPlotItem::PlotItem.ItemAttribute.AutoScale: true
    - QwtPlotItem::Legend:    false

    The z value is initialized by 8.0.

    \param title Title

    \sa QwtPlotItem::setItemAttribute(), QwtPlotItem::setZ()
     */
    constructor(tle) {
        super(tle);
        /*!
        The display mode controls how the raster data will be represented.
        \sa setDisplayMode(), testDisplayMode()
         */
        //if (!Utility.enumExist("DisplayMode"))
            Enumerator.enum("DisplayMode {ImageMode = 0x01 /* The values are mapped to colors using a color map*/, ContourMode = 0x02 /* The data is displayed using contour lines */}");
        const Enum = Enumerator.getDefaultEnumNampespace();

        class PrivateData {
            constructor() {
                /* QwtRasterData */
                this.data = null;
                this.colorMap = new LinearColorMap();
                this.displayMode = Enum.DisplayMode.ImageMode;
                this.contourLevels = [];
                this.defaultContourPen = new Misc.Pen();
                this.numberOfContourPlanes = 10;
            }
        }
        var self = this;
        var gridSzX = 80;
        var gridSzY = 80;
        var d_data = new PrivateData();
        this.privateData = function () {
            return d_data;
        }


        this.setItemAttribute(PlotItem.ItemAttribute.AutoScale, true);
        this.setItemAttribute(PlotItem.ItemAttribute.Legend, false);

        this.setZ(8.0);

        //! \return QwtPlotItem::Rtti_PlotSpectrogram
        /* this.rtti = function () {
            return PlotItem.RttiValues.Rtti_PlotSpectrogram;
        } */
        this.rtti = PlotItem.RttiValues.Rtti_PlotSpectrogram;

        /*!
        The display mode controls how the raster data will be represented.

        \param mode Display mode
        \param on On/Off

        The default setting enables ImageMode.

        \sa DisplayMode, displayMode()
         */
        this.setDisplayMode = function (mode, on) {
            if (on != (mode & d_data.displayMode)) {
                if (on)
                    d_data.displayMode |= mode;
                else
                    d_data.displayMode &= ~mode;

                this.legendChanged();
                this.itemChanged();
            }

            /* this.legendChanged();
            this.itemChanged(); */
        }

        /*!
        The display mode controls how the raster data will be represented.

        \param mode Display mode
        \return true if mode is enabled
         */
        this.testDisplayMode = function (mode) {
            return (d_data.displayMode & mode);
        }

        /*!
        Change the color map

        Often it is useful to display the mapping between intensities and
        colors as an additional plot axis, showing a color bar.

        \param colorMap Color Map

        \sa colorMap(), QwtScaleWidget::setColorBarEnabled(),
        QwtScaleWidget::setColorMap()
         */
        this.setColorMap = function (colorMap) {
            if (d_data.colorMap != colorMap) {
                d_data.colorMap = colorMap;
            }

            this.invalidateCache();

            this.legendChanged();
            this.itemChanged();
        }

        /*!
        \return Color Map used for mapping the intensity values to colors
        \sa setColorMap()
         */
        this.colorMap = function () {
            return d_data.colorMap;
        }

        /*!
        Build and assign the default pen for the contour lines

        In Qt5 the default pen width is 1.0 ( 0.0 in Qt4 ) what makes it
        non cosmetic ( see QPen::isCosmetic() ). This method has been introduced
        to hide this incompatibility.

        \param color Pen color
        \param width Pen width
        \param style Pen style

        \sa pen(), brush()
         */
        this.setDefaultContourPen = function (color, width, style) {
            var pen = color;
            if (typeof pen !== 'object')
                pen = new Misc.Pen(color, width, style);
            this.doSetDefaultContourPen(pen);
        }

        /*!
        \brief Set the default pen for the contour lines

        If the spectrogram has a valid default contour pen
        a contour line is painted using the default contour pen.
        Otherwise (pen.style() == Qt::NoPen) the pen is calculated
        for each contour level using contourPen().

        \sa defaultContourPen(), contourPen()
         */
        this.doSetDefaultContourPen = function (pen) {
            if (!pen.isEqual(d_data.defaultContourPen)) {
                d_data.defaultContourPen = pen;
                this.legendChanged();
                this.itemChanged();
            }
        }

        /*!
        \return Default contour pen
        \sa setDefaultContourPen()
         */
        this.defaultContourPen = function () {
            return d_data.defaultContourPen;
        }

        /*!
        \brief Calculate the pen for a contour line

        The color of the pen is the color for level calculated by the color map

        \param level Contour level
        \return Pen for the contour line
        \note contourPen is only used if defaultContourPen().style() == Qt::NoPen

        \sa setDefaultContourPen(), setColorMap(), setContourLevels()
         */
        this.contourPen = function (level) {
            if (d_data.data == null || d_data.colorMap == null)
                return new Misc.Pen();

            var intensityRange = d_data.data.interval(Static.ZAxis);
            var c = d_data.colorMap.rgb(intensityRange, level);

            return new Misc.Pen(c.toString());
        }

        /*!
        Calculate the levels of the contour lines

        \param numberOfPlanes of contour planes
        \param minZ lowest point
        \param maxZ highest point
        \return array of levels
        \sa contourLevels(), renderContourLines(),
        QwtRasterData::contourLines()

        \note contourLevels returns the same levels but sorted.
         */
        this.calculateContourLevels = function (numberOfPlanes, minZ, maxZ) {
            if (numberOfPlanes < 1)
                return [];
            var zInterval = d_data.data.interval(Static.ZAxis);
            if (minZ == undefined) {
                minZ = zInterval.minValue();
                maxZ = zInterval.maxValue();
            }

            var cI = /* Math.round */((maxZ - minZ) / numberOfPlanes);

            var contourLevels = [];

            for (var level = minZ + 0.5 * cI; level < maxZ; level += cI)
                contourLevels.push(level);

            return contourLevels;
        }

        let numberOfContourPlanes = 10;

        this.numberOfContourPlanes = function () {
            return numberOfContourPlanes;
        }

        this.setNumberOfContourPlanes = function (numberOfPlanes) {
            numberOfContourPlanes = numberOfPlanes;
            this.setContourLevels(this.calculateContourLevels(numberOfPlanes));
        }

        /*!
        Set the levels of the contour lines

        \param levels Values of the contour levels
        \sa contourLevels(), renderContourLines(),
        QwtRasterData::contourLines()

        \note contourLevels returns the same levels but sorted.
         */
        this.setContourLevels = function (/* const QList<double> & */ levels) {
            d_data.contourLevels = levels;
            _.sortBy(d_data.contourLevels);

            this.legendChanged();
            this.itemChanged();
        }

        /*!
        \return Levels of the contour lines.

        The levels are sorted in increasing order.

        \sa contourLevels(), renderContourLines(),
        QwtRasterData::contourLines()
         */
        this.contourLevels = function () {
            return d_data.contourLevels;
        }

        /*!
        Set the data to be displayed

        \param data Spectrogram Data
        \sa data()
         */
        this.setData = function (/* QwtRasterData * */ data) {
            if (data != d_data.data) {
                d_data.data = data;

                this.invalidateCache();
                this.itemChanged();
            }
        }

        /*!
        \return Spectrogram data
        \sa setData()
         */
        this.data = function () {
            return d_data.data;
        }

        /*!
        \return Bounding interval for an axis

        The default implementation returns the interval of the
        associated raster data object.

        \param axis X, Y, or Z axis
        \sa QwtRasterData::interval()
         */
        this.interval = function (/* Qt::Axis */ axis) {
            if (d_data.data == null)
                return new Interval();

            return d_data.data.interval(axis);
        }

        /*!
        \brief Render an image from data and color map.

        For each pixel of area the value is mapped into a color.

        \param xMap X-Scale Map
        \param yMap Y-Scale Map
        \param area Requested area for the image in scale coordinates
        \param imageSize Size of the requested image

        \return An Image.

        \sa QwtRasterData::value(), QwtColorMap::rgb(),
        QwtColorMap::colorIndex()
         */
        this.renderImage = function (xMap, yMap, area, imageSize) {

            if (imageSize.isEmpty() || d_data.data == null
                || d_data.colorMap == null) {
                return new Misc.Image();
            }

            var intensityRange = d_data.data.interval(Static.ZAxis);
            if (!intensityRange.isValid())
                return new Misc.Image();

            var image = new Misc.Image(imageSize);

            if (d_data.colorMap.format() == ColorMap.Format.Indexed)
                image.setColorTable(d_data.colorMap.colorTable(intensityRange));

            d_data.data.initRaster(area, image.size());

            var tile = new Misc.Rect(0, 0, imageSize.width, imageSize.height);
            this.renderTile(xMap, yMap, tile, image);

            d_data.data.discardRaster();

            return image;
        }

        /*!
        \brief Render a tile of an image.

        Rendering in tiles can be used to composite an image in parallel
        threads.
        We always use the default alpha value of 255

        \param xMap X-Scale Map
        \param yMap Y-Scale Map
        \param tile Geometry of the tile in image coordinates
        \param image Image to be rendered
         */
        this.renderTile = function (xMap, yMap, tile, image) {
            var range = d_data.data.interval(Static.ZAxis);
            if (!range.isValid())
                return;

            var extraPixelW = this.pixelSize().width - 1;
            var extraPixelH = this.pixelSize().height - 1;

            var incrementW = extraPixelW + 1;
            var incrementH = extraPixelH + 1;

            var y,
                x,
                top = tile.top() + extraPixelH,
                bottom = tile.bottom(),
                left = tile.left() + extraPixelW,
                right = tile.right();

            if (d_data.colorMap.format() == ColorMap.Format.RGB) {
                for (y = top; y < bottom; y += incrementH) {
                    var ty = yMap.invTransform(y);

                    for (x = left; x < right; x += incrementW) {
                        var tx = xMap.invTransform(x);
                        var rgba = d_data.colorMap.rgb(range, d_data.data.value(tx, ty));
                        //rgba.a = this.alpha(); //we always use the default alpha value of 255
                        for (var yy = extraPixelH; yy >= 0; --yy) {
                            for (var xx = extraPixelW; xx >= 0; --xx) {
                                image.setPixel(x + xx - extraPixelW, y + yy - extraPixelH, rgba);
                            }
                        }
                    }
                }
            } else if (d_data.colorMap.format() == ColorMap.Format.Indexed) {
                for (y = top; y < bottom; y += incrementH) {
                    var ty = yMap.invTransform(y);

                    for (x = left; x < right; x += incrementW) {
                        var tx = xMap.invTransform(x);
                        var rgba = image.pixel(d_data.colorMap.colorIndex(range, d_data.data.value(tx, ty)));
                        //rgba.a = this.alpha(); //we always use the default alpha value of 255
                        for (var yy = extraPixelH; yy >= 0; --yy) {
                            for (var xx = extraPixelW; xx >= 0; --xx) {
                                image.setPixel(x + xx - extraPixelW, y + yy - extraPixelH, rgba);
                            }
                        }
                    }
                }
            }
        }

        /*!
        Calculate and draw contour lines

        \param rect Rectangle, where to calculate the contour lines

        \sa contourLevels(), setConrecFlag(),
        QwtRasterData::contourLines()
         */
        this.renderContourLines = function (painter, xMap, yMap, rect) {
            function drawContour(startX, startY, endX, endY, contourLevel, k) {
                var pen = self.defaultContourPen();
                if (pen.style == Static.NoPen)
                    pen = self.contourPen(contourLevel);

                if (pen.style == Static.NoPen)
                    return;

                painter.setPen(pen);
                painter.drawLine(xMap.transform(startX), yMap.transform(startY), xMap.transform(endX), yMap.transform(endY));
            }

            if (d_data.data == null)
                return;
            var levels = d_data.contourLevels;
            var data = d_data.data.contourLinesData(levels, gridSzX, gridSzY);
            var c = new Conrec(drawContour);
            c.contour(data.d, 0, data.x.length - 1, 0, data.y.length - 1, data.x, data.y, levels.length, levels);
        }

    }

    /*!
    \brief Draw the spectrogram

    \param painter Painter
    \param xMap Maps x-values into pixel coordinates.
    \param yMap Maps y-values into pixel coordinates.
    \param canvasRect Contents rectangle of the canvas in painter coordinates

    \sa setDisplayMode(), renderImage(),
    QwtPlotRasterItem::draw(), drawContourLines()
     */
    draw(xMap, yMap) {
        var d_data = this.privateData();
        var canvasRect = this.getCanvasRect();
        var painter = new PaintUtil.Painter(this);
        if (d_data.displayMode & Enum.DisplayMode.ImageMode)
            super.draw(painter, xMap, yMap, canvasRect);

        if (d_data.displayMode & Enum.DisplayMode.ContourMode) {

            var area = ScaleMap.invTransform_Rect(xMap, yMap, canvasRect);

            var br = this.boundingRect();

            if (br.isValid()) {
                area.united(br);
                if (area.isEmpty())
                    return;
            }
            this.renderContourLines(painter, xMap, yMap, canvasRect);
        }
    }
}
