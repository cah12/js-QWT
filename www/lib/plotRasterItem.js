/**
 * 
 */
class PlotRasterItem extends PlotItem {

    static useCache(policy, painter) {
        const Enum = Enumerator.getDefaultEnumNampespace();
        var doCache = false;

        if (policy == Enum.CachePolicy.PaintCache) {
            // Caching doesn't make sense, when the item is
            // not painted to screen

            switch (/* painter.paintEngine().type() */ 1) {
                /* case QPaintEngine::SVG:
                case QPaintEngine::Pdf:
                case QPaintEngine::PostScript:
                case QPaintEngine::MacPrinter:
                case QPaintEngine::Picture:
                break; */
            default: ;
                doCache = true;
            }
        }

        return doCache;
    }

    static qwtToRgba(from, alpha) {
        var alphaImage = from.copy();
        alphaImage.setAlpha(alpha);
        return alphaImage;
    }

    constructor(tle) {
        super(tle);

        Enum.CachePolicy = {
            /*!
            renderImage() is called each time the item has to be repainted
             */
            NoCache: 0,
            /*!
            renderImage() is called, whenever the image cache is not valid,
            or the scales, or the size of the canvas has changed.

            This type of cache is useful for improving the performance
            of hide/show operations or manipulations of the alpha value.
            All other situations are handled by the canvas backing store.
             */
            PaintCache: 1
        };

        /*!
        When the image is rendered according to the data pixels
        ( QwtRasterData::pixelHint() ) it can be expanded to paint
        device resolution before it is passed to QPainter.
        The expansion algorithm rounds the pixel borders in the same
        way as the axis ticks, what is usually better than the
        scaling algorithm implemented in Qt.
        Disabling this flag might make sense, to reduce the size of a
        document/file. If this is possible for a document format
        depends on the implementation of the specific QPaintEngine.
         */
        Enum.PaintAttribute = {
            PaintInDeviceResolution: 1
        };

        class PrivateData {
            constructor() {
                this.cache = {
                    policy: null,
                    area: null,
                    size: null,
                    image: null
                };
                this.alpha = -1;
                this.paintAttributes = Enum.PaintAttribute.PaintInDeviceResolution;
                this.cache.policy = Enum.CachePolicy.NoCache;
            }
        }
        /* data */
        var d_data = null;

        var m_pixelSize = new Misc.Size(1, 1);

        /* Mehods */
        this.init = function () {
            d_data = new PrivateData();
            this.setItemAttribute(PlotItem.ItemAttribute.AutoScale, true);
            this.setItemAttribute(PlotItem.ItemAttribute.Legend, false);
            this.setZ(8.0);
        }
        /*!
        Specify an attribute how to draw the raster item

        \param attribute Paint attribute
        \param on On/Off
        /sa PaintAttribute, testPaintAttribute()
         */
        this.setPaintAttribute = function (attribute, on) {
            if (on)
                d_data.paintAttributes |= attribute;
            else
                d_data.paintAttributes &= ~attribute;
        }
        /*!
        \return True, when attribute is enabled
        \sa PaintAttribute, setPaintAttribute()
         */
        this.testPaintAttribute = function (attribute) {
            return (d_data.paintAttributes & attribute);
        }
        /*!
        \brief Set an alpha value for the raster data

        Often a plot has several types of raster data organized in layers.
        ( f.e a geographical map, with weather statistics ).
        Using setAlpha() raster items can be stacked easily.

        The alpha value is a value [0, 255] to
        control the transparency of the image. 0 represents a fully
        transparent color, while 255 represents a fully opaque color.

        \param alpha Alpha value

        - alpha >= 0\n
        All alpha values of the pixels returned by renderImage() will be set to
        alpha, beside those with an alpha value of 0 (invalid pixels).
        - alpha < 0
        The alpha values returned by renderImage() are not changed.

        The default alpha value is -1.

        \sa alpha()
         */
        this.setAlpha = function (alpha) {
            if (alpha < 0)
                alpha = -1;
            if (alpha > 255)
                alpha = 255;
            if (alpha != d_data.alpha) {
                d_data.alpha = alpha;
                this.itemChanged();
            }
        }
        /*!
        \return Alpha value of the raster item
        \sa setAlpha()
         */
        this.alpha = function () {
            return d_data.alpha;
        }
        /*!
        Change the cache policy

        The default policy is NoCache

        \param policy Cache policy
        \sa CachePolicy, cachePolicy()
         */
        this.setCachePolicy = function (policy) {
            if (d_data.cache.policy != policy) {
                d_data.cache.policy = policy;
                this.invalidateCache();
                this.itemChanged();
            }
        }
        /*!
        \return Cache policy
        \sa CachePolicy, setCachePolicy()
         */
        this.cachePolicy = function () {
            return d_data.cache.policy;
        }
        /*!
        Invalidate the paint cache
        \sa setCachePolicy()
         */
        this.invalidateCache = function () {
            d_data.cache.image = new Misc.Image();
            d_data.cache.area = new Misc.Rect();
            d_data.cache.size = new Misc.Size();
        }

        /*!
        \return Bounding interval for an axis

        This method is intended to be reimplemented by derived classes.
        The default implementation returns an invalid interval.

        \param axis X, Y, or Z axis
         */
        this.interval = function (axis) {
            /* Q_UNUSED( axis ); */
            return new Interval();
        }

        this.pixelSize = function () {
            return m_pixelSize;
        }

        this.setPixelSize = function (sz) {
            m_pixelSize = sz;
        }

        this.compose = function (xMap, yMap, imageArea, paintRect, imageSize, doCache) {
            var image = new Misc.Image();
            if (imageArea.isEmpty() || paintRect.isEmpty() || imageSize.isEmpty())
                return image;

            if (doCache) {
                if (!d_data.cache.image.isNull()
                     && d_data.cache.area.isEqual(imageArea)
                     && d_data.cache.size.isEqual(paintRect.size())) {
                    image = d_data.cache.image;
                }
            }

            if (image.isNull()) {

                var xxMap = this.imageMap(Static.Horizontal, xMap, imageArea, imageSize);
                var yyMap = this.imageMap(Static.Vertical, yMap, imageArea, imageSize);
                image = this.renderImage(xxMap, yyMap, imageArea, imageSize);

                if (doCache) {
                    d_data.cache.area = imageArea.copy();
                    d_data.cache.size = paintRect.size().copy();
                    d_data.cache.image = image.copy();
                }
            }

            if (d_data.alpha >= 0 && d_data.alpha < 255) {
                image = PlotRasterItem.qwtToRgba(image, d_data.alpha);
            }
            return image;
        }

        /*!
        \brief Calculate a scale map for painting to an image

        \param orientation Orientation, Qt::Horizontal means a X axis
        \param map Scale map for rendering the plot item
        \param area Area to be painted on the image
        \param imageSize Image size
        \param pixelSize Width/Height of a data pixel

        \return Calculated scale map
         */
        this.imageMap = function (orientation, map, area, imageSize) {
            var p1,
            p2,
            s1,
            s2;

            if (orientation == Static.Horizontal) {
                p1 = 0.0;
                p2 = imageSize.width;
                s1 = area.left();
                s2 = area.right();
            } else {
                p1 = 0.0;
                p2 = imageSize.height;
                s1 = area.top();
                s2 = area.bottom();
            }

            if (map.isInverting() && (s1 < s2)) {
                var temp = s1;
                s1 = s2;
                s2 = temp;
            }

            var newMap = map.copy();
            newMap.setPaintInterval(p1, p2);
            newMap.setScaleInterval(s1, s2);

            return newMap;
        }

        this.dataRasterItemPrivateData = function () {
            return d_data;
        }
        this.init();
    }

