'use strict';
//var LegendData = function(){
class LegendData {
    constructor() {
        var m_map = {};
        var m_empty = true;

        //! \return Value of the TitleRole attribute
        this.title = function () {
            return this.value(Static.TitleRole);
        }

        //! \return Value of the IconRole attribute
        this.icon = function () {
            return this.value(Static.IconRole);
        }

        //! \return Value of the ModeRole attribute
        this.mode = function () {
            if (this.hasRole(Static.ModeRole))
                return this.value(Static.ModeRole);
            return Static.ReadOnly;
        }

        this.setValue = function (role, val) {
            //m_data.push({role:role, value:val});
            m_map[role] = val;
            m_empty = false;
        }

        this.isValid = function () {
            return !m_empty;
        }

        /*!
        \param role Attribute role
        \return True, when the internal map has an entry for role
         */
        this.hasRole = function (role) {
            return contains(role);
        }

        this.value = function (role) {
            if (!contains(role))
                return null;
            return m_map[role];
        }

        function contains(role) {
            if (typeof(m_map[role]) === "undefined")
                return false;
            return true;
        }

        this.toString = function () {
            return '[LegendData]';
        }

    }
}
////////////////////////////////////////////end


/////////////////AbstractLegend//////////start

//var AbstractLegend = function(){
class AbstractLegend {
    constructor() {
        var m_plot = null;
        var m_checked = false;
        var m_legendDiv = null;
        var m_maxChar = ""; //number of characters in longest label
        var m_iconWidth = 0;
        var m_maxWidth = 100;
        var margin = 8;
        var m_checkChangeFn = function (plotItem, check) {
            plotItem.setVisible(!check);
            if (!m_plot.autoReplot())
                m_plot.replot();
        };

        if (typeof(checkChangeFn) !== "undefined")
            m_checkChangeFn = checkChangeFn;

        var m_itemList = [];

        var tbl = $('<table/>').attr({
                //id : tableElementId
            });

        this.setLegendDiv = function (div) {
            //div.css("z-index", 10000)
            //console.log(div.css("z-index"))
            m_legendDiv = div;
            m_legendDiv.append(tbl);
            m_legendDiv.css("overflow", "auto");

            /*m_legendDiv.on('contextmenu', function(e){
            e.preventDefault()
            })*/

        };

        /*this.hide = function(){
        if(m_legendDiv && m_plot){
        m_legendDiv.hide()
        m_plot.getLayout().updateLayout();
        m_plot.autoRefresh();
        }
        }

        this.show = function(){
        if(m_legendDiv && m_plot){
        m_legendDiv.show()
        m_plot.getLayout().updateLayout();
        m_plot.autoRefresh();
        }
        }*/

        this.setPlot = function (plot) {
            m_plot = plot;
        };

        this.isEmpty = function () {
            return tbl[0].rows.length >= 1 ? false : true;
        };

        this.setMaxWidth = function (width) {
            m_maxWidth = width;
            //m_plot.getLayout().updateLayout()
        }

        this.maxWidth = function () {
            return m_maxWidth;
        }

        this.legendDivWidth = function () {
            var w = m_plot.legendFont().textSize(m_maxChar).width + m_iconWidth + margin;
            return w < this.maxWidth() ? w : this.maxWidth();
        };

        this.addItem = function (plotItem, rowNumber) {
            var font = plotItem.plot().legendFont();

            var itemData = plotItem.legendData()[0];

            if (!itemData.isValid())
                return;

            var title = itemData.title();
            var icon = itemData.icon();

            if (icon && (icon.width() > m_iconWidth))
                m_iconWidth = icon.width();
            var row = $('<tr />');

            var tdElem = $('<td class="unchecked"></td>');

            var textLabel = $('<label />');
            textLabel.css("color", font.fontColor);
            textLabel.css("font-size", font.th);
            textLabel.text(" " + title);

            var spanElem = $('<span/>')
                if (icon)
                    icon.setParent(spanElem)
                    textLabel.appendTo(spanElem);
                spanElem.appendTo(tdElem);

            row.append(tdElem);

            tbl.append(row);

            if (rowNumber !== undefined && rowNumber > -1) {
                m_itemList.splice(rowNumber, 0, plotItem)
                Static.setElementIndex(row, rowNumber)
            } else {
                m_itemList.push(plotItem);
                //tbl.append(row);
            }

            tdElem.click(plotItem, function (event) {
                if ($(this).attr("class") === "unchecked") {
                    $(this).removeClass("unchecked");
                    $(this).addClass("checked");
                    m_checked = true;
                } else {
                    $(this).removeClass("checked");
                    $(this).addClass("unchecked");
                    m_checked = false;
                }
                if (m_checkChangeFn)
                    m_checkChangeFn(event.data, m_checked);
            });

            if (plotItem.title().length > m_maxChar.length)
                m_maxChar = plotItem.title();

        };

        function removeElementAt(index) {
            if (index > -1) {
                m_itemList.splice(index, 1);
            }
        }

        this.removeItem = function (plotItem) {
            var rowNumber = m_itemList.indexOf(plotItem);
            //alert(rowNumber)
            if (rowNumber < 0)
                return;
            removeElementAt(rowNumber);
            tbl[0].deleteRow(rowNumber);
            if (parseInt(tbl.css("height")) < parseInt(m_legendDiv.css("height"))) {
                m_legendDiv.css("overflow-y", "auto");
            }
            if (parseInt(tbl.css("width")) < parseInt(m_legendDiv.css("width"))) {
                m_legendDiv.css("overflow-x", "auto");
            }
            //if(tbl[0].rows.length <= 0)
            // tbl.hide();
            return rowNumber
        };

        this.clearLegend = function () {
            var numRows = tbl[0].rows.length;
            for (var i = 0; i < numRows; ++i) {
                tbl[0].deleteRow(0);
            }
        };

        this.rowNumberFromName = function (name) {
            var Rows = tbl[0].rows;
            for (var i = 0; i < Rows.length; ++i) {
                if (Rows[i].cells[0].innerHTML === name)
                    return i;
            }
            return -1; //not found
        };

        this.toString = function () {
            return '[AbstractLegend]';
        };
    }

    //Subclass overwrite this method.>>>>>>>>>>>>>
    //! \return True, when no plot item is inserted
    isEmpty() {
        return true;
    };
    //Subclass overwrite this method.
    /*!
    Render the legend into a given rectangle.

    \param painter Painter
    \param rect Bounding rectangle
    \param fillBackground When true, fill rect with the widget background

    \sa renderLegend() is used by QwtPlotRenderer
     */
    renderLegend(painter, rect, fillBackground) {
        return true;
    };
    //Subclass overwrite this method.
    /*!
    \brief Update the entries for a plot item

    \param itemInfo Info about an item
    \param data List of legend entry attributes for the  item
     */
    updateLegend(itemInfo, data) {};

}
//////////////////////////////////////////////////////end

//MLegend.inheritsFrom( AbstractLegend );
//function MLegend(callBack ){
class MLegend extends AbstractLegend {
    constructor(callBack) {
        //AbstractLegend.call(this, callBack);
        super(callBack);
        this.toString = function () {
            return '[MLegend]';
        }
    }
}

// class MLegend extends AbstractLegend{
//   constructor(callBack ){
//     super(callBack);
//     this.toString = function () {
//       return '[MLegend]';
//     };
//   }
// }

/*return MLegend;

});*/
