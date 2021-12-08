'use strict';

//! Constructor
//function PickerMachine(/*SelectionType*/ type) { /////////start PickerMachine
/**
 * 
 */
class PickerMachine {
    constructor(/*SelectionType*/ type) {
        Static.Begin = 0;
        Static.Append = 1;
        Static.Move = 2;
        Static.Remove = 3;
        Static.End = 4;
        var d_selectionType = type;
        var d_state = 0;

        //! Return the selection type
        this.selectionType = function () {
            return d_selectionType;
        }

        //! Return the current state
        this.state = function () {
            return d_state;
        }

        //! Change the current state
        this.setState = function (/* int*/ state) {
            d_state = state;
        }

        //! Set the current state to 0.
        this.reset = function () {
            this.setState(0);
        }

    }
} /////////end PickerMachine
Enumerator.enum("SelectionType { NoSelection = -1 , PointSelection , RectSelection , PolygonSelection }", PickerMachine)


//! Constructor
//PickerTrackerMachine.inheritsFrom(PickerMachine) ///Start PickerTrackerMachine
//function PickerTrackerMachine() {

/**
 * 
 */
class PickerTrackerMachine extends PickerMachine {
    constructor() {
        //PickerMachine.call(this, PickerMachine.SelectionType.NoSelection)
        super(PickerMachine.SelectionType.NoSelection);

        //! Transition
        this.transition = function (/*QwtEventPattern*/ p, /*const QEvent*/ e) {
            var cmdList = [];

            switch (e.type) {
                //case QEvent::Enter:
                //case QEvent::MouseMove:
            case 'mouseenter':
            case 'mousemove':
            case 'touchmove': {
                    if (this.state() == 0) {
                        cmdList.push(Static.Begin);
                        cmdList.push(Static.Append);
                        this.setState(1);
                    } else {
                        cmdList.push(Static.Move);
                    }
                    break;
                }
                //case QEvent::Leave:
            case 'mouseleave': {
                    cmdList.push(Static.Remove);
                    cmdList.push(Static.End);
                    this.setState(0);
                }
            default:
                break;
            }

            return cmdList;
        }

    }
} //end PickerTrackerMachine


//! Constructor
//PickerClickPointMachine.inheritsFrom(PickerMachine) ///start PickerClickPointMachine
//function PickerClickPointMachine() {

/**
 * 
 */
class PickerClickPointMachine extends PickerMachine {
    constructor() {
        //PickerMachine.call(this, PickerMachine.SelectionType.PointSelection)
        super(PickerMachine.SelectionType.PointSelection);
        const Enum = Enumerator.getDefaultEnumNampespace();

        //! Transition
        this.transition = function (/*QwtEventPattern*/ eventPattern, event) {
            var cmdList = [];

            switch (event.type) {
                //case QEvent::MouseButtonPress:
            case 'mousedown':
            case 'touchstart': {
                    if (eventPattern.mouseMatch(Enum.MousePatternCode.MouseSelect1, event)) {
                        cmdList.push(Static.Begin);
                        cmdList.push(Static.Append);
                        cmdList.push(Static.End);
                    }
                    break;
                }
                //case QEvent::KeyPress:
            case 'keydown': {
                    var keyEvent = event;
                    if (eventPattern.keyMatch(Enum.KeyPatternCode.KeySelect1, keyEvent)) {
                        //if ( !keyEvent->isAutoRepeat() )
                        {
                            cmdList.push(Static.Begin);
                            cmdList.push(Static.Append);
                            cmdList.push(Static.End);
                        }
                    }
                    break;
                }
            default:
                break;
            }

            return cmdList;
        }

    }
	toString(){
		return '[PickerClickPointMachine]';
	}
} ///end PickerClickPointMachine


//! Constructor
//PickerDragPointMachine.inheritsFrom(PickerMachine);
//function PickerDragPointMachine() { //Start PickerDragPointMachine

/**
 * 
 */
class PickerDragPointMachine extends PickerMachine {
    constructor() {
        //PickerMachine.call(this, PickerMachine.SelectionType.PointSelection)
        super(PickerMachine.SelectionType.PointSelection);

        //! Transition
        this.transition = function (/*QwtEventPattern*/ eventPattern, event) {
            var cmdList = [];

            switch (event.type) {
                //case QEvent::MouseButtonPress:
            case 'mousedown':
            case 'touchstart': {
                    if (eventPattern.mouseMatch(Enum.MousePatternCode.MouseSelect1, event)) {
                        if (this.state() == 0) {
                            cmdList.push(Static.Begin);
                            cmdList.push(Static.Append);
                            this.setState(1);
                        }
                    }
                    break;
                }
                //case QEvent::MouseMove:
            case 'mousemove':
            case 'touchmove':
                //case QEvent::Wheel:
            case 'mousewheel': {
                    if (this.state() != 0)
                        cmdList.push(Static.Move);
                    break;
                }
                //case QEvent::MouseButtonRelease:
            case 'mouseup':
            case 'touchend': {
                    if (this.state() != 0) {
                        cmdList.push(Static.End);
                        this.setState(0);
                    }
                    break;
                }
                //case QEvent::KeyPress:
            case 'keydown': {
                    var keyEvent = event;
                    if (eventPattern.keyMatch(Enum.KeyPatternCode.KeySelect1, keyEvent)) {
                        //if ( !keyEvent->isAutoRepeat() )
                        {
                            if (this.state() == 0) {
                                cmdList.push(Static.Begin);
                                cmdList.push(Static.Append);
                                this.setState(1);
                            } else {
                                cmdList.push(Static.End);
                                this.setState(0);
                            }
                        }
                    }
                    break;
                }
            default:
                break;
            }

            return cmdList;
        }

    }
	toString(){
		return '[PickerDragPointMachine]';
	}
} //End PickerDragPointMachine


