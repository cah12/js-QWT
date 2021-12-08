"use strict";
///////////////////////////////////Object//////////////////start
/**
 * @classdesc
 * Every object has an {@link HObject#objectName objectName()}. HObjects can receive
 * events through {@link HObject#event event()} and filter the events of other objects.
 * @see {@link HObject#installEventFilter installEventFilter()} 
 * and {@link HObject#eventFilter eventFilter()} for details.
 * 
 *
 */
class HObject {
  /**
   *
   * @param {object} el jQuery element selector
   */
  constructor(el) {
    let self = this;
    let m_isEnabled = false;
    /**
     * @type {HTMLElement}
     */
    let element = $("body");
    let removed = false;
    let m_bind = false;
    this.m_objectName = "jObject";
    this.m_mouseTracking = true;
    this.m_filterObjs = [];

    if (el !== undefined) {
      if (el && el instanceof HObject) {
        element = el.getElement();
      } else {
        element = el;
      }
    }

    let clickEvent = "click";
    let mousedownEvent = "mousedown";
    let mouseupEvent = "mouseup";
    let mousemoveEvent = "mousemove";
    if (Static.isMobile()) {
      clickEvent = "tap";
      mousedownEvent = "touchstart";
      mouseupEvent = "touchend";
      mousemoveEvent = "touchmove";
    }

    /**
     * If a valid HTMLElement exists for this object, this method converts 
     * a "relative to the viewport" point to a "relative to element" point.
     * @param {Misc.Point} pt
     * @returns {Misc.Point} a "relative to element" point on success or the 
     * point passed as argument otherwise.
     */
    this.mapToElement = function (pt) {
      if (!element) return pt;
      let result = new Misc.Point();
      let rect = element[0].getBoundingClientRect();
      result.x = pt.x - rect.left;
      result.y = pt.y - rect.top;
      return result;
    };

    /**
     * Sets the element for this object.
     * @param {HTMLElement} el
     */
    this.setElement = function (el) {
      element = el;
    };

    /**
     *
     * @returns {HTMLElement} The element associated with this object.
     */
    this.getElement = function () {
      return element;
    };

    /**
     * En/disable the object. When enabled is true an event filter is 
     * installed for the observed widget, otherwise the
     * event filter is removed.
     * @see {@link Magnifier#isEnabled isEnabled()} and 
     * {@link Magnifier#eventFilter eventFilter()}
     * @param {boolean} on  true or false
     */
    this.setEnabled_1 = function (on) {
      if (m_isEnabled != on) {
        m_isEnabled = on;
        this.elementEvent(m_isEnabled);
        if (m_isEnabled) {
          Static.trigger("enabled");
        }
      }
    };

    /**
     * This virtual function receives events to an object and 
     * should return true if the event e was recognized and processed.
     * @param {Event} event
     * @returns {boolean}
     */
    this.event = function (event) {
      return true;
    };

    this.elementEventOnCb = function (event) {
      if (self.m_filterObjs.length) {
        self.m_filterObjs.forEach(function (filterObj) {
          if (!filterObj.eventFilter(self, event)) return self.event(event);
        });
      } else {
        return self.event(event);
      }
    };

    this.elementEvent = function (on) {
      if (this instanceof HObject) {
        let self = this;
        if (on) {
          self
            .getElement()
            .on(
              mousedownEvent +
                " " +
                mouseupEvent +
                " " +
                mousemoveEvent +
                " " +
                "mouseenter mouseleave mousewheel",
              function (event) {
                self.elementEventOnCb(event);
              }
            );
          $("body").on("keydown keyup", function (event) {
            if (self.m_filterObjs.length) {
              self.m_filterObjs.forEach(function (filterObj) {
                if (!filterObj.eventFilter(self, event))
                  return self.event(event);
              });
            } else {
              return self.event(event);
            }
          });
        } else {
          self
            .getElement()
            .off(
              mousedownEvent +
                " " +
                mouseupEvent +
                " " +
                mousemoveEvent +
                " " +
                "mouseenter mouseleave mousewheel"
            );
          $("body").off("keydown keyup");
        }
      }
    };

    /**
     * An event filter is an object that receives all events that are 
     * sent to this object. The filter can either stop the
     * event or forward it to this object. The event filter filterObj 
     * receives events via its eventFilter() function. The eventFilter() 
     * function must return true if the event should be filtered 
     * out, (i.e. stopped); otherwise it must return false. If multiple event 
     * filters are installed on a single object, the filter that was installed last is
     * activated first.
     * @param {object} filterObj
     */
    this.installEventFilter = function (filterObj) {
      this.m_filterObjs.push(filterObj);
    };

    /**
     * Removes an event filter object obj from this object. The request 
     * is ignored if such an event filter has not been installed.
     * @param {object} Obj
     */
    this.removeEventFilter = function (obj) {
      let index = this.m_filterObjs.indexOf(obj);
      if (index > -1) {
        this.m_filterObjs.splice(index, 1);
      }
    };

    /**
     *
     * @returns {boolean} true / false
     */
    this.isEnabled = function () {
      return m_isEnabled;
    };

    /**
     *
     * @returns {string} a string representing the object.
     */
    this.toString = function () {
      return "[HObject]";
    };
  }

  /**
   * Filters events if this object has been installed as an event 
   * filter for the watched object. In your reimplementation of this
   * function, if you want to filter the event out, i.e. stop it 
   * being handled further, return true.
   * @param {boolean} watched
   * @param {Event} event
   */
  eventFilter(watched, event) {
    console.log(`eventFilter() called ${event}`);
  }

  /**
   * Turns on/off mouse tracking. If mouse tracking is on, Html element 
   * associated with this object is bind to move 
   * events (i.e. any move handlers will be called).
   * @param {boolean} on
   */
  setMouseTracking(on) {
    if (this.getElement() && on) {
      let self = this;
      this.getElement().on("mousemove touchmove", function (event) {
        self.elementEventOnCb(event);
      });
      this.m_mouseTracking = true;
    } else {
      this.getElement().off("mousemove touchmove");
      this.m_mouseTracking = false;
    }
  }

  /**
   *
   * @returns {boolean} true / false
   */
  hasMouseTracking() {
    return this.m_mouseTracking;
  }

  /**
   * Sets the object name.
   * @param {string} name
   */
  setObjectName(name) {
    this.m_objectName = name;
  }

  /**
   *
   * @returns {string} The object name.
   */
  objectName() {
    return this.m_objectName;
  }
}