    /*!
    \return Bounding rectangle of the data
    \sa QwtPlotRasterItem::interval()
     */
    boundingRect() {
        /* var intervalX = new Interval(Static.XAxis);
        var intervalY = new Interval(YAxis); */
		
		var intervalX = this.interval(Static.XAxis);
        var intervalY = this.interval(Static.YAxis);

        if (!intervalX.isValid() && !intervalY.isValid())
            return new Misc.Rect(); // no bounding rect

        var r = new Misc.Rect();

        if (intervalX.isValid()) {
            r.setLeft(intervalX.minValue());
            r.setRight(intervalX.maxValue());
        } else {
            r.setLeft(-0.5 * Number.MAX_VALUE);
            r.setWidth(Number.MAX_VALUE);
        }

        if (intervalY.isValid()) {
            r.setTop(intervalY.minValue());
            r.setBottom(intervalY.maxValue());
        } else {
            r.setTop(-0.5 * Number.MAX_VALUE);
            r.setHeight(Number.MAX_VALUE);
        }

        return r.normalized();
    }

    /*!
    \brief Draw the raster data
    \param painter Painter
    \param xMap X-Scale Map
    \param yMap Y-Scale Map
    \param canvasRect Contents rectangle of the plot canvas
     */
    draw(painter, xMap, yMap, canvasRect) {
        var d_data = this.dataRasterItemPrivateData();
        if (canvasRect.isEmpty() || d_data.alpha == 0)
            return;

        var doCache = PlotRasterItem.useCache(d_data.cache.policy, painter);

        var area = ScaleMap.invTransform_Rect(xMap, yMap, canvasRect);

        var paintRectAsSize = new Misc.Size(canvasRect.width(), canvasRect.height());
        var image = this.compose(xMap, yMap, area, canvasRect, paintRectAsSize, doCache);
        if (image.isNull())
            return;

        painter.save();

        painter.drawImage(image, canvasRect);

        painter.restore();
    }

}
