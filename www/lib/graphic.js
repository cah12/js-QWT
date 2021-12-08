'use strict';
/* function GraphicUtil(){
var svgNS = "http://www.w3.org/2000/svg";
GraphicUtil.Graphic = function(e, w, h){
var m_parent = e;
var m_width = w;
var m_height = h;

var m_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
m_svg.setAttribute('width',w)
m_svg.setAttribute('height',h)
if(this.parent)
this.parent[0].appendChild(m_svg);

this.setParent = function(p){
this.parent = p;
this.parent[0].appendChild(m_svg);
}

this.parent = function(){
return m_parent;
}

this.setWidth = function(w){
m_width = w;
}

this.width = function(){
return m_width;
}

this.setHeight = function(h){
m_height = h;
}

this.height = function(){
return m_height;
}

this.svg = function(){
return m_svg
}

this.toString = function () {
return '[Graphic]';
}
}
}

GraphicUtil() */

/**
 * @classdesc A abstract base class for drawing scales. It can be used to draw linear or logarithmic scales.
 * 
 */
class Graphic {
    /**
     * 
     * @param {*} e 
     * @param {*} w 
     * @param {*} h 
     */
    constructor(e, w, h) {
        //var svgNS = "http://www.w3.org/2000/svg";
        var m_parent = e;
        var m_width = w;
        var m_height = h;

        var m_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        m_svg.setAttribute('width', w)
        m_svg.setAttribute('height', h)
        if (this.parent)
            this.parent[0].appendChild(m_svg);

        this.setParent = function (p) {
            this.parent = p;
            this.parent[0].appendChild(m_svg);
        }

        this.parent = function () {
            return m_parent;
        }

        this.setWidth = function (w) {
            m_width = w;
        }

        this.width = function () {
            return m_width;
        }

        this.setHeight = function (h) {
            m_height = h;
        }

        this.height = function () {
            return m_height;
        }

        this.svg = function () {
            return m_svg
        }

        this.toString = function () {
            return '[Graphic]';
        }
    }
}