//! Constructor
//PickerClickRectMachine.inheritsFrom(PickerMachine); //Start PickerClickRectMachine
//function PickerClickRectMachine() {

/**
 * 
 */
class PickerClickRectMachine extends PickerMachine {
    constructor() {
        //PickerMachine.call(this, PickerMachine.SelectionType.RectSelection)
        super(PickerMachine.SelectionType.RectSelection);
        //! Transition
        this.transition = function (/*QwtEventPattern*/ eventPattern, event) {
            var cmdList = [];

            switch (event.type) {
                //case QEvent::MouseButtonPress:
            case 'mousedown':
            case 'touchstart': {
                    if (eventPattern.mouseMatch(Enum.MousePatternCode.MouseSelect1, event)) {
                        switch (this.state()) {
                        case 0: {
                                cmdList.push(Static.Begin);
                                cmdList.push(Static.Append);
                                this.setState(1);
                                break;
                            }
                        case 1: {
                                // Uh, strange we missed the MouseButtonRelease
                                break;
                            }
                        default: {
                                cmdList.push(Static.End);
                                this.setState(0);
                            }
                        }
                    }
                    break;
                }
                //case QEvent::MouseMove:
            case 'mousemove':
            case 'touchmove':
                //case QEvent::Wheel:
            case 'mousewheel': {
                    if (this.state() != 0)
                        cmdList.push(Static.Move);
                    break;
                }
                //case QEvent::MouseButtonRelease:
            case 'mouseup':
            case 'touchend': {
                    if (eventPattern.mouseMatch(Enum.MousePatternCode.MouseSelect1, event)) {
                        if (this.state() == 1) {
                            cmdList.push(Static.Append);
                            this.setState(2);
                        }
                    }
                    break;
                }
                //case QEvent::KeyPress:
            case 'keydown': {
                    var keyEvent = event;
                    if (eventPattern.keyMatch(Enum.KeyPatternCode.KeySelect1, keyEvent)) {
                        //if ( !keyEvent->isAutoRepeat() )
                        {
                            if (this.state() == 0) {
                                cmdList.push(Static.Begin);
                                cmdList.push(Static.Append);
                                this.setState(1);
                            } else {
                                if (this.state() == 1) {
                                    cmdList.push(Static.Append);
                                    this.setState(2);
                                } else if (this.state() == 2) {
                                    cmdList.push(Static.End);
                                    this.setState(0);
                                }
                            }
                        }
                    }
                    break;
                }
            default:
                break;
            }

            return cmdList;
        }

    }
	
	toString(){
		return '[PickerClickRectMachine]';
	}
} //End PickerClickRectMachine


//! Constructor
//PickerDragRectMachine.inheritsFrom(PickerMachine) //Start PickerDragRectMachine
//function PickerDragRectMachine() {

/**
 * 
 */
class PickerDragRectMachine extends PickerMachine {
    constructor() {
        //PickerMachine.call(this, PickerMachine.SelectionType.RectSelection)
        super(PickerMachine.SelectionType.RectSelection)

        //! Transition
        this.transition = function (/*QwtEventPattern*/ eventPattern, event) {
            var cmdList = [];

            switch (event.type) {
                //case QEvent::MouseButtonPress:
            case 'mousedown':
            case 'touchstart': {
                    if (event.type == 'touchstart' || eventPattern.mouseMatch(Enum.MousePatternCode.MouseSelect1, event)) {
                        if (this.state() == 0) {
                            cmdList.push(Static.Begin);
                            cmdList.push(Static.Append);
                            cmdList.push(Static.Append);
                            this.setState(2);
                        }
                    }
                    break;
                }
                //case QEvent::MouseMove:
            case 'mousemove':
            case 'touchmove':
                //case QEvent::Wheel:
            case 'mousewheel': {
                    if (this.state() != 0)
                        cmdList.push(Static.Move);
                    break;
                }
                //case QEvent::MouseButtonRelease:
            case 'mouseup':
            case 'touchend': {
                    if (this.state() == 2) {
                        cmdList.push(Static.End);
                        this.setState(0);
                    }
                    break;
                }
                //case QEvent::KeyPress:
            case 'keydown': {
                    if (eventPattern.keyMatch(Enum.KeyPatternCode.KeySelect1, event)) {
                        if (this.state() == 0) {
                            cmdList.push(Static.Begin);
                            cmdList.push(Static.Append);
                            cmdList.push(Static.Append);
                            this.setState(2);
                        } else {
                            cmdList.push(Static.End);
                            this.setState(0);
                        }
                    }
                    break;
                }
            default:
                break;
            }

            return cmdList;
        }

    }
	toString(){
		return '[PickerDragRectMachine]';
	}
} //end PickerDragRectMachine


