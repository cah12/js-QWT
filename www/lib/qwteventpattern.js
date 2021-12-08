'use strict';
/*!
    \brief Symbolic mouse input codes

    QwtEventPattern implements 3 different settings for
    mice with 1, 2, or 3 buttons that can be activated
    using initMousePattern(). The default setting is for
    3 button mice.

    Individual settings can be configured using setMousePattern().

    \sa initMousePattern(), setMousePattern(), setKeyPattern()
  */

/*! 
  The default setting for 1, 2 and 3 button mice is:

  - Qt::LeftButton 
  - Qt::LeftButton 
  - Qt::LeftButton 
 */
//MousePatternCode...
var MouseSelect1 = 0

/*!
    The default setting for 1, 2 and 3 button mice is:

    - Qt::LeftButton + Qt::ControlModifier
    - Qt::RightButton
    - Qt::RightButton
   */
var MouseSelect2 = 1;

/*!
    The default setting for 1, 2 and 3 button mice is:

    - Qt::LeftButton + Qt::AltModifier
    - Qt::LeftButton + Qt::AltModifier
    - Qt::MidButton
   */
var MouseSelect3 = 2;

/*!
    The default setting for 1, 2 and 3 button mice is:

    - Qt::LeftButton + Qt::ShiftModifier
    - Qt::LeftButton + Qt::ShiftModifier
    - Qt::LeftButton + Qt::ShiftModifier
   */
var MouseSelect4 = 3;

/*!
    The default setting for 1, 2 and 3 button mice is:

    - Qt::LeftButton + Qt::ControlButton | Qt::ShiftModifier
    - Qt::RightButton + Qt::ShiftModifier
    - Qt::RightButton + Qt::ShiftModifier
   */
var MouseSelect5 = 4;

/*!
    The default setting for 1, 2 and 3 button mice is:

    - Qt::LeftButton + Qt::AltModifier + Qt::ShiftModifier
    - Qt::LeftButton + Qt::AltModifier | Qt::ShiftModifier
    - Qt::MidButton + Qt::ShiftModifier
   */
var MouseSelect6 = 5;

//! Number of mouse patterns
var MousePatternCount = 6;


//-------------------------------------------------------------------
/*!
  \brief Symbolic keyboard input codes

  Individual settings can be configured using setKeyPattern()

  \sa setKeyPattern(), setMousePattern()
*/
// KeyPatternCode

//! Qt::Key_Return
var KeySelect1 = 0;

//! Qt::Key_Space
var KeySelect2 = 1;

//! Qt::Key_Escape
var KeyAbort = 2;

//! Qt::Key_Left
var KeyLeft = 3;

//! Qt::Key_Right
var KeyRight = 4;

//! Qt::Key_Up
var KeyUp = 5;

//! Qt::Key_Down
var KeyDown = 6;

//! Qt::Key_Plus
var KeyRedo = 7;

//! Qt::Key_Minus
var KeyUndo = 8;

//! Qt::Key_Escape
var KeyHome = 9;

//! Number of key patterns
var KeyPatternCount = 10;


//! A pattern for mouse events

function MousePattern(btn, modifierCodes) {
    this.button = Static.NoButton;
    this.modifiers = Static.NoModifier;
    if (btn !== undefined) {
        this.button = btn;
    }
    if (modifierCodes !== undefined) {
        this.modifiers = modifierCodes;
    }
}


//! A pattern for key events

function KeyPattern(keyCode, modifierCodes) {
    this.key = Static.Key_unknown
    this.modifiers = Static.NoModifier;
    if (keyCode !== undefined) {
        this.key = keyCode;
    }
    if (modifierCodes !== undefined) {
        this.modifiers = modifierCodes;
    }
}


//-----------------------------------------------------------


/*!
  Constructor

  \sa MousePatternCode, KeyPatternCode
*/

/*class EventPattern{ ///EventPattern Start
  constructor(){*/

