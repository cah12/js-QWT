"use strict";

/**
 * The widget is the atom of the user interface: it receives mouse, keyboard 
 * and other events from the window system, and paints a representation of 
 * itself on the screen. Every widget is rectangular, and they are sorted 
 * in a Z-order. A widget is clipped by its parent and by the widgets in 
 * front of it.
 * @extends HObject
 */
class Widget extends HObject {
  constructor(el) {
    super(el);
    let self = this;
    let m_visible = true;
    let m_z = 0.0;
    var m_font = new Misc.Font(12);
    let cnvs = $("<canvas />").attr({
      style: "position: absolute; background-color: transparent",
    });
    if (this.getElement()) {
      this.getElement().append(cnvs);
    }

    this.clearCanvas = function () {
      let ctx = this.getContext();
      if (!ctx) return;
      ctx.clearRect(0, 0, cnvs[0].width, cnvs[0].height);
    };

    this.getContext = function () {
      if (!this.getElement()) return null;
      cnvs[0].width = parseFloat(this.getElement().css("width"));
      cnvs[0].height = parseFloat(this.getElement().css("height"));
      return cnvs[0].getContext("2d");
    };

    this.width = function () {
      return cnvs[0].width;
    };

    this.height = function () {
      return cnvs[0].height;
    };

    this.setCanvasParent = function (el) {
      this.getElement().append(cnvs);
    };

    this.getCanvas = function () {
      return cnvs;
    };

    /*Returns the area inside the widget's margins.*/
    this.contentsRect = function () {
      let e = this.getElement();
      return new Misc.Rect(
        0,
        0,
        parseFloat(e.css("width")),
        parseFloat(e.css("height"))
      );
    };

    this.setVisible = function (on) {
      if (on || typeof on === "undefined") {
        this.getCanvas().show();
        m_visible = true;
      } else {
        this.getCanvas().hide();
        m_visible = false;
      }
    };

    this.hide = function () {
      this.setVisible(false);
    };

    this.show = function () {
      this.setVisible(true);
    };

    this.font = function () {
      return m_font;
    };

    this.setFont = function (f) {
      m_font = f;
    };

    this.isVisible = function () {
      return m_visible;
    };

    this.setZ = function (z) {
      if (m_z !== z) {
        m_z = z;
        if (cnvs) {
          cnvs.css("zIndex", m_z);
        }
        //this.itemChanged()
      }
    };

    this.getZ = function (z) {
      return m_z;
    };

    this.toString = function () {
      return "[Widget]";
    };
  }

  setElement(el) {
    this.super(el);
    this.setCanvasParent(el);
  }
}