//! Constructor
//PickerPolygonMachine.inheritsFrom(PickerMachine); //Start PickerPolygonMachine
//function PickerPolygonMachine() {

/**
 * 
 */
class PickerPolygonMachine extends PickerMachine {
    constructor() {
        //PickerMachine.call(this, PickerMachine.SelectionType.PolygonSelection)
        super(PickerMachine.SelectionType.PolygonSelection);

        //! Transition
        this.transition = function (/*QwtEventPattern*/ eventPattern, event) {
            var cmdList = [];

            switch (event.type) {
                //case QEvent::MouseButtonPress:
            case 'mousedown':
            case 'touchstart': {
                    if (eventPattern.mouseMatch(Enum.MousePatternCode.MouseSelect1, event)) {
                        if (this.state() == 0) {
                            cmdList.push(Static.Begin);
                            cmdList.push(Static.Append);
                            cmdList.push(Static.Append);
                            this.setState(1);
                        } else {
                            cmdList.push(Static.Append);
                        }
                    }
                    if (eventPattern.mouseMatch(Enum.MousePatternCode.MouseSelect2, event)) {
                        if (this.state() == 1) {
                            cmdList.push(Static.End);
                            this.setState(0);
                        }
                    }
                    break;
                }
                //case QEvent::MouseMove:
            case 'mousemove':
            case 'touchmove':
                //case QEvent::Wheel:
            case 'mousewheel': {
                    if (this.state() != 0)
                        cmdList.push(Static.Move);
                    break;
                }
                //case QEvent::KeyPress:
            case 'keydown': {
                    var keyEvent = event;
                    if (eventPattern.keyMatch(Enum.KeyPatternCode.KeySelect1, keyEvent)) {
                        //if ( !keyEvent->isAutoRepeat() )
                        {
                            if (this.state() == 0) {
                                cmdList.push(Static.Begin);
                                cmdList.push(Static.Append);
                                cmdList.push(Static.Append);
                                this.setState(1);
                            } else {
                                cmdList.push(Static.Append);
                            }
                        }
                    } else if (eventPattern.keyMatch(Enum.KeyPatternCode.KeySelect2, keyEvent)) {
                        //if ( !keyEvent->isAutoRepeat() )
                        {
                            if (this.state() == 1) {
                                cmdList.push(Static.End);
                                this.setState(0);
                            }
                        }
                    }
                    break;
                }
            default:
                break;
            }

            return cmdList;
        }

    }
	toString(){
		return '[PickerPolygonMachine]';
	}
} //End PickerPolygonMachine


//! Constructor
//PickerDragLineMachine.inheritsFrom(PickerMachine);//Start PickerDragLineMachine
//function PickerDragLineMachine(){

/**
 * 
 */
class PickerDragLineMachine extends PickerMachine {
    constructor() {
        //PickerMachine.call(this, PickerMachine.SelectionType.PolygonSelection )
        super(PickerMachine.SelectionType.PolygonSelection);

        //! Transition
        this.transition = function transition(/*QwtEventPattern*/ eventPattern, event) {
            var cmdList = [];

            switch (event.type) {
                //case QEvent::MouseButtonPress:
            case 'mousedown':
            case 'touchstart': {
                    if (eventPattern.mouseMatch(Enum.MousePatternCode.MouseSelect1, event)) {
                        if (this.state() == 0) {
                            cmdList.push(Static.Begin);
                            cmdList.push(Static.Append);
                            cmdList.push(Static.Append);
                            this.setState(1);
                        }
                    }
                    break;
                }
                //case QEvent::KeyPress:
            case 'keydown': {
                    if (eventPattern.keyMatch(Enum.KeyPatternCode.KeySelect1, event)) {
                        if (this.state() == 0) {
                            cmdList.push(Static.Begin);
                            cmdList.push(Static.Append);
                            cmdList.push(Static.Append);
                            this.setState(1);
                        } else {
                            cmdList.push(Static.End);
                            this.setState(0);
                        }
                    }
                    break;
                }
                //case QEvent::MouseMove:
            case 'mousemove':
            case 'touchmove':
                //case QEvent::Wheel:
            case 'mousewheel': {
                    if (this.state() != 0)
                        cmdList.push(Static.Move);

                    break;
                }
                //case QEvent::MouseButtonRelease:
            case 'mouseup':
            case 'touchend': {
                    if (this.state() != 0) {
                        cmdList.push(Static.End);
                        this.setState(0);
                    }
                }
            default:
                break;
            }

            return cmdList;
        }

    }
	toString(){
		return '[PickerDragLineMachine]';
	}
} //End PickerDragLineMachine
