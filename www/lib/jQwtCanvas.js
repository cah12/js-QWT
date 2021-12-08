'use strict';
//function AbstractCanvas(parentDiv) {
class AbstractCanvas {
    constructor(parentDiv) {
        var m_frameStyle = "none"; //Any valid CSS border-style property
        var m_lineWidth = 0;
        var m_lineColor = "#000000";
        var m_borderRadius = 0;
        var m_color = "#000000";
        var m_parentDiv = parentDiv;

        this.setLineWidth = function (w) {
            m_lineWidth = w;
            //if (m_lineWidth)
            m_parentDiv.css("border-width", m_lineWidth);
            return this; //for chaining
        }

        this.setLineColor = function (red, green, blue) {
            if (typeof(red) == "number") {
                m_lineColor = Static.RGB2HTML(red, green, blue);
            } else if (typeof(red) == "string") {
                m_lineColor = red;
            }
            m_parentDiv.css("border-color", m_lineColor);
            return this; //for chaining
        }

        this.setFrameStyle = function (s) {
            m_frameStyle = s;
            m_parentDiv.css("border-style", s);
            return this; //for chaining
        }

        this.setBorderRadius = function (r) {
            m_borderRadius = r;
            m_parentDiv.css("border-radius", m_borderRadius);
            return this; //for chaining
        }

        this.setBackgroundColor = function (red, green, blue) {
            if (typeof(red) == "number") {
                m_color = Static.RGB2HTML(red, green, blue);
            } else if (typeof(red) == "string") {
                m_color = red;
            }
            m_parentDiv.css("background-color", m_color);
            return this; //for chaining
        }

        this.setBackground = function (styleString) {
            m_parentDiv.css("background", styleString);
            return this; //for chaining
        }

        this.getBorderRadius = function () {
            return m_borderRadius;
        }

        /*var pc = new PlotCanvas(plot)
        pc.setStyleSheet({
        backgroundColor: "yellow",
        background: "linear-gradient(yellow, white)",
        borderRadius: 15,
        lineColor: "red",
        lineWidth: 4
        })*/
        this.setStyleSheet = function (sheet) {
            if (sheet.backgroundColor !== undefined)
                this.setBackgroundColor(sheet.backgroundColor);
            if (sheet.background !== undefined)
                this.setBackground(sheet.background);
            if (sheet.borderRadius !== undefined)
                this.setBorderRadius(sheet.borderRadius);
            if (sheet.frameStyle !== undefined)
                this.setFrameStyle(sheet.frameStyle);
            if (sheet.lineColor !== undefined)
                this.setLineColor(sheet.lineColor);
            if (sheet.lineWidth !== undefined)
                this.setLineWidth(sheet.lineWidth);
        }

    }
}

/////////////////PlotCanvas - subclass of AbstractCanvas//////////start
//PlotCanvas.inheritsFrom( AbstractCanvas );
//Define the PlotCanvas constructor
//function PlotCanvas(plot) {
class PlotCanvas extends AbstractCanvas {
    constructor(plot) {
        // Call the parent constructor, making sure (using Function#call)
        // that "this" is set correctly during the call
        //AbstractCanvas.call(this, plot.getCentralWidget().getElement() );
        super(plot.getCentralWidget().getElement());
    }
}
/////////////////PlotCanvas - subclass of AbstractCanvas//////////end

////////PlotContainerCanvas - subclass of AbstractCanvas//////////start
//PlotContainerCanvas.inheritsFrom( AbstractCanvas );
//Define the PlotContainerCanvas constructor
//function PlotContainerCanvas(plot) {
class PlotContainerCanvas extends AbstractCanvas {
    constructor(plot) {
        // Call the parent constructor, making sure (using Function#call)
        // that "this" is set correctly during the call
        //AbstractCanvas.call(this, plot.getCentralWidget().getElement().parent() );
        super(plot.getCentralWidget().getElement().parent());
    }
}
////////PlotContainerCanvas - subclass of AbstractCanvas//////////end
