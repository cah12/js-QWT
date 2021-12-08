
'use strict';
class MSettings {
    constructor() {
        Static.silentIgnore = 0;
        Static.warnIgnore = 1;
        Static.warn = 2;
        Static.errorResponse = Static.warn;
        Static.errorResponseChanged = false;

        var fonts = [
            'Arial,Arial,Helvetica,sans-serif',
            'Arial Black,Arial Black,Gadget,sans-serif',
            'Comic Sans MS,Comic Sans MS,cursive',
            'Courier New,Courier New,Courier,monospace',
            'Georgia,Georgia,serif',
            'Impact,Charcoal,sans-serif',
            'Lucida Console,Monaco,monospace',
            'Lucida Sans Unicode,Lucida Grande,sans-serif',
            'Palatino Linotype,Book Antiqua,Palatino,serif',
            'Tahoma,Geneva,sans-serif',
            'Times New Roman,Times,serif',
            'Trebuchet MS,Helvetica,sans-serif',
            'Verdana,Geneva,sans-serif',
            'Gill Sans,Geneva,sans-serif'
        ];

        var m_plot = null;
        var PointEntryDlg = new MPointEntryDlg();

        this.shadeWatchArea = true;

        var m_dlg = $('<div class="modal fade" id="myModal" role="dialog">\
                <div class="modal-dialog">\
                \
                <div class="modal-content">\
                <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal">&times;</button>\
                <h4 class="modal-title">Plot Settings</h4>\
                </div>\
                <div class="modal-body">\
                <div class="panel-group" id="accordion">\
                \
                <div class="panel panel-default">\
                <div class="panel-heading">\
                <h4 class="panel-title">\
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">General Settings</a>\
                </h4>\
                </div>\
                <div id="collapse1" class="panel-collapse collapse in">\
                <div class="panel-body">\
                \
                <ul class="nav nav-tabs">\
                <li class="active"><a data-toggle="tab" href="#plotTitle">Title</a></li>\
                <li><a data-toggle="tab" href="#plotFooter">Footer</a></li>\
                <li><a data-toggle="tab" href="#plotBackground">Background</a></li>\
                <li><a data-toggle="tab" href="#plotLegend">Legend</a></li>\
                </ul>\
                <div class="tab-content">\
                <div id="plotTitle" class="tab-pane fade in active">\
                <div class="row">\
                <div class="col-sm-3">Plot Title:</div>\
                <input id="title" type="text" class="col-sm-9" value="Title"/>\
                </div>\
                \
                \
                <!--font start-->\
                <div class="row">\
                <br>\
                <div class="col-sm-1">Font:</div>\
                <div class="col-sm-4">\
                <select id="fontSelector">\
                <option value="Arial">Arial</option>\
                <option value="ArialBlack">Arial Black</option>\
                <option value="ComicSansMS">Comic Sans MS</option>\
                <option value="CourierNew">Courier New</option>\
                <option value="Georgia">Georgia</option>\
                <option value="Impact">Impact</option>\
                <option value="LucidaConsole">Lucida Console</option>\
                <option value="LucidaSansUnicode">Lucida Sans Unicode</option>\
                <option value="PalatinoLinotype">Palatino Linotype</option>\
                <option value="Tahoma">Tahoma</option>\
                <option value="TimesNewRoman">Times New Roman</option>\
                <option value="TrebuchetMS">Trebuchet MS</option>\
                <option value="Verdana">Verdana</option>\
                <option value="GillSans">Gill Sans</option>\
                </select>\
                </div>\
                <div class="col-sm-1">Color:</div>\
                <div class="col-sm-2">\
                <input type="color" id="colorTitle">\
                </div>\
                <div class="col-sm-2">Font size:</div>\
                <div class="col-sm-1">\
                <select id="pointSelector">\
                <option value="6">6</option>\
                <option value="7">7</option>\
                <option value="8">8</option>\
                <option value="9">9</option>\
                <option value="10">10</option>\
                <option value="11">11</option>\
                <option value="12">12</option>\
                <option value="13">13</option>\
                <option value="14">14</option>\
                <option value="15">15</option>\
                <option value="16">16</option>\
                <option value="17">17</option>\
                <option value="18">18</option>\
                <option value="19">19</option>\
                <option value="20">20</option>\
                <option value="21">21</option>\
                <option value="22">22</option>\
                <option value="23">23</option>\
                <option value="24">24</option>\
                <option value="25">25</option>\
                <option value="26">26</option>\
                <option value="27">27</option>\
                <option value="28">28</option>\
                <option value="29">29</option>\
                <option value="30">30</option>\
                <option value="31">31</option>\
                <option value="32">32</option>\
                </select>\
                </div>\
                </div>\
                <div class="row">\
                <div class="col-sm-7">\
                <form role="form">\
                <label class="noSelect"><input id="bold_title" type="checkbox" checked name="bold">Bold</label><span> </span>\
                </form>\
                </div>\
                <div class="col-sm-4">\
                </div>\
                </div>\
                <!--font end-->\
                \
                \
                </div>\
                <div id="plotFooter" class="tab-pane fade">\
                <div class="row">\
                <div class="col-sm-3">Plot Footer:</div>\
                <input id="footer" type="text" class="col-sm-9" value="Footer"/>\
                </div>\
                <div class="row">\
                <br>\
                <div class="col-sm-1">Font:</div>\
                <div class="col-sm-4">\
                <select id="fontSelector_footer">\
                <option value="Arial">Arial</option>\
                <option value="ArialBlack">Arial Black</option>\
                <option value="ComicSansMS">Comic Sans MS</option>\
                <option value="CourierNew">Courier New</option>\
                <option value="Georgia">Georgia</option>\
                <option value="Impact">Impact</option>\
                <option value="LucidaConsole">Lucida Console</option>\
                <option value="LucidaSansUnicode">Lucida Sans Unicode</option>\
                <option value="PalatinoLinotype">Palatino Linotype</option>\
                <option value="Tahoma">Tahoma</option>\
                <option value="TimesNewRoman">Times New Roman</option>\
                <option value="TrebuchetMS">Trebuchet MS</option>\
                <option value="Verdana">Verdana</option>\
                <option value="GillSans">Gill Sans</option>\
                </select>\
                </div>\
                <div class="col-sm-1">Color:</div>\
                <div class="col-sm-2">\
                <input type="color" id="colorSelector_footer">\
                </div>\
                <div class="col-sm-2">Font size:</div>\
                <div class="col-sm-1">\
                <select id="pointSelector_footer">\
                <option value="6">6</option>\
                <option value="7">7</option>\
                <option value="8">8</option>\
                <option value="9">9</option>\
                <option value="10">10</option>\
                <option value="11">11</option>\
                <option value="12">12</option>\
                <option value="13">13</option>\
                <option value="14">14</option>\
                <option value="15">15</option>\
                <option value="16">16</option>\
                <option value="17">17</option>\
                <option value="18">18</option>\
                <option value="19">19</option>\
                <option value="20">20</option>\
                <option value="21">21</option>\
                <option value="22">22</option>\
                <option value="23">23</option>\
                <option value="24">24</option>\
                <option value="25">25</option>\
                <option value="26">26</option>\
                <option value="27">27</option>\
                <option value="28">28</option>\
                <option value="29">29</option>\
                <option value="30">30</option>\
                <option value="31">31</option>\
                <option value="32">32</option>\
                </select>\
                </div>\
                </div>\
                <div class="row">\
                <div class="col-sm-7">\
                <form role="form">\
                <label class="noSelect"><input id="bold_footer" type="checkbox" checked name="bold">Bold</label><span> </span>\
                </form>\
                </div>\
                <div class="col-sm-4">\
                <!--div class="col-sm-8">Font Size:</div>\
                <select id="pointSelector_footer">\
                <option value="6">6</option>\
                <option value="7">7</option>\
                <option value="8">8</option>\
                <option value="9">9</option>\
                <option value="10">10</option>\
                <option value="11">11</option>\
                <option value="12">12</option>\
                <option value="13">13</option>\
                <option value="14">14</option>\
                <option value="15">15</option>\
                <option value="16">16</option>\
                <option value="17">17</option>\
                <option value="18">18</option>\
                <option value="19">19</option>\
                <option value="20">20</option>\
                <option value="21">21</option>\
                <option value="22">22</option>\
                <option value="23">23</option>\
                <option value="24">24</option>\
                <option value="25">25</option>\
                <option value="26">26</option>\
                <option value="27">27</option>\
                <option value="28">28</option>\
                <option value="29">29</option>\
                <option value="30">30</option>\
                <option value="31">31</option>\
                <option value="32">32</option>\
                </select-->\
                </div>\
                </div>\
                </div>\
                <div id="plotBackground" class="tab-pane fade">\
                <div class="row">\
                <br>\
                <div class="col-sm-4">Background color:</div>\
                <div class="col-sm-2">\
                <input type="color" id= "colorSelector_background">\
                </div>\
                </div>\
                </div>\
                \
                <div id="plotLegend" class="tab-pane fade">\
                <div class="row">\
                <br>\
                <div class="col-sm-3">Background:</div>\
                <div class="col-sm-2">\
                <input type="color" id= "colorSelector_legend" value="#ffffff">\
                </div>\
                </div>\
                <div class="row">\
                <div class="col-sm-3">Show line:</div>\
                <div class="col-sm-2">\
                <input type="checkbox" id= "showline">\
                </div>\
                </div>\
                <div class="row">\
                <div class="col-sm-3">Show symbol:</div>\
                <div class="col-sm-2">\
                <input type="checkbox" id= "showsymbol">\
                </div>\
                </div>\
                </div>\
                \
                </div>\
                </div>\
                </div>\
                </div>\
                \
                \
                <div class="panel panel-default">\
                <div class="panel-heading">\
                <h4 class="panel-title">\
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">Scale Settings</a>\
                </h4>\
                </div>\
                <div id="collapse2" class="panel-collapse collapse">\
                <div class="panel-body">\
                <ul class="nav nav-tabs">\
                <li class="active"><a data-toggle="tab" href="#title_scale">Title</a></li>\
                <li><a data-toggle="tab" href="#type">Type</a></li>\
                <li><a data-toggle="tab" href="#user">Limits</a></li>\
                <li><a data-toggle="tab" href="#exponent">Exp notation</a></li>\
                <li><a data-toggle="tab" href="#margins">Margins</a></li>\
                <li><a data-toggle="tab" href="#components">Components</a></li>\
                </ul>\
                <div class="tab-content">\
                \
                <div id="title_scale" class="tab-pane fade in active">\
                <div class="row">\
                <div class="col-sm-2">Bottom:</div>\
                <input id="bottomScale_title" type="text" class="col-sm-3" value=""/>\
                <div class="col-sm-2">Top:</div>\
                <input id="topScale_title" type="text" class="col-sm-3" value=""/>\
                </div>\
                <div class="row">\
                <div class="col-sm-2">Left:</div>\
                <input id="leftScale_title" type="text" class="col-sm-3" value=""/>\
                <div class="col-sm-2">Right:</div>\
                <input id="rightScale_title" type="text" class="col-sm-3" value=""/>\
                </div>\
                <!--font start-->\
                <div class="row">\
                <br>\
                <div class="col-sm-1">Font:</div>\
                <div class="col-sm-4">\
                <select id="axisTitleFontSelector">\
                <option value="Arial">Arial</option>\
                <option value="ArialBlack">Arial Black</option>\
                <option value="ComicSansMS">Comic Sans MS</option>\
                <option value="CourierNew">Courier New</option>\
                <option value="Georgia">Georgia</option>\
                <option value="Impact">Impact</option>\
                <option value="LucidaConsole">Lucida Console</option>\
                <option value="LucidaSansUnicode">Lucida Sans Unicode</option>\
                <option value="PalatinoLinotype">Palatino Linotype</option>\
                <option value="Tahoma">Tahoma</option>\
                <option value="TimesNewRoman">Times New Roman</option>\
                <option value="TrebuchetMS">Trebuchet MS</option>\
                <option value="Verdana">Verdana</option>\
                <option value="GillSans">Gill Sans</option>\
                </select>\
                </div>\
                <div class="col-sm-1">Color:</div>\
                <div class="col-sm-2">\
                <input type="color" id="axisColorTitle">\
                </div>\
                <div class="col-sm-2">Font size:</div>\
                <div class="col-sm-1">\
                <select id="axisTitlePointSelector">\
                <option value="6">6</option>\
                <option value="7">7</option>\
                <option value="8">8</option>\
                <option value="9">9</option>\
                <option value="10">10</option>\
                <option value="11">11</option>\
                <option value="12">12</option>\
                <option value="13">13</option>\
                <option value="14">14</option>\
                <option value="15">15</option>\
                <option value="16">16</option>\
                <option value="17">17</option>\
                <option value="18">18</option>\
                <option value="19">19</option>\
                <option value="20">20</option>\
                <option value="21">21</option>\
                <option value="22">22</option>\
                <option value="23">23</option>\
                <option value="24">24</option>\
                <option value="25">25</option>\
                <option value="26">26</option>\
                <option value="27">27</option>\
                <option value="28">28</option>\
                <option value="29">29</option>\
                <option value="30">30</option>\
                <option value="31">31</option>\
                <option value="32">32</option>\
                </select>\
                </div>\
                </div>\
                <div class="row">\
                <div class="col-sm-7">\
                <form role="form">\
                <label class="noSelect"><input id="axis_bold_title" type="checkbox" name="bold">Bold</label><span> </span>\
                </form>\
                </div>\
                <div class="col-sm-4">\
                </div>\
                </div>\
                <!--font end-->\
                </div>\
                \
                \
                <div id="type" class="tab-pane fade">\
                <div class="row">\
                <div class="col-sm-2">Bottom:</div>\
                <div class="col-sm-20">\
                <form role="form">\
                <label class="radio-inline">\
                <input id="bottom_linear" type="radio" checked name="optradio">Linear\
                </label>\
                <label class="radio-inline">\
                <input id="bottom_log" type="radio" name="optradio">Log\
                </label>\
                <label class="radio-inline">\
                Base \
                <input id="bottom_logBase" type="number" min=2 max=10 value=10 readonly=true>\
                <span> </span>\
                Decimal \
                <input id="bottom_decimalPlaces" type="number" min=0 max=10 value=3>\
                </label>\
                </form>\
                </div>\
                </div>\
                <div class="row">\
                <div class="col-sm-2">Top:</div>\
                <div class="col-sm-20">\
                <form role="form">\
                <label class="radio-inline">\
                <input id="top_linear" type="radio" checked name="optradio">Linear\
                </label>\
                <label class="radio-inline">\
                <input id="top_log" type="radio" name="optradio">Log\
                </label>\
                <label class="radio-inline">\
                Base \
                <input id="top_logBase" type="number" min=2 max=10 value=10 readonly=true>\
                <span> </span>\
                Decimal \
                <input id="top_decimalPlaces" type="number" min=0 max=10 value=3>\
                </label>\
                </form>\
                </div>\
                </div>\
                <div class="row">\
                <div class="col-sm-2">Left:</div>\
                <div class="col-sm-20">\
                <form role="form">\
                <label class="radio-inline">\
                <input id="left_linear" type="radio" checked name="optradio">Linear\
                </label>\
                <label class="radio-inline">\
                <input id="left_log" type="radio" name="optradio">Log\
                </label>\
                <label class="radio-inline">\
                Base \
                <input id="left_logBase" type="number" min=2 max=10 value=10 readonly=true>\
                <span> </span>\
                Decimal \
                <input id="left_decimalPlaces" type="number" min=0 max=10 value=3>\
                </label>\
                </form>\
                </div>\
                </div>\
                <div class="row">\
                <div class="col-sm-2">Right:</div>\
                <div class="col-sm-20">\
                <form role="form">\
                <label class="radio-inline">\
                <input id="right_linear" type="radio" checked name="optradio">Linear\
                </label>\
                <label class="radio-inline">\
                <input id="right_log" type="radio" name="optradio">Log\
                </label>\
                <label class="radio-inline">\
                Base \
                <input id="right_logBase" type="number" min=2 max=10 value=10 readonly=true>\
                <span> </span>\
                Decimal \
                <input id="right_decimalPlaces" type="number" min=0 max=10 value=3>\
                </label>\
                </form>\
                </div>\
                </div>\
                </div>\
                \
                <div id="exponent" class="tab-pane fade">\
                <div class="row">\
                <br>\
                <div class="col-sm-8">Use exponent notation for values less than:</div>\
                <input id="exponent_lower" type="number" max=0 value=-10000>\
                <br>\
                <div class="col-sm-8">Use exponent notation for values greater than:</div>\
                <input id="exponent_upper" type="number" min=0 value=10000>\
                </div>\
                </div>\
                \
                <div id="margins" class="tab-pane fade">\
                <div class="row">\
                <br>\
                <div class="col-sm-4">Left axis:</div>\
                <input id="margin_left" type="number" min= 0.0 value=0.0>\
                <br>\
                <div class="col-sm-4">Right axis:</div>\
                <input id="margin_right" type="number" min= 0.0 value=0.0>\
                <br>\
                <div class="col-sm-4">Bottom axis:</div>\
                <input id="margin_bottom" type="number" min= 0.0 value=0.0>\
                <br>\
                <div class="col-sm-4">Top:</div>\
                <input id="margin_top" type="number" min= 0.0 value=0.0>\
                </div>\
                </div>\
                \
                <div id="components" class="tab-pane fade">\
                <div class="row">\
                <br>\
                <div class="col-sm-4">\
                Show backbone: <input type="checkbox" checked id= "show_backbone"></div>\
                <div class="col-sm-4">\
                Show labels: <input type="checkbox" checked id= "show_labels"></div>\
                <div class="col-sm-4">\
                Show ticks: <input type="checkbox" checked id= "show_ticks"></div>\
                <br>\
                <div id="tickLengthRow">\
                <div class="col-sm-4">Tick length: \
                <select id= "tick_length">\
                <option value="small">Small</option>\
                <option value="medium" selected>Medium</option>\
                <option value="large">Large</option>\
                </select></div>\
                </div>\
                </div>\
                </div>\
                \
                <div id="user" class="tab-pane fade">\
                <div class="row">\
                <div class="col-sm-4">Enable user scale:</div>\
                <input id="enableUserScale" type="checkbox">\
                </div>\
                <div class="row">\
                <div class="col-sm-2">Bottom:</div>\
                <div class="col-sm-1">min:</div>\
                <input id="bottom_min" type="text" readonly value=0> max:\
                <input id="bottom_max" type="text" readonly value=1000>\
                </div>\
                <div class="row">\
                <div class="col-sm-2">Left:</div>\
                <div class="col-sm-1">min:</div>\
                <input id="left_min" type="text" readonly value=0> max:\
                <input id="left_max" type="text" readonly value=1000>\
                </div>\
                <div class="row">\
                <div class="col-sm-2">Top:</div>\
                <div class="col-sm-1">min:</div>\
                <input id="top_min" type="text" readonly value=0> max:\
                <input id="top_max" type="text" readonly value=1000>\
                </div>\
                <div class="row">\
                <div class="col-sm-2">Right:</div>\
                <div class="col-sm-1">min:</div>\
                <input id="right_min" type="text" readonly value=0> max:\
                <input id="right_max" type="text" readonly value=1000>\
                </div>\
                </div>\
                \
                </div>\
                </div>\
                </div>\
                </div>\
                \
                \
                <div class="panel panel-default">\
                <div class="panel-heading">\
                <h4 class="panel-title">\
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse4">Point selection Settings</a>\
                </h4>\
                </div>\
                <div id="collapse4" class="panel-collapse collapse">\
                <div class="panel-body">\
                <div class="col-sm-5">When a point is selected</div>\
                <select id="point_selection">\
                <option value="display_data">display data</option>\
                <option value="remove_it">remove it</option>\
                <option value="modify_it">modify it</option>\
                </select>\
                <br>\
                <br>\
                </div>\
                </div>\
                </div>\
                \
                \
                <div class="panel panel-default">\
                <div class="panel-heading">\
                <h4 class="panel-title">\
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse14">Error Settings</a>\
                </h4>\
                </div>\
                <div id="collapse14" class="panel-collapse collapse">\
                <div class="panel-body">\
                <div class="col-sm-5">When an error occurs,</div>\
                <select id="errorResponse">\
                <option value="stopWarn">stop and warn</option>\
                <option value="silentIgnore">silently ignore</option>\
                <option value="warnIgnore">allow for ignore</option>\
                </select>\
                <br>\
                <br>\
                </div>\
                </div>\
                </div>\
                \
                \
                <div class="panel panel-default">\
                <div class="panel-heading">\
                <h4 class="panel-title">\
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse7">Zoomer Settings</a>\
                </h4>\
                </div>\
                <div id="collapse7" class="panel-collapse collapse">\
                <div class="panel-body">\
                <div>Zoom according to:</div>\
                <br>\
                <div class="col-sm-2">Horizontal:</div>\
                <select id="axisHorizontal">\
                <option value="bottomAxis">Bottom axis</option>\
                <option value="topAxis">Top axis</option>\
                </select>\
                <br>\
                <br>\
                <div class="col-sm-2">Vertical:</div>\
                <select id="axisVertical">\
                <option value="leftAxis">Left axis</option>\
                <option value="rightAxis">Right axis</option>\
                </select>\
                </div>\
                </div>\
                </div>\
                \
                \
                <div class="panel panel-default">\
                <div class="panel-heading">\
                <h4 class="panel-title">\
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse5">Magnifier Settings</a>\
                </h4>\
                </div>\
                <div id="collapse5" class="panel-collapse collapse">\
                <div class="panel-body">\
                <div>Enabled axes.</div>\
                <br>\
                <div class="col-sm-1">Left:</div>\
                <input id= "leftAxis" type="checkbox" checked class="col-sm-1"/>\
                <div class="col-sm-1">Right:</div>\
                <input id= "rightAxis" type="checkbox" class="col-sm-1"/>\
                <div class="col-sm-1">Bottom:</div>\
                <input id= "bottomAxis" type="checkbox" checked class="col-sm-1"/>\
                <div class="col-sm-1">Top:</div>\
                <input id= "topAxis" type="checkbox" class="col-sm-1"/>\
                </div>\
                </div>\
                </div>\
                \
                \
                <div class="panel panel-default">\
                <div class="panel-heading">\
                <h4 class="panel-title">\
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse9">Watch Settings</a>\
                </h4>\
                </div>\
                <div id="collapse9" class="panel-collapse collapse">\
                <div class="panel-body">\
                <div>Calculation accuracy.</div>\
                <br>\
                <div class="col-sm-1">Low:</div>\
                <input id= "lowAccuracy" type="radio" name="accuracy" value= "lowAccuracy" class="col-sm-1"/>\
                <div class="col-sm-2">Moderate:</div>\
                <input id= "moderateAccuracy" type="radio" name="accuracy" value= "moderateAccuracy" checked class="col-sm-1"/>\
                <div class="col-sm-1">High:</div>\
                <input id= "highAccuracy" type="radio" name="accuracy" value= "highAccuracy" class="col-sm-1"/>\
                <br>\
                <br>\
                <div>Shading.</div>\
                <br>\
                <div class="col-sm-4">Shade Watch Area:</div>\
                <input id= "watchArea" type="checkbox" checked class="col-sm-1"/>\
                <div id= "shadeColorDiv">\
                <div class="col-sm-3">Shade color:</div>\
                <div class="col-sm-2">\
                <input type="color" id="shadeColor" value="#a9a9a9">\
                </div>\
                </div>\
                </div>\
                </div>\
                </div>\
                \
                \
                <div class="panel panel-default">\
                <div class="panel-heading">\
                <h4 class="panel-title">\
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse3">Grid Settings</a>\
                </h4>\
                </div>\
                <div id="collapse3" class="panel-collapse collapse">\
                <div class="panel-body">\
                <ul class="nav nav-tabs">\
                <li class="active"><a data-toggle="tab" href="#minor">Minor lines</a></li>\
                <li><a data-toggle="tab" href="#major">Major lines</a></li>\
                <li><a data-toggle="tab" href="#gridAxes">Grid axes</a></li>\
                </ul>\
                <div class="tab-content">\
                <div id="minor" class="tab-pane fade in active">\
                <div class="row">\
                <br>\
                <div class="col-sm-1">Show:</div>\
                <input id="minor_gridLines" type="checkbox" checked class="col-sm-1"/>\
                </div>\
                <div class="row">\
                <br>\
                <div class="col-sm-8">Maximum number of minor divisions per major division:</div>\
                <input id="minor_divisions" type="number" class="col-sm-2" min=2 max=20 value="5"/>\
                </div>\
                <div class="row">\
                <br>\
                <div class="col-sm-2">Color:</div>\
                <input id="minor_line_color" type="color" class="col-sm-2"/>\
                </div>\
                </div>\
                <div id="gridAxes" class="tab-pane fade">\
                <div>Draw gridlines according to:</div>\
                <br>\
                <div class="col-sm-2">Horizontal:</div>\
                <select id="gridAxisHorizontal">\
                <option value="bottomAxis">Bottom axis</option>\
                <option value="topAxis">Top axis</option>\
                </select>\
                <br>\
                <br>\
                <div class="col-sm-2">Vertical:</div>\
                <select id="gridAxisVertical">\
                <option value="leftAxis">Left axis</option>\
                <option value="rightAxis">Right axis</option>\
                </select>\
                </div>\
                <div id="major" class="tab-pane fade">\
                <div class="row">\
                <br>\
                <div class="col-sm-1">Show:</div>\
                <input id="major_gridLines" type="checkbox" checked class="col-sm-1"/>\
                </div>\
                <div class="row">\
                <br>\
                <div class="col-sm-6">Maximum number of major divisions:</div>\
                <div class="col-sm-2">\
                <form role="form">\
                <input input id="major_divisions" type="number" min=1 max=40 value="8">\
                </div>\
                </div>\
                <div class="row">\
                <br>\
                </div>\
                <div class="row">\
                <div class="col-sm-1">Color:</div>\
                <div class="col-sm-10">\
                <form role="form">\
                <input id="major_line_color" type="color">\
                </div>\
                </div>\
                </div>\
                </div>\
                </div>\
                </div>\
                </div>\
                </div>\
                </div>\
                <div class="modal-footer">\
                <button id="okButton" type="button" class="btn btn-default" data-dismiss="modal">Ok</button>\
                </div\
                </div>\
                </div>\
                </div>');

        function setReadonly(on) {
            $("#bottom_min").attr("readonly", on);
            $("#bottom_max").attr("readonly", on);
            $("#left_min").attr("readonly", on);
            $("#left_max").attr("readonly", on);
            $("#top_min").attr("readonly", on);
            $("#top_max").attr("readonly", on);
            $("#right_min").attr("readonly", on);
            $("#right_max").attr("readonly", on);

        }

        this.setPlot = function (plot) {
            m_plot = plot;
            var self = this;

            if (m_plot) {
                $("body").append(m_dlg);
                var titleFont = m_plot.titleFont();
                var axisTitleFont = m_plot.axisTitleFont(xBottom);
                var axisLabelFont = null;
                var userScale = false;

                function setAxisTitleFont() {
                    axisLabelFont = m_plot.axisLabelFont(xBottom);
                    axisLabelFont.th = axisTitleFont.th * 0.86;
                    setAxisLabelFont();
                    m_plot.setAxisTitleFont(xBottom, axisTitleFont);
                    m_plot.setAxisTitleFont(xTop, axisTitleFont);
                    m_plot.setAxisTitleFont(yLeft, axisTitleFont);
                    m_plot.setAxisTitleFont(yRight, axisTitleFont);

                }
                function setAxisLabelFont() {
                    m_plot.setAxisLabelFont(xBottom, axisLabelFont);
                    m_plot.setAxisLabelFont(xTop, axisLabelFont);
                    m_plot.setAxisLabelFont(yLeft, axisLabelFont);
                    m_plot.setAxisLabelFont(yRight, axisLabelFont);

                }

                ////////////////////////////////////////////////
                $("#axisHorizontal").change(function () {
                    if ($(this).val() == "bottomAxis") {
                        m_plot.zoomer.setAxis(xBottom, m_plot.zoomer.yAxis());
                        //Static.trigger("axisChanged", xBottom);
                    } else {
                        m_plot.zoomer.setAxis(xTop, m_plot.zoomer.yAxis());
                        //Static.trigger("axisChanged", xTop)
                    }

                })

                $("#errorResponse").change(function () {
                    if ($(this).val() == "silentIgnore") {
                        Static.errorResponse = Static.silentIgnore;
                    } else if ($(this).val() == "warnIgnore") {
                        Static.errorResponse = Static.warnIgnore;
                    } else { //stopWarn
                        Static.errorResponse = Static.warn;
                    }

                })

                $("#point_selection").change(function () {
                    if ($(this).val() == "remove_it") {
                        m_plot.curveClosestPoint.setCb(function (curve, point) {
                            curve.removePoint(point)
                        });
                    } else if ($(this).val() == "modify_it") {
                        m_plot.curveClosestPoint.setCb(function (curve, point) {
                            PointEntryDlg.pointEntryCb(m_plot, curve.title(), point);
                        });
                    } else {
                        m_plot.curveClosestPoint.setCb(null);
                    }

                })

                $("input[name*='accuracy']").change(function () {
                    var radios = document.getElementsByName('accuracy');

                    for (var i = 0, length = radios.length; i < length; i++) {
                        if (radios[i].checked) {
                            // do whatever you want with the checked radio
                            if (radios[i].value == "lowAccuracy") {
                                Static.accuracyMaxSteps = Static.accuracyBase * 0.5 * 0.5;
                            } else if (radios[i].value == "moderateAccuracy") {
                                Static.accuracyMaxSteps = Static.accuracyBase * 0.5;
                            } else {
                                Static.accuracyMaxSteps = Static.accuracyBase;
                            }
                            Static.trigger("positionChanged"); //Force update of sidebar

                            // only one radio can be logically checked, don't check the rest
                            break;
                        }
                    }
                })

                $("#axisVertical").change(function () {
                    if ($(this).val() == "leftAxis") {
                        m_plot.zoomer.setAxis(m_plot.zoomer.xAxis(), yLeft);
                        //Static.trigger("axisChanged", yLeft)
                    } else {
                        m_plot.zoomer.setAxis(m_plot.zoomer.xAxis(), yRight);
                        //Static.trigger("axisChanged", yRight)
                    }

                })

                $("#watchArea").change(function () {
                    self.shadeWatchArea = this.checked;
                    $("#shadeColorDiv").toggle(this.checked);
                    Static.trigger("shadeWatchArea", self.shadeWatchArea);
                });
                $("#shadeColor").change(function () {
                    Static.trigger("curveShapeColorChanged", $("#shadeColor")[0].value);

                });

                $("#leftAxis").change(function () {
                    //Static.showsymbol = this.checked
                    m_plot.magnifier.setAxisEnabled(yLeft, this.checked);

                });
                $("#rightAxis").change(function () {
                    //Static.showsymbol = this.checked
                    m_plot.magnifier.setAxisEnabled(yRight, this.checked);

                });
                $("#bottomAxis").change(function () {
                    //Static.showsymbol = this.checked
                    m_plot.magnifier.setAxisEnabled(xBottom, this.checked);

                });
                $("#topAxis").change(function () {
                    //Static.showsymbol = this.checked
                    m_plot.magnifier.setAxisEnabled(xTop, this.checked);

                });
                $("#minor_divisions").change(function () {
                    //Static.showsymbol = this.checked
                    var value = Math.min(Math.max(2, $(this).val()), 20);
                    $("#minor_divisions").val(value);
                    //console.log(value)
                    m_plot.setAxisMaxMinor(yLeft, value);
                    m_plot.setAxisMaxMinor(yRight, value);
                    m_plot.setAxisMaxMinor(xTop, value);
                    m_plot.setAxisMaxMinor(xBottom, value);

                })
                $("#major_divisions").change(function () {
                    //Static.showsymbol = this.checked
                    var value = Math.min(Math.max(1, $(this).val()), 40);
                    $("#major_divisions").val(value);
                    m_plot.setAxisMaxMajor(yLeft, $(this).val());
                    m_plot.setAxisMaxMajor(yRight, $(this).val());
                    m_plot.setAxisMaxMajor(xTop, $(this).val());
                    m_plot.setAxisMaxMajor(xBottom, $(this).val());

                })
                $("#minor_line_color").change(function () {
                    var grid = m_plot.itemList(Static.Rtti_PlotGrid)[0];
                    grid.setMinorPen($("#minor_line_color")[0].value);
                });
                $("#major_line_color").change(function () {
                    var grid = m_plot.itemList(Static.Rtti_PlotGrid)[0];
                    grid.setMajorPen($("#major_line_color")[0].value);
                });
                $("#major_gridLines").click(function () {
                    var grid = m_plot.itemList(Static.Rtti_PlotGrid)[0];
                    Utility.majorGridLines(grid, $(this)[0].checked);
                    $("#minor_gridLines").prop('checked', $(this)[0].checked);
                });
                $("#minor_gridLines").click(function () {
                    var grid = m_plot.itemList(Static.Rtti_PlotGrid)[0];
                    Utility.minorGridLines(grid, $(this)[0].checked);
                }); //gridAxisHorizontal

                $("#gridAxisVertical").change(function () {
                    var grid = m_plot.itemList(Static.Rtti_PlotGrid)[0]
                        if ($(this).val() == "leftAxis") {
                            grid.setYAxis(yLeft);
                            //Static.trigger("axisChanged", yLeft)
                        } else {
                            grid.setYAxis(yRight);
                            //Static.trigger("axisChanged", yRight)
                        }

                })

                $("#gridAxisHorizontal").change(function () {
                    var grid = m_plot.itemList(Static.Rtti_PlotGrid)[0]
                        if ($(this).val() == "bottomAxis") {
                            grid.setXAxis(xBottom);
                            //Static.trigger("axisChanged", yLeft)
                        } else {
                            grid.setXAxis(xTop);
                            //Static.trigger("axisChanged", yRight)
                        }

                })

                ////////////////////////////////////////////////////////////////////
                $("#margin_left").change(function () {
                    var margin = 0;
                    var scaleEngine = m_plot.axisScaleEngine(yLeft)
                        if (scaleEngine instanceof LogScaleEngine) {
                            var scaleDiv = m_plot.axisScaleDiv(yLeft);
                            //margin = (Static.mLog(scaleEngine.base(), scaleDiv.upperBound()) - Static.mLog(scaleEngine.base(), scaleDiv.lowerBound()))*$(this).val()/100;
                            margin = Static.mLog(scaleEngine.base(), $(this).val());
                        } else {
                            var intvY = m_plot.axisInterval(yLeft);
                            //margin = intvY.width()*$(this).val()/100;
                            margin = $(this).val();
                        }
                        m_plot.axisScaleEngine(yLeft).setMargins(margin, margin);
                    m_plot.autoRefresh();
                });

                $("#margin_right").change(function () {
                    var margin = 0;
                    var scaleEngine = m_plot.axisScaleEngine(yRight);
                    if (scaleEngine instanceof LogScaleEngine) {
                        var scaleDiv = m_plot.axisScaleDiv(yRight);
                        //margin = (Static.mLog(scaleEngine.base(), scaleDiv.upperBound()) - Static.mLog(scaleEngine.base(), scaleDiv.lowerBound()))*$(this).val()/100;
                        margin = Static.mLog(scaleEngine.base(), $(this).val());
                    } else {
                        var intvY = m_plot.axisInterval(yRight);
                        //margin = intvY.width()*$(this).val()/100;
                        margin = $(this).val();
                    }
                    m_plot.axisScaleEngine(yRight).setMargins(margin, margin);
                    m_plot.autoRefresh();
                });

                $("#margin_bottom").change(function () {
                    var margin = 0;
                    var scaleEngine = m_plot.axisScaleEngine(xBottom);
                    if (scaleEngine instanceof LogScaleEngine) {
                        var scaleDiv = m_plot.axisScaleDiv(xBottom);

                        margin = Static.mLog(scaleEngine.base(), $(this).val());
                    } else {
                        var intvY = m_plot.axisInterval(xBottom);
                        //margin = intvY.width()*$(this).val()/100;
                        margin = $(this).val();
                    }
                    m_plot.axisScaleEngine(xBottom).setMargins(margin, margin);
                    m_plot.autoRefresh();
                });

                $("#margin_top").change(function () {
                    var margin = 0;
                    var scaleEngine = m_plot.axisScaleEngine(xTop);
                    if (scaleEngine instanceof LogScaleEngine) {
                        var scaleDiv = m_plot.axisScaleDiv(xTop);

                        margin = Static.mLog(scaleEngine.base(), $(this).val());
                    } else {
                        var intvY = m_plot.axisInterval(xTop);
                        //margin = intvY.width()*$(this).val()/100;
                        margin = $(this).val();
                    }
                    m_plot.axisScaleEngine(xTop).setMargins(margin, margin);
                    m_plot.autoRefresh();
                });

                $("#exponent_lower").change(function () {
                    //console.log($(this).val())
                    m_plot.setNonExponentNotationLimits($(this).val(), $("#exponent_upper").val());
                });

                $("#exponent_upper").change(function () {
                    //console.log($(this).val())
                    m_plot.setNonExponentNotationLimits($("#exponent_lower").val(), $(this).val());
                });

                ////////////axis font////
                $("#axis_bold_title").click(function () {
                    if ($(this)[0].checked) {
                        axisTitleFont.weight = "bold";
                    } else {
                        axisTitleFont.weight = "normal";
                    }
                    setAxisTitleFont();
                });
                $("#axisColorTitle").change(function () {
                    axisTitleFont.fontColor = $("#axisColorTitle")[0].value;

                    setAxisTitleFont();

                    //levelChanged({obj:self, levelIndex:this.selectedIndex, levelName:pollInfo.propValue});
                });
                $("#axisTitleFontSelector").change(function () {
                    axisTitleFont.name = fonts[this.selectedIndex];
                    setAxisTitleFont();
                });
                $("#axisTitlePointSelector").change(function () {
                    axisTitleFont.th = parseInt($(this[this.selectedIndex]).val());
                    setAxisTitleFont();
                });
                /////////////////


                $("#bold_title").click(function () {
                    if ($(this)[0].checked) {
                        titleFont.weight = "bold";
                    } else {
                        titleFont.weight = "normal";
                    }
                    m_plot.setTitleFont(titleFont);
                });

                $("#bold_footer").click(function () {
                    if ($(this)[0].checked) {
                        footerFont.weight = "bold";
                    } else {
                        footerFont.weight = "normal";
                    }
                    m_plot.setFooterFont(footerFont);
                });

                $("#colorTitle").change(function () {
                    //var titleFont = m_plot.titleFont();
                    titleFont.fontColor = $("#colorTitle")[0].value;
                    m_plot.setTitleFont(titleFont);

                    //levelChanged({obj:self, levelIndex:this.selectedIndex, levelName:pollInfo.propValue});
                });

                $("#fontSelector").change(function () {
                    //var titleFont = m_plot.titleFont();
                    titleFont.name = fonts[this.selectedIndex];
                    m_plot.setTitleFont(titleFont);
                });

                $("#pointSelector").change(function () {
                    //var titleFont = m_plot.titleFont();
                    titleFont.th = $(this[this.selectedIndex]).val();
                    m_plot.setTitleFont(titleFont);
                });

                $("#colorSelector_footer").change(function () {
                    var footerFont = m_plot.footerFont();
                    footerFont.fontColor = $("#colorSelector_footer")[0].value;
                    m_plot.setFooterFont(footerFont);

                    //levelChanged({obj:self, levelIndex:this.selectedIndex, levelName:pollInfo.propValue});
                });

                $("#colorSelector_background").change(function () {

                    m_plot.setPlotBackground($("#colorSelector_background")[0].value);

                    //levelChanged({obj:self, levelIndex:this.selectedIndex, levelName:pollInfo.propValue});
                });

                $("#colorSelector_legend").change(function () {
                    var table = m_plot.getLayout().getLegendDiv().children()[0]
                        $(table).css("background-color",
                            $("#colorSelector_legend")[0].value);

                });

                $("#fontSelector_footer").change(function () {
                    var footerFont = m_plot.footerFont();
                    footerFont.name = fonts[this.selectedIndex];
                    m_plot.setFooterFont(footerFont);
                });

                $("#pointSelector_footer").change(function () {
                    var point = $(this[this.selectedIndex]).val();
                    var footerFont = m_plot.footerFont();
                    footerFont.th = point
                        m_plot.setFooterFont(footerFont);
                });

                $("#footer").change(function () {
                    //console.log($(this).val())
                    m_plot.setFooter($(this).val());
                });

                $("#title").change(function () {
                    m_plot.setTitle($(this).val());
                });

                $("#bottomScale_title").change(function () {
                    m_plot.setAxisTitle(xBottom, $(this).val());
                });

                $("#topScale_title").change(function () {
                    m_plot.setAxisTitle(xTop, $(this).val());
                });

                $("#leftScale_title").change(function () {
                    m_plot.setAxisTitle(yLeft, $(this).val());
                });

                $("#rightScale_title").change(function () {
                    m_plot.setAxisTitle(yRight, $(this).val());
                });

                $("#show_backbone").change(function () {
                    Utility.enableComponent(m_plot, Enum.Backbone, this.checked);
                });
                $("#show_ticks").change(function () {
                    Utility.enableComponent(m_plot, Enum.Ticks, this.checked);
                    $("#tickLengthRow").toggle(this.checked);
                })

                $("#tick_length").change(function () {

                    Utility.setTickLength(m_plot, $(this).val());
                })
                $("#show_labels").change(function () {
                    Utility.enableComponent(m_plot, Enum.Labels, this.checked);
                });

                $("#showline").change(function () {
                    Static.showline = this.checked;
                });

                $("#showsymbol").change(function () {
                    Static.showsymbol = this.checked;

                });

                $("#enableUserScale").change(function () {
                    //m_plot.setAxisTitle(yRight, $(this).val())
                    //console.log(this.checked)
                    setReadonly(!this.checked);
                });

                // $("#bottom_min").change(function () {
                // 	console.log($(this).val(), $("#bottom_max").val())
                //     //m_plot.setAxisScale(10, 100)//xBottom, $(this).val(), $("#bottom_max").val())
                // 	m_plot.setAxisScale(xBottom, parseFloat($(this).val()), 100)
                // });

                // $("#bottom_max").change(function () {
                // 	console.log($("#bottom_min").val(), $(this).val())
                //     m_plot.setAxisScale(xBottom, $("#bottom_min").val(),
                //     $(this).val())
                // });

                $("#okButton").click(function () {
                    if ($("#enableUserScale")[0].checked) {
                        m_plot.setAxisScale(xBottom, parseFloat($("#bottom_min").val()),
                            parseFloat($("#bottom_max").val()));
                        m_plot.setAxisScale(yLeft, parseFloat($("#left_min").val()),
                            parseFloat($("#left_max").val()));
                        m_plot.setAxisScale(xTop, parseFloat($("#top_min").val()),
                            parseFloat($("#top_max").val()));
                        m_plot.setAxisScale(yRight, parseFloat($("#right_min").val()),
                            parseFloat($("#right_max").val()));
                    }
                });

                $("#bottom_log").change(function () {
                    $("#bottom_logBase").attr("readonly", false);
                    m_plot.setAxisScaleEngine(xBottom, new LogScaleEngine());
                    $("#margin_bottom").val(0);
                    Static.trigger("scaleEngineChanged", "LogScaleEngine")
                });

                $("#bottom_logBase").change(function () {
                    m_plot.axisScaleEngine(yLeft).setBase($(this).val());
                    m_plot.replot();
                });

                $("#bottom_linear").change(function () {
                    $("#bottom_logBase").attr("readonly", true);
                    m_plot.setAxisScaleEngine(xBottom, new LinearScaleEngine());
                    $("#margin_bottom").val(0)
                    Static.trigger("scaleEngineChanged", "LinearScaleEngine")
                });

                $("#left_log").change(function () {
                    //console.log(44)
                    $("#left_logBase").attr("readonly", false);
                    $("#margin_left").val(0)
                    m_plot.setAxisScaleEngine(yLeft, new LogScaleEngine())
                    Static.trigger("scaleEngineChanged", "LogScaleEngine")
                });
                $("#left_logBase").change(function () {
                    m_plot.axisScaleEngine(yLeft).setBase($(this).val())
                    m_plot.replot();
                });

                $("#left_linear").change(function () {
                    $("#left_logBase").attr("readonly", true);
                    m_plot.setAxisScaleEngine(yLeft, new LinearScaleEngine());
                    $("#margin_left").val(0);
                    Static.trigger("scaleEngineChanged", "LinearScaleEngine")
                });

                $("#top_log").change(function () {
                    $("#top_logBase").attr("readonly", false);
                    m_plot.setAxisScaleEngine(xTop, new LogScaleEngine());
                    $("#margin_top").val(0)
                    Static.trigger("scaleEngineChanged", "LogScaleEngine");
                });

                $("#top_logBase").change(function () {
                    m_plot.axisScaleEngine(yLeft).setBase($(this).val());
                    m_plot.replot();
                });

                $("#top_linear").change(function () {
                    $("#top_logBase").attr("readonly", true);
                    m_plot.setAxisScaleEngine(xTop, new LinearScaleEngine());
                    $("#margin_top").val(0);
                    Static.trigger("scaleEngineChanged", "LinearScaleEngine")
                });

                $("#right_log").change(function () {
                    //console.log(44)
                    $("#right_logBase").attr("readonly", false);
                    m_plot.setAxisScaleEngine(yRight, new LogScaleEngine());
                    $("#margin_right").val(0);
                    Static.trigger("scaleEngineChanged", "LogScaleEngine");
                });

                $("#right_logBase").change(function () {
                    m_plot.axisScaleEngine(yLeft).setBase($(this).val());
                    m_plot.replot();
                });

                $("#right_linear").change(function () {
                    $("#right_logBase").attr("readonly", true);
                    m_plot.setAxisScaleEngine(yRight, new LinearScaleEngine());
                    $("#margin_right").val(0);
                    Static.trigger("scaleEngineChanged", "LinearScaleEngine");
                });

                $("#bottom_decimalPlaces").change(function () {
                    m_plot.setAxisDecimalPlaces(xBottom, parseInt($(this).val()));
                });

                $("#top_decimalPlaces").change(function () {
                    m_plot.setAxisDecimalPlaces(xTop, parseInt($(this).val()));
                });
                $("#left_decimalPlaces").change(function () {
                    m_plot.setAxisDecimalPlaces(yLeft, parseInt($(this).val()));
                });
                $("#right_decimalPlaces").change(function () {
                    m_plot.setAxisDecimalPlaces(yRight, parseInt($(this).val()));
                });

            }

        }

        this.plot = function () {
            return m_plot;
        }

        this.settingsDlg = function () {
            $("#myModal").modal({
                backdrop: "static"
            });
            //m_plot.setAxisScale(xBottom, 10, 100)


            /////////////
            var titleFont = m_plot.titleFont();
            var selectedIndex = fonts.indexOf(titleFont.name);
            if (selectedIndex == -1) {
                selectedIndex = 0;
            }
            $("#fontSelector")[0].selectedIndex = selectedIndex;
            $("#pointSelector").val(titleFont.th);
            $("#colorTitle").val(titleFont.fontColor);
            $("#title").val(m_plot.title());

            var footerFont = m_plot.footerFont();
            selectedIndex = fonts.indexOf(footerFont.name);
            if (selectedIndex == -1) {
                selectedIndex = 0;
            }
            $("#fontSelector_footer")[0].selectedIndex = selectedIndex;
            $("#pointSelector_footer").val(footerFont.th);
            $("#colorSelector_footer").val(footerFont.fontColor);
            $("#footer").val(m_plot.footer());

            var axisTitleFont = m_plot.axisTitleFont(xBottom);
            //console.log(axisTitleFont)
            selectedIndex = fonts.indexOf(axisTitleFont.name);
            if (selectedIndex == -1) {
                selectedIndex = 0;
            }
            $("#axisTitleFontSelector")[0].selectedIndex = selectedIndex;
            $("#axisTitlePointSelector").val(axisTitleFont.th);
            $("#axisColorTitle").val(axisTitleFont.fontColor);
            //$("#footer").val(m_plot.footer());


            $("#colorSelector_background").val(Static.RGB2HTML(m_plot.plotBackground()));

            $("#bottomScale_title").val(m_plot.axisTitle(xBottom));
            $("#topScale_title").val(m_plot.axisTitle(xTop));
            $("#leftScale_title").val(m_plot.axisTitle(yLeft));
            $("#rightScale_title").val(m_plot.axisTitle(yRight));
            /////////////////////////

            $("#footer").val(m_plot.footer());
            //$("#title").val(m_plot.title())

            // console.log(m_plot.axisInterval(xBottom).maxValue())
            var intv = m_plot.axisInterval(xBottom);
            $("#bottom_min").val(intv.minValue());
            $("#bottom_max").val(intv.maxValue());
            intv = m_plot.axisInterval(yLeft);
            $("#left_min").val(intv.minValue());
            $("#left_max").val(intv.maxValue());
            intv = m_plot.axisInterval(xTop);
            $("#top_min").val(intv.minValue());
            $("#top_max").val(intv.maxValue());
            intv = m_plot.axisInterval(yRight);
            $("#right_min").val(intv.minValue());
            $("#right_max").val(intv.maxValue());

            if (m_plot.axisScaleEngine(xBottom).toString() == "[LogScaleEngine]") {
                $("#bottom_log")[0].checked = true;
            }
            if (m_plot.axisScaleEngine(xTop).toString() == "[LogScaleEngine]") {
                $("#top_log")[0].checked = true;
            }
            if (m_plot.axisScaleEngine(yLeft).toString() == "[LogScaleEngine]") {
                $("#left_log")[0].checked = true;
            }
            if (m_plot.axisScaleEngine(yRight).toString() == "[LogScaleEngine]") {
                $("#right_log")[0].checked = true;
            }

            if (m_plot.axisScaleEngine(xBottom).toString() == "[LinearScaleEngine]") {
                $("#bottom_linear")[0].checked = true;
            }
            if (m_plot.axisScaleEngine(xTop).toString() == "[LinearScaleEngine]") {
                $("#top_linear")[0].checked = true;
            }
            if (m_plot.axisScaleEngine(yLeft).toString() == "[LinearScaleEngine]") {
                $("#left_linear")[0].checked = true;
            }
            if (m_plot.axisScaleEngine(yRight).toString() == "[LinearScaleEngine]") {
                $("#right_linear")[0].checked = true;
            }

            var autoScale = m_plot.axisAutoScale(xBottom)
                $("#enableUserScale")[0].checked = !autoScale;
            setReadonly(autoScale);

        }

    } ////
}