class EventPattern extends HObject { ///EventPattern Start
    constructor(parent) {
        super(parent)

        var d_mousePattern = [] //= MousePatternCount;
        var d_keyPattern = [] //= KeyPatternCount;
        //--------------public methods----------------------
        this.initMousePattern = function(numButtons) {
            //d_mousePattern.resize( MousePatternCount );
            for (var i = 0; i < MousePatternCount; ++i)
                d_mousePattern.push(new MousePattern());
            //console.log(d_mousePattern)

            switch (numButtons) {
                case 1:
                    {
                        this.setMousePattern(MouseSelect1, Static.LeftButton);
                        this.setMousePattern(MouseSelect2, Static.LeftButton, Static.ControlModifier);
                        this.setMousePattern(MouseSelect3, Static.LeftButton, Static.AltModifier);
                        break;
                    }
                case 2:
                    {
                        this.setMousePattern(MouseSelect1, Static.LeftButton);
                        this.setMousePattern(MouseSelect2, Static.RightButton);
                        this.setMousePattern(MouseSelect3, Static.LeftButton, Static.AltModifier);
                        break;
                    }
                default:
                    {
                        this.setMousePattern(MouseSelect1, Static.LeftButton);
                        this.setMousePattern(MouseSelect2, Static.RightButton);
                        this.setMousePattern(MouseSelect3, Static.MidButton);
                    }
            }
            //console.log(d_mousePattern)
            this.setMousePattern(MouseSelect4, d_mousePattern[MouseSelect1].button,
                d_mousePattern[MouseSelect1].modifiers | Static.ShiftModifier);

            this.setMousePattern(MouseSelect5, d_mousePattern[MouseSelect2].button,
                d_mousePattern[MouseSelect2].modifiers | Static.ShiftModifier);

            this.setMousePattern(MouseSelect6, d_mousePattern[MouseSelect3].button,
                d_mousePattern[MouseSelect3].modifiers | Static.ShiftModifier);

        }

        this.initKeyPattern = function() {
            //d_keyPattern.resize( KeyPatternCount );
            for (var i = 0; i < KeyPatternCount; ++i)
                d_keyPattern.push(new KeyPattern());

            this.setKeyPattern(KeySelect1, Static.Key_Return);
            this.setKeyPattern(KeySelect2, Static.Key_Space);
            this.setKeyPattern(KeyAbort, Static.Key_Escape);

            this.setKeyPattern(KeyLeft, Static.Key_Left);
            this.setKeyPattern(KeyRight, Static.Key_Right);
            this.setKeyPattern(KeyUp, Static.Key_Up);
            this.setKeyPattern(KeyDown, Static.Key_Down);

            this.setKeyPattern(KeyRedo, Static.Key_Plus);
            this.setKeyPattern(KeyUndo, Static.Key_Minus);
            this.setKeyPattern(KeyHome, Static.Key_Escape);
        }

        this.setMousePattern = function(pattern, button, modifiers) {
            if (button == undefined) {
                d_mousePattern = pattern;
            } else {
                if (modifiers == undefined)
                    modifiers = Static.NoModifier
                if (pattern >= 0 && pattern < MousePatternCount) {
                    d_mousePattern[pattern].button = button;
                    d_mousePattern[pattern].modifiers = modifiers;
                }
            }

        }

        this.setKeyPattern = function(pattern, key, modifiers) {
            if (key == undefined) {
                d_mousePattern = pattern;
            } else {
                if (modifiers == undefined)
                    modifiers = Static.NoModifier
                if (pattern >= 0 && pattern < KeyPatternCount) {
                    d_keyPattern[pattern].key = key;
                    d_keyPattern[pattern].modifiers = modifiers;
                }
            }

        }

        this.modifiers = function(event) {
            var _modifiers = Static.NoModifier
            if (event.altKey && event.ctrlKey && event.shiftKey)
                return _modifiers | Static.AltModifier |
                    Static.ControlModifier | Static.ShiftModifier
            if (event.altKey && event.ctrlKey)
                return _modifiers | Static.AltModifier |
                    Static.ControlModifier
            if (event.altKey && event.shiftKey)
                return _modifiers | Static.AltModifier | Static.ShiftModifier
            if (event.ctrlKey && event.shiftKey)
                return _modifiers | Static.ControlModifier | Static.ShiftModifier
            if (event.altKey)
                return _modifiers | Static.AltModifier
            if (event.ctrlKey)
                return _modifiers | Static.ControlModifier
            if (event.shiftKey)
                return _modifiers | Static.ShiftModifier
            return _modifiers
        }

        this.button = function(event) {
            if (event == null)
                return false;
            return event.button
        }

        /*!
      \brief Compare a mouse event with an event pattern.

      A mouse event matches the pattern when both have the same button
      value and in the state value the same key flags(Qt::KeyButtonMask)
      are set.

      \param code Index of the event pattern
      \param event Mouse event
      \return true if matches

      \sa keyMatch()
    */
        this.mouseMatch = function( /*MousePatternCode*/ code, event) {
            if (code >= 0 && code < MousePatternCount)
                return this.mouseMatch2(d_mousePattern[code], event);

            return false;
        }

        /*!
      \brief Compare a mouse event with an event pattern.

      A mouse event matches the pattern when both have the same button
      value and in the state value the same key flags(Qt::KeyButtonMask)
      are set.

      \param pattern Mouse event pattern
      \param event Mouse event
      \return true if matches

      \sa keyMatch()
    */

        this.mouseMatch2 = function(pattern, event) {
            if (event == null)
                return false;

            //const MousePattern mousePattern( event->button(), event->modifiers() );

            //return mousePattern == pattern;
            return ((pattern.button == this.button(event)) && (pattern.modifiers == this.modifiers(event)))
        }




        this.keyPattern = function() {
            return d_keyPattern;
        }

        this.key = function(event) {
            if (event == null)
                return false;
            return event.keyCode

        }

        /*!
  \brief Compare a key event with an event pattern.

  A key event matches the pattern when both have the same key
  value and in the state value the same key flags (Qt::KeyButtonMask)
  are set.

  \param code Index of the event pattern
  \param event Key event
  \return true if matches

  \sa mouseMatch()
*/
        this.keyMatch = function( /*KeyPatternCode*/ code, event) {
            if (code >= 0 && code < KeyPatternCount)
                return this.keyMatch2(d_keyPattern[code], event);

            return false;

        }

        /*!
  \brief Compare a key event with an event pattern.

  A key event matches the pattern when both have the same key
  value and in the state value the same key flags (Qt::KeyButtonMask)
  are set.

  \param pattern Key event pattern
  \param event Key event
  \return true if matches

  \sa mouseMatch()
*/

        this.keyMatch2 = function( /*KeyPattern*/ pattern, event) {
            if (event == null)
                return false;

            //const KeyPattern keyPattern( event->key(), event->modifiers() );
            //return keyPattern == pattern;
            return ((pattern.key == this.key(event)) && (pattern.modifiers == this.modifiers(event)))
        }


        this.initKeyPattern();
        this.initMousePattern(3);
    }
} ///EventPattern End